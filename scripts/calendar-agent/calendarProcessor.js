const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

class CalendarProcessor {
  constructor(sourceFile) {
    this.sourceFile = sourceFile;
    this.workbook = null;
    this.sedes = [];
    this.equipos = [];
    this.calendarData = {};
  }

  async loadCalendar() {
    this.workbook = new ExcelJS.Workbook();
    await this.workbook.xlsx.readFile(this.sourceFile);
    await this.extractMetadata();
  }

  async extractMetadata() {
    const sheets = this.workbook.worksheets;

    sheets.forEach(sheet => {
      const sheetName = sheet.name;

      // Parsear hojas como "E29", "E28", etc. para sacar el mes
      if (sheetName.match(/^E\d+$/)) {
        const equipoNum = parseInt(sheetName.substring(1));

        // Extraer datos del equipo
        const data = this.parseSheet(sheet);
        this.calendarData[equipoNum] = data;

        if (!this.equipos.includes(`EQUIPO ${equipoNum}`)) {
          this.equipos.push(`EQUIPO ${equipoNum}`);
        }
      }
    });

    // Asumir que Lima es la sede principal
    this.sedes = ['LIMA'];
  }

  parseSheet(sheet) {
    const data = [];

    sheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const cells = row.values;
        if (cells && cells.length > 0) {
          data.push({
            actividad: cells[1],
            fecha: cells[2],
            hora: cells[3],
            rowData: cells
          });
        }
      }
    });

    return data;
  }

  getSedes() {
    return this.sedes;
  }

  getEquipos() {
    return this.equipos.sort();
  }

  async generateMonthlyCalendar(sede, equipo, month, year) {
    const newWorkbook = new ExcelJS.Workbook();
    const worksheet = newWorkbook.addWorksheet(`${sede}_${equipo}_${month}_${year}`);

    // Configurar estilos
    this.setupStyles(worksheet);

    // Crear encabezado
    worksheet.mergeCells('A1:G1');
    const headerCell = worksheet.getCell('A1');
    headerCell.value = `CALENDARIO ${equipo} - ${this.getMonthName(month)} ${year}`;
    headerCell.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
    headerCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
    headerCell.alignment = { horizontal: 'center', vertical: 'middle' };

    // Crear tabla de calendarios
    this.createCalendarTable(worksheet, sede, equipo, month, year);

    // Ajustar anchos de columna
    worksheet.columns.forEach(col => {
      col.width = 20;
    });

    return newWorkbook;
  }

  setupStyles(worksheet) {
    worksheet.pageSetup = {
      paperSize: worksheet.PAPERSIZE.A4,
      orientation: 'landscape'
    };
    worksheet.margins = { left: 0.5, right: 0.5, top: 0.5, bottom: 0.5 };
  }

  createCalendarTable(worksheet, sede, equipo, month, year) {
    const equipoNum = parseInt(equipo.replace('EQUIPO ', ''));
    const data = this.calendarData[equipoNum] || [];

    // Headers
    const headers = ['ACTIVIDAD', 'FECHA', 'HORA', 'UBICACIÓN', 'RESPONSABLE', 'ESTADO', 'NOTAS'];
    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF70AD47' } };

    // Agregar datos filtrados por mes
    data.forEach(item => {
      const fecha = this.parseFecha(item.fecha);
      if (fecha && fecha.month === month && fecha.year === year) {
        worksheet.addRow([
          item.actividad || '',
          item.fecha || '',
          item.hora || '',
          sede,
          '',
          'PENDIENTE',
          ''
        ]);
      }
    });

    // Agregar filas vacías para edición
    for (let i = 0; i < 5; i++) {
      worksheet.addRow(['', '', '', sede, '', 'PENDIENTE', '']);
    }
  }

  parseFecha(fechaStr) {
    if (!fechaStr) return null;

    const meses = {
      'ENERO': 1, 'FEBRERO': 2, 'MARZO': 3, 'ABRIL': 4, 'MAYO': 5, 'JUNIO': 6,
      'JULIO': 7, 'AGOSTO': 8, 'SEPTIEMBRE': 9, 'OCTUBRE': 10, 'NOVIEMBRE': 11, 'DICIEMBRE': 12
    };

    let month = null, year = null;

    for (const [mesNombre, mesNum] of Object.entries(meses)) {
      if (fechaStr.includes(mesNombre)) {
        month = mesNum;
        break;
      }
    }

    const yearMatch = fechaStr.match(/20\d{2}/);
    if (yearMatch) {
      year = parseInt(yearMatch[0]);
    }

    return month && year ? { month, year } : null;
  }

  getMonthName(month) {
    const meses = ['', 'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
                   'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
    return meses[month] || '';
  }

  async saveCalendar(workbook, fileName) {
    const outputDir = path.join(__dirname, '../../public/calendars');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const filePath = path.join(outputDir, `${fileName}.xlsx`);
    await workbook.xlsx.writeFile(filePath);
    return filePath;
  }
}

module.exports = CalendarProcessor;
