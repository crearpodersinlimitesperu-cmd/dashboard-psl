#!/usr/bin/env node

const express = require('express');
const path = require('path');
const fs = require('fs');
const calendarAPI = require('./calendarAPI');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../public')));

// Crear directorio de calendarios si no existe
const calendarsDir = path.join(__dirname, '../../public/calendars');
if (!fs.existsSync(calendarsDir)) {
  fs.mkdirSync(calendarsDir, { recursive: true });
}

// Rutas de la API de calendario
app.use('/api/calendar', calendarAPI);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'Calendar Agent API',
    version: '1.0.0',
    endpoints: {
      'GET /api/calendar/metadata': 'Obtiene sedes y equipos disponibles',
      'POST /api/calendar/generate': 'Genera un calendario mensual',
      'GET /api/calendar/list': 'Lista calendarios generados',
      'GET /api/calendar/download/:fileName': 'Descarga un calendario'
    }
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: err.message || 'Error interno del servidor'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   🎯 Agente de Automatización Calendarios   ║
║                                        ║
║   Servidor iniciado en puerto ${PORT}    ║
║   http://localhost:${PORT}              ║
╚════════════════════════════════════════╝
  `);
});

module.exports = app;
