import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import calendarAPI from './scripts/calendar-agent/calendarAPI.js';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de API del Calendario
app.use('/api/calendar', calendarAPI);

// Servir archivos estáticos del frontend compilado
const distPath = join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  // SPA fallback - servir index.html para rutas no encontradas
  app.get('*', (req, res) => {
    res.sendFile(join(distPath, 'index.html'));
  });
} else {
  // Fallback si dist no existe
  app.get('/', (req, res) => {
    res.json({
      message: 'Calendar Automation Agent API',
      status: 'online',
      version: '1.2.0',
      endpoints: [
        '/api/calendar/metadata',
        '/api/calendar/generate',
        '/api/calendar/generate-pdf',
        '/api/calendar/list',
        '/api/calendar/download/:fileName',
        '/api/calendar/download-pdf/:fileName'
      ]
    });
  });
}

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   🎯 Agente de Automatización           ║
║   Calendarios - PRODUCCIÓN              ║
║                                        ║
║   Servidor activo en puerto ${PORT}    ║
║   http://localhost:${PORT}            ║
║   http://localhost:${PORT}/calendar    ║
╚════════════════════════════════════════╝
  `);
});
