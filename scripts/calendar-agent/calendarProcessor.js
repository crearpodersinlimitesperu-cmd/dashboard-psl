const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

class CalendarProcessor {
  constructor() {
    this.masterFile = path.join(__dirname, '../../public/uploads/calendario-maestro.xlsx');
    this.logoFile = path.join(__dirname, '../../public/uploads/logo-crear.pdf');
    this.workbook = null;
    this.workbookDataOnly = null;
  }

  async loadMasterCalendar() {
    if (!this.workbook) {
      this.workbook = new ExcelJS.Workbook();
      await this.workbook.xlsx.readFile(this.masterFile);

      // También cargar con datos calculados
      this.workbookDataOnly = new ExcelJS.Workbook();
      await this.workbookDataOnly.xlsx.readFile(this.masterFile, { formulas: false });
    }
  }

  // Obtener lista de equipos disponibles
  async getEquipos() {
    await this.loadMasterCalendar();
    const equipos = [];
    this.workbook.worksheets.forEach(sheet => {
      const match = sheet.name.match(/E(\d+)/);
      if (match) {
        const numEquipo = parseInt(match[1]);
        equipos.push({
          num: numEquipo,
          nombre: `EQUIPO ${numEquipo}`,
          sheet: sheet.name
        });
      }
    });
    return equipos.sort((a, b) => a.num - b.num);
  }

  // Extraer eventos de una hoja de equipo para un mes específico
  async extractEventsForTeam(equipoNum, mes, ano) {
    await this.loadMasterCalendar();

    const sheetName = `E${equipoNum}`;
    const sheet = this.workbookDataOnly.getWorksheet(sheetName);

    if (!sheet) {
      console.warn(`Hoja ${sheetName} no encontrada`);
      return [];
    }

    const eventos = [];
    const mesNum = parseInt(mes);
    const anoNum = parseInt(ano);

    // Leer las filas y extraer eventos
    sheet.eachRow((row, rowNum) => {
      if (rowNum <= 1) return; // Skip header

      const actividad = row.getCell(1).value;
      const fechaCell = row.getCell(30); // Columna AD (30)
      const hora = row.getCell(3).value;

      if (!actividad) return;

      const fecha = fechaCell.value;
      let fechaObj = null;

      if (fecha instanceof Date) {
        fechaObj = fecha;
      } else if (typeof fecha === 'string') {
        // Intentar parsear strings como "DEL 6 AL 8 DE SEPTIEMBRE"
        const fechaParsed = this.parseFechaString(fecha, anoNum);
        if (fechaParsed) {
          fechaObj = fechaParsed.start;
        }
      } else if (typeof fecha === 'number') {
        // Excel date number
        fechaObj = new Date((fecha - 25569) * 86400 * 1000);
      }

      // Verificar si la fecha está en el mes seleccionado
      if (fechaObj && fechaObj.getMonth() + 1 === mesNum && fechaObj.getFullYear() === anoNum) {
        eventos.push({
          actividad: actividad.toString().trim(),
          fecha: fechaObj,
          hora: hora ? hora.toString().trim() : '',
          dia: fechaObj.getDate()
        });
      }
    });

    // Ordenar por día
    eventos.sort((a, b) => a.dia - b.dia);
    console.log(`Encontrados ${eventos.length} eventos para EQUIPO ${equipoNum} en ${mes}/${ano}`);
    return eventos;
  }

  parseFechaString(str, ano) {
    if (!str) return null;

    const meses = {
      'enero': 1, 'febrero': 2, 'marzo': 3, 'abril': 4, 'mayo': 5,
      'junio': 6, 'julio': 7, 'agosto': 8, 'septiembre': 9,
      'octubre': 10, 'noviembre': 11, 'diciembre': 12
    };

    const strLower = str.toLowerCase();

    // Try "DEL 6 AL 8 DE SEPTIEMBRE"
    const match = strLower.match(/del? (\d+)\s+al? (\d+)\s+de\s+(\w+)/);
    if (match) {
      const dia = parseInt(match[1]);
      const mesStr = match[3];
      const mes = meses[mesStr];
      if (mes) {
        return {
          start: new Date(ano, mes - 1, dia),
          end: new Date(ano, mes - 1, parseInt(match[2]))
        };
      }
    }

    // Try "6 DE SEPTIEMBRE"
    const match2 = strLower.match(/(\d+)\s+de\s+(\w+)/);
    if (match2) {
      const dia = parseInt(match2[1]);
      const mesStr = match2[2];
      const mes = meses[mesStr];
      if (mes) {
        return {
          start: new Date(ano, mes - 1, dia)
        };
      }
    }

    return null;
  }

  // Generar PDF con los eventos
  async generatePDF(equipoNum, mes, ano, sede) {
    const eventos = await this.extractEventsForTeam(equipoNum, mes, ano);

    const doc = new PDFDocument({
      size: 'letter',
      margin: 40
    });

    const fileName = `Calendario_E${equipoNum}_${mes}_${ano}.pdf`;
    const filePath = path.join(__dirname, '../../downloads', fileName);

    // Crear directorio si no existe
    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Header
    doc.fontSize(20).font('Helvetica-Bold').text('CALENDARIO DEL EQUIPO', 50, 40, { align: 'center' });

    // Info
    doc.fontSize(12).font('Helvetica');
    doc.text(`Sede: ${sede} | Equipo: EQUIPO ${equipoNum}`, 50, 70, { align: 'center' });

    const meses = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                   'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    doc.fontSize(16).font('Helvetica-Bold').text(`${meses[parseInt(mes)]} ${ano}`, 50, 90, { align: 'center' });

    // Línea separadora
    doc.moveTo(50, 110).lineTo(550, 110).stroke();

    // Tabla de eventos
    let yPos = 130;
    doc.fontSize(11).font('Helvetica-Bold');

    // Headers de tabla
    doc.text('DÍA', 60, yPos);
    doc.text('ACTIVIDAD', 100, yPos);
    doc.text('HORA', 450, yPos);

    yPos += 20;
    doc.moveTo(50, yPos - 5).lineTo(550, yPos - 5).stroke();

    // Contenido
    doc.font('Helvetica').fontSize(10);

    if (eventos.length === 0) {
      doc.text('No hay actividades programadas para este período', 60, yPos + 10);
    } else {
      eventos.forEach(evento => {
        if (yPos > 700) {
          doc.addPage();
          yPos = 50;
        }

        doc.text(evento.dia.toString(), 60, yPos);

        // Texto de actividad (puede ser multiline)
        const actividadText = evento.actividad.substring(0, 60);
        doc.text(actividadText, 100, yPos);

        doc.text(evento.hora, 450, yPos);

        yPos += 20;
        doc.moveTo(50, yPos - 5).lineTo(550, yPos - 5).stroke('lightgray');
      });
    }

    // Footer
    doc.fontSize(8).text('Generado por Sistema CREAR - Automatización de Calendarios', 50, 750, { align: 'center' });

    doc.end();

    return new Promise((resolve, reject) => {
      stream.on('finish', () => resolve(fileName));
      stream.on('error', reject);
    });
  }

  // Generar Excel con los eventos
  async generateExcel(equipoNum, mes, ano, sede) {
    const eventos = await this.extractEventsForTeam(equipoNum, mes, ano);

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Calendario');

    // Headers
    ws.columns = [
      { header: 'DÍA', key: 'dia', width: 10 },
      { header: 'ACTIVIDAD', key: 'actividad', width: 40 },
      { header: 'HORA', key: 'hora', width: 20 }
    ];

    // Estilo headers
    ws.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    ws.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0066CC' } };

    // Datos
    eventos.forEach(evento => {
      ws.addRow({
        dia: evento.dia,
        actividad: evento.actividad,
        hora: evento.hora
      });
    });

    // Auto-fit columns
    ws.columns.forEach(col => {
      col.width = Math.min(50, col.header.length + 10);
    });

    const fileName = `Calendario_E${equipoNum}_${mes}_${ano}.xlsx`;
    const filePath = path.join(__dirname, '../../downloads', fileName);

    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    await wb.xlsx.writeFile(filePath);
    return fileName;
  }
}

module.exports = CalendarProcessor;
