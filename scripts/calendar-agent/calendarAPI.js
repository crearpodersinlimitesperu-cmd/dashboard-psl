const express = require('express');
const CalendarProcessor = require('./calendarProcessor');
const PDFGenerator = require('./pdfGenerator');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const processor = new CalendarProcessor();
const pdfGen = new PDFGenerator();

// Obtener lista de equipos disponibles
router.get('/equipos', async (req, res) => {
  try {
    const equipos = await processor.getEquipos();
    res.json({ equipos });
  } catch (error) {
    console.error('Error getting equipos:', error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener metadata (sedes y equipos)
router.get('/metadata', async (req, res) => {
  try {
    const equipos = await processor.getEquipos();
    const sedes = ['LIMA']; // Solo LIMA por ahora

    res.json({
      sedes,
      equipos: equipos.map(e => e.nombre)
    });
  } catch (error) {
    console.error('Error in /metadata:', error);
    res.status(500).json({
      error: error.message,
      sedes: ['LIMA'],
      equipos: []
    });
  }
});

// Generar Excel
router.post('/generate', async (req, res) => {
  try {
    const { sede, equipo, month, year } = req.body;

    if (!sede || !equipo || !month || !year) {
      return res.status(400).json({
        error: 'Faltan parámetros: sede, equipo, month, year'
      });
    }

    // Extraer número del equipo (ej: "EQUIPO 29" -> 29)
    const equipoNum = parseInt(equipo.split(' ')[1]);

    const fileName = await processor.generateExcel(equipoNum, month, year, sede);

    res.json({
      success: true,
      fileName: fileName.replace('.xlsx', ''),
      message: `Calendario Excel generado: ${fileName}`
    });
  } catch (error) {
    console.error('Error in /generate:', error);
    res.status(500).json({
      error: error.message || 'Error al generar el calendario'
    });
  }
});

// Generar PDF profesional
router.post('/generate-pdf', async (req, res) => {
  try {
    const { sede, equipo, month, year } = req.body;

    if (!sede || !equipo || !month || !year) {
      return res.status(400).json({
        error: 'Faltan parámetros: sede, equipo, month, year'
      });
    }

    // Extraer número del equipo
    const equipoNum = parseInt(equipo.split(' ')[1]);

    // Obtener eventos
    const eventos = await processor.extractEventsForTeam(equipoNum, month, year);

    // Generar PDF profesional
    const fileName = await pdfGen.generatePDF(eventos, equipoNum, month, year, sede);

    res.json({
      success: true,
      fileName: fileName.replace('.pdf', ''),
      message: `Calendario PDF generado: ${fileName}`
    });
  } catch (error) {
    console.error('Error in /generate-pdf:', error);
    res.status(500).json({
      error: error.message || 'Error al generar el PDF'
    });
  }
});

// Listar calendarios generados
router.get('/list', (req, res) => {
  try {
    const downloadDir = path.join(__dirname, '../../downloads');

    if (!fs.existsSync(downloadDir)) {
      return res.json({ calendars: [] });
    }

    const files = fs.readdirSync(downloadDir)
      .filter(f => f.endsWith('.xlsx') || f.endsWith('.pdf'))
      .map(f => {
        const baseName = f.replace(/\.(xlsx|pdf)$/, '');
        const type = f.endsWith('.pdf') ? 'pdf' : 'excel';
        return {
          name: baseName,
          file: f,
          type: type,
          created: fs.statSync(path.join(downloadDir, f)).birthtime
        };
      })
      .sort((a, b) => b.created - a.created);

    res.json({ calendars: files });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Descargar archivo
router.get('/download/:fileName', (req, res) => {
  try {
    const { fileName } = req.params;
    const downloadDir = path.join(__dirname, '../../downloads');

    let filePath;
    if (fileName.endsWith('.xlsx') || fileName.endsWith('.pdf')) {
      filePath = path.join(downloadDir, fileName);
    } else {
      // Intentar encontrar el archivo con cualquier extensión
      const files = fs.readdirSync(downloadDir);
      const found = files.find(f => f.startsWith(fileName));
      if (!found) {
        return res.status(404).json({ error: 'Archivo no encontrado' });
      }
      filePath = path.join(downloadDir, found);
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }

    res.download(filePath);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;
