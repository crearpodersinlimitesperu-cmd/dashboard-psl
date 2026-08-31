const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class PDFGenerator {
  constructor() {
    this.logoFile = path.join(__dirname, '../../public/uploads/logo-crear.pdf');
  }

  async generatePDF(eventos, equipoNum, mes, ano, sede) {
    const doc = new PDFDocument({
      size: 'letter',
      margin: 40,
      bufferPages: true
    });

    const fileName = `Calendario_E${equipoNum}_${mes}_${ano}.pdf`;
    const filePath = path.join(__dirname, '../../downloads', fileName);

    // Crear directorio si no existe
    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // PÁGINA 1: CALENDARIO
    await this.renderCalendarPage(doc, eventos, equipoNum, mes, ano, sede);

    // PÁGINA 2: INFORMACIÓN IMPORTANTE
    doc.addPage();
    this.renderInfoPage(doc);

    doc.end();

    return new Promise((resolve, reject) => {
      stream.on('finish', () => resolve(fileName));
      stream.on('error', reject);
    });
  }

  async renderCalendarPage(doc, eventos, equipoNum, mes, ano, sede) {
    const meses = ['', 'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
                   'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];

    // Título
    doc.fontSize(14).font('Helvetica-Bold')
      .text('CALENDARIO DE MAESTRÍA DEL JUEGO-LIMA', 50, 50);

    // Subtítulo con equipo
    doc.fontSize(12).font('Helvetica-Bold')
      .text(`EQUIPO ${equipoNum} – QUANTUM PHOENIX`, 50, 68);

    // Logo CREAR (esquina superior derecha)
    try {
      doc.image(this.logoFile, 480, 40, { width: 60, height: 60 });
    } catch (e) {
      console.log('Logo no disponible, continuando sin logo');
    }

    // Línea separadora
    doc.strokeColor('#0066CC');
    doc.lineWidth(2);
    doc.moveTo(50, 135).lineTo(550, 135).stroke();

    // TABLA
    const tableTop = 150;
    const rowHeight = 25;
    const col1X = 50;   // ACTIVIDAD
    const col2X = 280;  // FECHA
    const col3X = 430;  // HORA

    const colWidths = {
      actividad: 230,
      fecha: 150,
      hora: 120
    };

    // Headers de tabla
    doc.fillColor('#0066CC');
    doc.rect(col1X, tableTop, colWidths.actividad, rowHeight).fill();
    doc.rect(col2X, tableTop, colWidths.fecha, rowHeight).fill();
    doc.rect(col3X, tableTop, colWidths.hora, rowHeight).fill();

    doc.fillColor('#FFFFFF');
    doc.fontSize(11).font('Helvetica-Bold');
    doc.text('ACTIVIDAD', col1X + 5, tableTop + 5, { width: colWidths.actividad - 10 });
    doc.text('FECHA', col2X + 5, tableTop + 5, { width: colWidths.fecha - 10 });
    doc.text('HORA', col3X + 5, tableTop + 5, { width: colWidths.hora - 10 });

    // Contenido de tabla
    let yPos = tableTop + rowHeight;
    doc.fillColor('#000000');
    doc.fontSize(10);

    const especiales = ['fuego', 'FUEGO'];
    const seccionesHeaders = ['PRIMER FDS', 'SEGUNDO FDS', 'TERCER FDS'];

    eventos.forEach((evento, idx) => {
      // Detectar si es una sección especial
      const isEspecial = especiales.some(e => evento.actividad.toLowerCase().includes(e.toLowerCase()));
      const isSeccion = seccionesHeaders.some(s => evento.actividad.includes(s));

      // Determinar color de fondo
      let bgColor = '#FFFFFF';
      let textColor = '#000000';

      if (isSeccion) {
        bgColor = '#0066CC';
        textColor = '#FFFFFF';
      } else if (isEspecial) {
        bgColor = '#FFFF00';
        textColor = '#000000';
      }

      // Dibuja fondo
      doc.fillColor(bgColor);
      doc.rect(col1X, yPos, colWidths.actividad, rowHeight).fill();
      doc.rect(col2X, yPos, colWidths.fecha, rowHeight).fill();
      doc.rect(col3X, yPos, colWidths.hora, rowHeight).fill();

      // Dibuja texto
      doc.fillColor(textColor);
      doc.fontSize(isSeccion ? 10 : 9).font(isSeccion || isEspecial ? 'Helvetica-Bold' : 'Helvetica');

      // Ajustar texto para que quepa
      const actividad = evento.actividad.substring(0, 80);
      const fecha = `${evento.dia}`;
      const hora = evento.hora.substring(0, 40);

      doc.text(actividad, col1X + 5, yPos + 2, {
        width: colWidths.actividad - 10,
        height: rowHeight - 4,
        align: 'left',
        valign: 'center'
      });

      doc.text(fecha, col2X + 5, yPos + 2, {
        width: colWidths.fecha - 10,
        height: rowHeight - 4,
        align: 'left',
        valign: 'center'
      });

      doc.text(hora, col3X + 5, yPos + 2, {
        width: colWidths.hora - 10,
        height: rowHeight - 4,
        align: 'left',
        valign: 'center'
      });

      yPos += rowHeight;

      // Si se sale de la página, crear nueva
      if (yPos > 700) {
        yPos = tableTop;
        // No crear nueva página aquí, dejar que se maneje en nivel superior
      }
    });

    // Línea final de tabla
    doc.strokeColor('#0066CC');
    doc.lineWidth(1);
    doc.moveTo(col1X, yPos).lineTo(550, yPos).stroke();

    // Bordes de tabla
    doc.strokeColor('#CCCCCC');
    doc.lineWidth(0.5);
    doc.rect(col1X, tableTop, colWidths.actividad, yPos - tableTop).stroke();
    doc.rect(col2X, tableTop, colWidths.fecha, yPos - tableTop).stroke();
    doc.rect(col3X, tableTop, colWidths.hora, yPos - tableTop).stroke();
  }

  renderInfoPage(doc) {
    // Título página 2
    doc.fontSize(14).font('Helvetica-Bold')
      .text('CALENDARIO DE MAESTRÍA DEL JUEGO-LIMA', 50, 50);

    doc.fontSize(12).font('Helvetica-Bold')
      .text('EQUIPO 29 – QUANTUM PHOENIX', 50, 68);

    // Logo esquina derecha
    try {
      doc.image(this.logoFile, 480, 40, { width: 60, height: 60 });
    } catch (e) {
      console.log('Logo no disponible');
    }

    // Línea separadora
    doc.strokeColor('#0066CC');
    doc.lineWidth(2);
    doc.moveTo(50, 135).lineTo(550, 135).stroke();

    // Título de sección
    doc.fillColor('#000000');
    doc.fontSize(16).font('Helvetica-Bold')
      .text('FIN DE TU ENTRENAMIENTO', 50, 160, { align: 'center' });

    // Información importante
    doc.fillColor('#F0F0F0');
    doc.rect(50, 190, 500, 250).fill();

    doc.fillColor('#000000');
    doc.fontSize(11).font('Helvetica-Bold')
      .text('INFORMACIÓN IMPORTANTE', 60, 200);

    doc.fontSize(10).font('Helvetica')
      .text(
        'Puntualidad y Asistencia:\n' +
        'Los horarios de ingreso son puntuales. Si llegas tarde, no podrás continuar con tu equipo en los fines de semana marcados como obligatorios.\n\n' +
        'Restricciones y Vestimenta:\n' +
        'No se permite la asistencia de niños en las actividades y entrenamientos, excepto en las graduaciones del Capítulo 1 y Capítulo 2.\n' +
        'Es indispensable presentar carpetas de futuros imposibles con evidencias actualizadas para ingresar a los fines de semana.\n' +
        'Para participar en actividades, debes vestir la camiseta de tu equipo de color y pantalón jean azul.\n\n' +
        'Invitación Especial:\n' +
        'El cuarto fin de semana es una invitación exclusiva de la empresa Crear Poder sin Límites.',
        60, 220, {
          width: 480,
          align: 'left'
        }
      );

    // Footer
    doc.fontSize(9).font('Helvetica')
      .text('Generado por Sistema CREAR - Automatización de Calendarios', 50, 750, { align: 'center' });
  }
}

module.exports = PDFGenerator;
