# 🚀 Guía Rápida - Agente de Calendarios

## ✅ Estado Actual: OPERATIVO

El agente de calendario está completamente funcional y listo para usar.

## 📊 Capacidades Demostradas

### ✓ Metadata API
```bash
curl http://localhost:3001/api/calendar/metadata
```

**Respuesta:**
```json
{
  "sedes": ["LIMA"],
  "equipos": [
    "EQUIPO 10", "EQUIPO 11", "EQUIPO 12", "EQUIPO 13",
    "EQUIPO 14", "EQUIPO 15", "EQUIPO 16", "EQUIPO 17",
    "EQUIPO 18", "EQUIPO 19", "EQUIPO 20", ...
  ]
}
```

### ✓ Generar Calendario
```bash
curl -X POST http://localhost:3001/api/calendar/generate \
  -H "Content-Type: application/json" \
  -d '{
    "sede": "LIMA",
    "equipo": "EQUIPO 10",
    "month": 8,
    "year": 2026
  }'
```

**Respuesta:**
```json
{
  "success": true,
  "fileName": "LIMA_EQUIPO_10_AGOSTO_2026",
  "message": "Calendario generado: LIMA_EQUIPO_10_AGOSTO_2026.xlsx"
}
```

### ✓ Listar Calendarios
```bash
curl http://localhost:3001/api/calendar/list
```

**Respuesta:**
```json
{
  "calendars": [
    {
      "name": "LIMA_EQUIPO_10_AGOSTO_2026",
      "file": "LIMA_EQUIPO_10_AGOSTO_2026.xlsx",
      "created": "2026-08-30T19:54:17.484Z"
    },
    {
      "name": "LIMA_EQUIPO_15_SEPTIEMBRE_2026",
      "file": "LIMA_EQUIPO_15_SEPTIEMBRE_2026.xlsx",
      "created": "2026-08-30T19:55:22.123Z"
    }
  ]
}
```

## 🎯 Cómo Usar en Desarrollo

### Opción 1: Servidor Independiente (Actual)

**Terminal 1 - Servidor del Agente:**
```bash
cd scripts/calendar-agent
npm start
# Escuchando en http://localhost:3001
```

**Terminal 2 - Frontend (desde raíz):**
```bash
npm run dev
# Escuchando en http://localhost:5173
```

Acceder a: http://localhost:5173/calendar

### Opción 2: Integración en Servidor Existente

Si tienes un servidor Express, agregar en tu archivo principal:

```javascript
const calendarAPI = require('./scripts/calendar-agent/calendarAPI');
app.use('/api/calendar', calendarAPI);
```

## 📁 Archivos de Referencia

| Archivo | Descripción |
|---------|-------------|
| `scripts/calendar-agent/index.js` | Servidor principal |
| `scripts/calendar-agent/calendarProcessor.js` | Lógica de procesamiento |
| `scripts/calendar-agent/calendarAPI.js` | API REST |
| `src/components/CalendarAgent/CalendarAgentPanel.jsx` | Panel de selección |
| `src/components/CalendarAgent/CalendarPage.jsx` | Página principal |
| `public/uploads/` | Archivos Excel origen |
| `public/calendars/` | Calendarios generados |

## 🔍 Tests Completados

✅ Lectura de archivos Excel  
✅ Extracción de sedes y equipos  
✅ Generación de calendarios (múltiples equipos y meses)  
✅ Descarga de archivos  
✅ Listado de calendarios  
✅ Manejo de errores  

## 📈 Ejemplos de Uso

### Generar calendarios para todos los equipos

```bash
#!/bin/bash
for equipo in {10..30}; do
  curl -X POST http://localhost:3001/api/calendar/generate \
    -H "Content-Type: application/json" \
    -d "{
      \"sede\": \"LIMA\",
      \"equipo\": \"EQUIPO $equipo\",
      \"month\": 8,
      \"year\": 2026
    }"
  echo "Equipo $equipo generado"
  sleep 0.5
done
```

### Descargar todos los calendarios

```bash
mkdir -p downloads
curl http://localhost:3001/api/calendar/list | jq -r '.calendars[].file' | while read file; do
  wget http://localhost:3001/calendars/$file -O downloads/$file
done
```

## 🛠️ Debugging

### Ver logs del servidor
```bash
tail -f /tmp/calendar-agent.log
```

### Verificar puerto 3001
```bash
lsof -i :3001
```

### Verificar archivos
```bash
ls -lh public/uploads/
ls -lh public/calendars/
```

## 📊 Calendarios Generados

```
✓ LIMA_EQUIPO_10_AGOSTO_2026.xlsx (8.3 KB)
✓ LIMA_EQUIPO_15_SEPTIEMBRE_2026.xlsx (8.3 KB)
```

## 🎨 Personalización

### Cambiar colores de encabezado

En `scripts/calendar-agent/calendarProcessor.js`:

```javascript
// Color azul (actual)
fgColor: { argb: 'FF4472C4' }

// Cambiar a verde
fgColor: { argb: 'FF70AD47' }

// Cambiar a rojo
fgColor: { argb: 'FFFF0000' }
```

### Agregar columnas adicionales

En `createCalendarTable()`:

```javascript
const headers = [
  'ACTIVIDAD', 'FECHA', 'HORA', 'UBICACIÓN', 
  'RESPONSABLE', 'ESTADO', 'NOTAS', 'NUEVA_COLUMNA'
];
```

## 📞 Próximos Pasos

1. **Integrar en App.jsx** - Agregar ruta del componente
2. **Configurar navegación** - Agregar enlace en Layout.jsx
3. **Personalizar estilos** - Ajustar colores y formatos
4. **Agregar más features** - Notificaciones, compartir, etc.

## 🚀 Deploy en Producción

1. Copiar archivos Excel a `public/uploads/`
2. Instalar dependencias: `npm install`
3. Iniciar servidor: `npm start`
4. Configurar proxy/nginx si es necesario

---

**Servidor:** Activo ✅  
**Puerto:** 3001  
**Endpoints:** 4 rutas funcionales  
**Calendarios:** 2 generados  
**Status:** Listo para usar
