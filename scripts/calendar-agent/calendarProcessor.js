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
      const sheetName = sheet.name.trim();

      // Buscar nombres de equipos en los headers
      const firstRow = sheet.getRow(1);
      if (firstRow && firstRow.values) {
        firstRow.values.forEach((cell, idx) => {
          if (cell && cell.toString().includes('EQUIPO')) {
            const equipoName = cell.toString().trim();
            if (!this.equipos.includes(equipoName)) {
              this.equipos.push(equipoName);
              this.calendarData[equipoName] = this.parseSheet(sheet);
            }
          }
        });
      }

      // También buscar en hojas que representen sedes
      const sedePatterns = ['LIM', 'UIO', 'GYE', 'CUE', 'MED', 'CDMX'];
      if (sedePatterns.some(p => sheetName.includes(p))) {
        const sedeName = sheetName.toUpperCase();
        if (!this.sedes.includes(sedeName)) {
          this.sedes.push(sedeName);
        }
      }
    });

    // Si no se encontraron equipos, crear lista por defecto
    if (this.equipos.length === 0) {
      for (let i = 10; i <= 30; i++) {
        this.equipos.push(`EQUIPO ${i}`);
      }
    }

    // Si no se encontraron sedes, usar LIMA
    if (this.sedes.length === 0) {
      this.sedes = ['LIMA'];
    }
  }

  parseSheet(sheet) {
    const data = [];
    const headers = [];

    sheet.eachRow((row, rowNumber) => {
      const cells = row.values || [];

      if (rowNumber === 1) {
        headers.push(...cells);
      } else if (cells.length > 0) {
        const item = {
          actividad: cells[1],
          fecha: cells[2],
          hora: cells[3],
          rowData: cells
        };

        // Buscar índices de columnas de equipos
        headers.forEach((header, idx) => {
          if (header && header.toString().includes('EQUIPO')) {
            item[header.toString().trim()] = cells[idx];
          }
        });

        data.push(item);
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
    try {
      const newWorkbook = new ExcelJS.Workbook();
      const safeName = `${sede}_${equipo.replace(/\s+/g, '_')}_${month}_${year}`.substring(0, 31);
      const worksheet = newWorkbook.addWorksheet(safeName);

      // Crear encabezado
      worksheet.addRow([`CALENDARIO ${equipo} - ${this.getMonthName(month)} ${year}`]);
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
      headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
      headerRow.height = 25;

      // Espaciador
      worksheet.addRow([]);

      // Crear tabla de calendarios
      this.createCalendarTable(worksheet, sede, equipo, month, year);

      // Ajustar anchos de columna
      worksheet.columns = [
        { width: 30 },
        { width: 20 },
        { width: 20 },
        { width: 15 },
        { width: 20 },
        { width: 15 },
        { width: 30 }
      ];

      return newWorkbook;
    } catch (error) {
      console.error('Error generating calendar:', error);
      throw error;
    }
  }

  setupStyles(worksheet) {
    worksheet.pageSetup = {
      paperSize: 9, // A4
      orientation: 'landscape'
    };
    worksheet.pageMargins = {
      left: 0.5,
      right: 0.5,
      top: 0.5,
      bottom: 0.5
    };
  }

  createCalendarTable(worksheet, sede, equipo, month, year) {
    // Headers
    const headers = ['ACTIVIDAD', 'FECHA', 'HORA', 'UBICACIÓN', 'RESPONSABLE', 'ESTADO', 'NOTAS'];
    const headerRow = worksheet.addRow(headers);

    // Estilo para headers
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF70AD47' } };

    // Obtener datos del equipo seleccionado
    const data = this.calendarData[equipo] || [];

    // Agregar datos filtrados por mes
    if (data.length > 0) {
      data.forEach(item => {
        if (item && item.actividad) {
          const actividad = String(item.actividad).substring(0, 100);
          const fecha = this.parseFecha(item.fecha);

          // Incluir eventos si no hay filtro de mes o si coincide el mes
          if (!fecha || !fecha.year || (fecha.month === month && fecha.year === year)) {
            worksheet.addRow([
              actividad,
              this.formatFecha(item.fecha),
              this.formatHora(item.hora),
              sede,
              '',
              'PENDIENTE',
              ''
            ]);
          }
        }
      });
    }

    // Agregar filas vacías para edición
    for (let i = 0; i < 5; i++) {
      const row = worksheet.addRow(['', '', '', sede, '', 'PENDIENTE', '']);
      row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF0' } };
    }
  }

  formatFecha(fecha) {
    if (!fecha) return '';
    if (fecha instanceof Date) {
      return fecha.toLocaleDateString('es-ES');
    }
    return String(fecha).substring(0, 50);
  }

  formatHora(hora) {
    if (!hora) return '';
    if (hora instanceof Date) {
      return hora.toLocaleTimeString('es-ES');
    }
    return String(hora).substring(0, 30);
  }

  parseFecha(fechaStr) {
    if (!fechaStr) return null;

    // Convertir a string si es date o número
    const dateString = fechaStr.toString ? fechaStr.toString().toUpperCase() : '';

    const meses = {
      'ENERO': 1, 'FEBRUARY': 2, 'FEBRUARY': 2, 'FEBRERO': 2,
      'MARZO': 3, 'APRIL': 4, 'ABRIL': 4, 'MAYO': 5, 'MAY': 5,
      'JUNIO': 6, 'JUNE': 6, 'JULIO': 7, 'JULY': 7,
      'AGOSTO': 8, 'AUGUST': 8, 'SEPTIEMBRE': 9, 'SEPTEMBER': 9,
      'OCTUBRE': 10, 'OCTOBER': 10, 'NOVIEMBRE': 11, 'NOVEMBER': 11,
      'DICIEMBRE': 12, 'DECEMBER': 12
    };

    let month = null, year = null;

    for (const [mesNombre, mesNum] of Object.entries(meses)) {
      if (dateString.includes(mesNombre)) {
        month = mesNum;
        break;
      }
    }

    const yearMatch = dateString.match(/20\d{2}/);
    if (yearMatch) {
      year = parseInt(yearMatch[0]);
    }

    return month || year ? { month, year } : null;
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
    try {
      await workbook.xlsx.writeFile(filePath);
    } catch (error) {
      // Si hay error, intentar con opciones alternativas
      console.error('Error saving file:', error.message);
      // Crear un nuevo workbook simplificado
      const simpleWb = new ExcelJS.Workbook();
      const ws = simpleWb.addWorksheet('Calendar');

      // Copiar datos del worksheet original
      const originalWs = workbook.worksheets[0];
      if (originalWs) {
        originalWs.eachRow((row, rowNumber) => {
          const newRow = ws.addRow(row.values);
          if (row.font) newRow.font = row.font;
          if (row.fill) newRow.fill = row.fill;
        });
      }

      await simpleWb.xlsx.writeFile(filePath);
    }
    return filePath;
  }
}

module.exports = CalendarProcessor;
