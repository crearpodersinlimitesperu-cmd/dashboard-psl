# 📅 Agente de Automatización de Calendarios

Sistema inteligente para la generación automática de calendarios mensuales por equipo y sede.

## 🎯 Características

- ✅ Generación automática de calendarios mes a mes
- ✅ Filtrado por Sede y Equipo
- ✅ Exportación a Excel con formato profesional
- ✅ Interfaz intuitiva y fácil de usar
- ✅ Descargas directas sin necesidad de configuración
- ✅ Base de datos de eventos por equipo
- ✅ Historial de calendarios generados

## 🚀 Instalación

### Requisitos
- Node.js 14+
- npm o yarn
- ExcelJS para manipulación de archivos Excel

### Pasos de Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar archivos de calendario a public/uploads/
cp Calendario_Maestr_a_Del_Juego_LIMA.xlsx public/uploads/
cp PROGRAMACION_2026_CREAR_LIMA.xlsx public/uploads/

# 3. Iniciar el agente
npm run calendar-agent
```

## 📋 Estructura de Archivos

```
scripts/calendar-agent/
├── index.js                 # Servidor principal
├── calendarAPI.js          # Rutas de API REST
├── calendarProcessor.js    # Lógica de procesamiento
└── README.md              # Esta documentación

src/components/CalendarAgent/
├── CalendarAgentPanel.jsx  # Panel de selección
├── CalendarPage.jsx        # Página principal
└── ...otros componentes
```

## 🔧 Uso

### Via API REST

#### 1. Obtener metadata (Sedes y Equipos)
```bash
GET /api/calendar/metadata

Respuesta:
{
  "sedes": ["LIMA"],
  "equipos": ["EQUIPO 10", "EQUIPO 11", "EQUIPO 12", ...]
}
```

#### 2. Generar Calendario
```bash
POST /api/calendar/generate

Body:
{
  "sede": "LIMA",
  "equipo": "EQUIPO 10",
  "month": 8,        # Agosto
  "year": 2026
}

Respuesta:
{
  "success": true,
  "fileName": "LIMA_EQUIPO_10_AGOSTO_2026"
}
```

#### 3. Listar Calendarios Generados
```bash
GET /api/calendar/list

Respuesta:
{
  "calendars": [
    {
      "name": "LIMA_EQUIPO_10_AGOSTO_2026",
      "file": "LIMA_EQUIPO_10_AGOSTO_2026.xlsx",
      "created": "2026-08-30T10:30:00.000Z"
    }
  ]
}
```

#### 4. Descargar Calendario
```bash
GET /api/calendar/download/:fileName

Descarga el archivo: fileName.xlsx
```

### Via Interfaz Web

1. **Acceder al Dashboard**
   - Navega a `/calendar`

2. **Seleccionar Opciones**
   - Elige la Sede (LIMA)
   - Selecciona el Equipo deseado
   - Elige el Mes y Año

3. **Generar Calendario**
   - Haz clic en "Generar Calendario"
   - Espera a que se complete la generación

4. **Descargar**
   - Haz clic en "Descargar"
   - Se guardará en tu carpeta de descargas

## 📊 Formato del Calendario Generado

Cada calendario incluye:

| Columna | Descripción |
|---------|-------------|
| ACTIVIDAD | Nombre del evento/actividad |
| FECHA | Fecha del evento |
| HORA | Hora de inicio |
| UBICACIÓN | Sede/Ubicación |
| RESPONSABLE | Persona responsable (editable) |
| ESTADO | Estado actual (PENDIENTE, EN CURSO, COMPLETADO) |
| NOTAS | Observaciones adicionales |

## 🎨 Personalización

### Cambiar Colores
Edita `calendarProcessor.js`:

```javascript
headerCell.fill = { 
  type: 'pattern', 
  pattern: 'solid', 
  fgColor: { argb: 'FFFFFFFF' } // Cambiar este color
};
```

### Agregar más columnas
Modifica el método `createCalendarTable()` en `calendarProcessor.js`

### Cambiar estilos de fuente
Edita `setupStyles()` para ajustar tipografía, tamaños, etc.

## 🔌 Integración con el Dashboard

Para agregar el componente CalendarAgent al dashboard principal:

```jsx
// En App.jsx o tu componente principal
import CalendarPage from './components/CalendarAgent/CalendarPage';

// Agregar ruta
<Route path="/calendar" element={<CalendarPage />} />
```

## 📁 Gestión de Archivos

### Archivos de Entrada
- Ubicación: `public/uploads/`
- Formatos soportados: `.xlsx`
- El sistema detecta automáticamente los archivos de calendario

### Calendarios Generados
- Ubicación: `public/calendars/`
- Formato: `.xlsx` (Excel)
- Nombre: `{SEDE}_{EQUIPO}_{MES}_{AÑO}.xlsx`

## 🐛 Resolución de Problemas

### "No se encontró archivo de calendario"
**Solución:** Copiar los archivos Excel a `public/uploads/`

```bash
cp *.xlsx public/uploads/
```

### Error en generación
**Solución:** Verificar que el puerto 3001 esté disponible

```bash
lsof -i :3001  # Ver qué usa el puerto
kill -9 <PID>  # Liberar puerto
```

### Calendarios no se descargan
**Solución:** Crear el directorio si no existe

```bash
mkdir -p public/calendars
chmod 755 public/calendars
```

## 📈 Mejoras Futuras

- [ ] Sincronización con Google Calendar
- [ ] Notificaciones automáticas
- [ ] Plantillas personalizables
- [ ] Exportación a PDF
- [ ] Calendario compartido (cloud)
- [ ] API de integración externa
- [ ] Dashboard de analíticos
- [ ] Histórico de cambios

## 📞 Soporte

Para reportar bugs o solicitar features:
1. Abre un issue en el repositorio
2. Describe el problema con detalle
3. Incluye pasos para reproducir

## 📄 Licencia

Todos los derechos reservados.

---

**Versión:** 1.0.0  
**Último actualizado:** 2026-08-30  
**Mantenedor:** Dashboard PSL Team
