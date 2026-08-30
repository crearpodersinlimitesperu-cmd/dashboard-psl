const express = require('express');
const CalendarProcessor = require('./calendarProcessor');
const path = require('path');
const fs = require('fs');

const router = express.Router();

let calendarProcessor = null;

// Inicializar el procesador con el archivo de calendario
async function initializeProcessor(sourceFile) {
  if (!calendarProcessor) {
    calendarProcessor = new CalendarProcessor(sourceFile);
    await calendarProcessor.loadCalendar();
  }
  return calendarProcessor;
}

// Ruta: Obtener metadata (sedes y equipos)
router.get('/metadata', async (req, res) => {
  try {
    // Buscar el archivo de calendario en el directorio de uploads
    const uploadsDir = path.join(__dirname, '../../public/uploads');
    const calendarFile = findCalendarFile(uploadsDir);

    if (!calendarFile) {
      return res.status(400).json({
        error: 'No se encontró archivo de calendario',
        sedes: ['LIMA'],
        equipos: ['EQUIPO 10', 'EQUIPO 11', 'EQUIPO 12', 'EQUIPO 13', 'EQUIPO 14', 'EQUIPO 15']
      });
    }

    const processor = await initializeProcessor(calendarFile);
    const sedes = processor.getSedes();
    const equipos = processor.getEquipos();

    res.json({ sedes, equipos });
  } catch (error) {
    console.error('Error en /metadata:', error);
    res.status(500).json({
      error: error.message,
      sedes: ['LIMA'],
      equipos: []
    });
  }
});

// Ruta: Generar calendario
router.post('/generate', async (req, res) => {
  try {
    const { sede, equipo, month, year } = req.body;

    if (!sede || !equipo || !month || !year) {
      return res.status(400).json({
        error: 'Faltan parámetros: sede, equipo, month, year'
      });
    }

    // Buscar el archivo de calendario
    const uploadsDir = path.join(__dirname, '../../public/uploads');
    const calendarFile = findCalendarFile(uploadsDir);

    const processor = await initializeProcessor(calendarFile);
    const workbook = await processor.generateMonthlyCalendar(sede, equipo, month, year);

    // Generar nombre del archivo
    const monthName = processor.getMonthName(month);
    const fileName = `${sede}_${equipo.replace(/\s+/g, '_')}_${monthName}_${year}`;

    // Guardar el archivo
    await processor.saveCalendar(workbook, fileName);

    res.json({
      success: true,
      fileName: fileName,
      message: `Calendario generado: ${fileName}.xlsx`
    });
  } catch (error) {
    console.error('Error en /generate:', error);
    res.status(500).json({
      error: error.message || 'Error al generar el calendario'
    });
  }
});

// Ruta: Listar calendarios generados
router.get('/list', (req, res) => {
  try {
    const calendarDir = path.join(__dirname, '../../public/calendars');

    if (!fs.existsSync(calendarDir)) {
      return res.json({ calendars: [] });
    }

    const files = fs.readdirSync(calendarDir)
      .filter(f => f.endsWith('.xlsx'))
      .map(f => ({
        name: f.replace('.xlsx', ''),
        file: f,
        created: fs.statSync(path.join(calendarDir, f)).birthtime
      }))
      .sort((a, b) => b.created - a.created);

    res.json({ calendars: files });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Ruta: Descargar calendario
router.get('/download/:fileName', (req, res) => {
  try {
    const { fileName } = req.params;
    const filePath = path.join(__dirname, '../../public/calendars', `${fileName}.xlsx`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }

    res.download(filePath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Función auxiliar para encontrar el archivo de calendario
function findCalendarFile(dir) {
  if (!fs.existsSync(dir)) return null;

  const files = fs.readdirSync(dir);

  // Preferir archivos que contengan "Calendario" sobre "PROGRAMACION"
  let excelFile = files.find(f =>
    f.endsWith('.xlsx') && f.includes('Calendario')
  );

  // Si no hay archivo de calendario, buscar cualquier .xlsx
  if (!excelFile) {
    excelFile = files.find(f =>
      f.endsWith('.xlsx') &&
      (f.includes('Calendario') || f.includes('PROGRAMACION') || f.includes('calendario'))
    );
  }

  // Si sigue sin encontrar, tomar el primer .xlsx
  if (!excelFile) {
    excelFile = files.find(f => f.endsWith('.xlsx'));
  }

  return excelFile ? path.join(dir, excelFile) : null;
}

module.exports = router;
