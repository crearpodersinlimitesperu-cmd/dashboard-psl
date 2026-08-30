# 📅 Guía de Integración - Agente de Calendarios

## Descripción General

El **Agente de Automatización de Calendarios** es un sistema inteligente que permite generar automáticamente calendarios mensuales por equipo y sede. Está diseñado para integrarse perfectamente en tu dashboard existente.

## 🚀 Pasos de Integración

### Paso 1: Instalación Básica

```bash
# Navegar al directorio del agente
cd scripts/calendar-agent

# Ejecutar setup
chmod +x setup.sh
./setup.sh

# Instalar dependencias (si no se instalaron en setup)
npm install
```

### Paso 2: Copiar Archivos Excel

Copia tus archivos de calendario al directorio de uploads:

```bash
# Desde el directorio raíz del proyecto
cp /ruta/a/Calendario_Maestr_a_Del_Juego_LIMA.xlsx public/uploads/
cp /ruta/a/PROGRAMACION_2026_CREAR_LIMA.xlsx public/uploads/

# Verificar que se copiaron correctamente
ls -la public/uploads/
```

### Paso 3: Agregar Rutas en App.jsx

Edita `src/App.jsx` y agrega la importación y ruta:

```jsx
// Importar el componente
import CalendarPage from './components/CalendarAgent/CalendarPage';

// Dentro del componente principal, en la sección de rutas (Router):
<Route path="/calendar" element={<CalendarPage />} />

// Ejemplo completo:
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas existentes */}
        <Route path="/" element={<Dashboard />} />
        
        {/* Nueva ruta del agente de calendario */}
        <Route path="/calendar" element={<CalendarPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Paso 4: Agregar Enlace en Navegación

Edita `src/components/Layout.jsx` para agregar un enlace al agente de calendario:

```jsx
import { Link } from 'react-router-dom';

export default function Layout({ children }) {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">Dashboard PSL</h1>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link to="/" className="hover:text-blue-600">
              Dashboard
            </Link>
            
            {/* Nuevo enlace */}
            <Link to="/calendar" className="hover:text-blue-600 flex items-center gap-2">
              📅 Calendarios
            </Link>
            
            {/* Otros enlaces */}
          </div>
        </div>
      </div>
    </nav>
  );
}
```

### Paso 5: Configurar Backend

El agente necesita una API backend. Tienes dos opciones:

#### Opción A: Servidor Express Independiente (Recomendado)

```bash
# Terminal 1: Iniciar el servidor del agente
cd scripts/calendar-agent
npm start

# Terminal 2: Iniciar el frontend (desde la raíz del proyecto)
npm run dev
```

El agente estará en `http://localhost:3001`

#### Opción B: Integrar en tu Servidor Existente

Si ya tienes un servidor Express, puedes integrar el agente:

```javascript
// En tu archivo de servidor principal (ej: server.js)
const calendarAPI = require('./scripts/calendar-agent/calendarAPI');

// Registrar las rutas
app.use('/api/calendar', calendarAPI);
```

### Paso 6: Configurar Proxy en Vite

Si usar Opción A, configura el proxy en `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/calendar': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
})
```

## 📋 Estructura de Carpetas Post-Integración

```
dashboard-psl/
├── src/
│   ├── components/
│   │   ├── CalendarAgent/              # ← Nuevo
│   │   │   ├── CalendarAgentPanel.jsx
│   │   │   ├── CalendarPage.jsx
│   │   │   └── index.js
│   │   ├── Layout.jsx                  # ← Modificado
│   │   └── ...otros componentes
│   ├── App.jsx                         # ← Modificado
│   └── main.jsx
├── scripts/
│   └── calendar-agent/                 # ← Nuevo
│       ├── index.js
│       ├── calendarAPI.js
│       ├── calendarProcessor.js
│       ├── package.json
│       └── README.md
├── public/
│   ├── uploads/                        # ← Nuevo
│   │   ├── Calendario_Maestr_a_Del_Juego_LIMA.xlsx
│   │   └── PROGRAMACION_2026_CREAR_LIMA.xlsx
│   ├── calendars/                      # ← Nuevo
│   └── ...otros archivos
├── vite.config.js                      # ← Modificado
└── ...otros archivos
```

## 🧪 Pruebas

### Test 1: Verificar que el agente inicia

```bash
cd scripts/calendar-agent
npm start

# Deberías ver:
# ╔════════════════════════════════════════╗
# ║   🎯 Agente de Automatización...      ║
# ║   Servidor iniciado en puerto 3001    ║
# ╚════════════════════════════════════════╝
```

### Test 2: Verificar API

```bash
# En otra terminal
curl http://localhost:3001/api/calendar/metadata

# Respuesta esperada:
# {"sedes":["LIMA"],"equipos":["EQUIPO 10","EQUIPO 11",...]}
```

### Test 3: Acceder desde el Dashboard

1. Inicia el frontend: `npm run dev`
2. Navega a `http://localhost:5173/calendar`
3. Deberías ver el panel de calendario
4. Selecciona Sede, Equipo, Mes y Año
5. Haz clic en "Generar Calendario"
6. Descarga el archivo Excel

## 🔧 Configuración Avanzada

### Cambiar Puerto del Agente

En `scripts/calendar-agent/index.js`:

```javascript
const PORT = process.env.PORT || 3001;  // Cambiar 3001 por el puerto deseado
```

O usando variable de entorno:

```bash
PORT=3002 npm start
```

### Cambiar Ubicación de Uploads

En `scripts/calendar-agent/.env`:

```
UPLOADS_DIR=/ruta/personalizada/uploads
```

### Personalizar Formato de Calendario

Edita `scripts/calendar-agent/calendarProcessor.js`:

```javascript
// Cambiar colores
headerCell.fill = { 
  type: 'pattern', 
  pattern: 'solid', 
  fgColor: { argb: 'FF000000' }  // Negro en lugar de azul
};

// Agregar más columnas
const headers = ['ACTIVIDAD', 'FECHA', 'HORA', 'UBICACIÓN', 'RESPONSABLE', 'ESTADO', 'NOTAS', 'NUEVA_COLUMNA'];
```

## 🐛 Troubleshooting

### Error: "No se encontró archivo de calendario"

**Solución:**
```bash
# Verificar que los archivos están en public/uploads/
ls -la public/uploads/

# Si no están, copiarlos:
cp /ruta/del/archivo.xlsx public/uploads/
```

### Error: Puerto 3001 ya está en uso

**Solución:**
```bash
# Encuentra qué proceso usa el puerto
lsof -i :3001

# Mata el proceso
kill -9 <PID>

# O usa otro puerto
PORT=3002 npm start
```

### Calendarios no aparecen en la lista

**Solución:**
```bash
# Crear directorio de calendarios
mkdir -p public/calendars
chmod 755 public/calendars

# Reinicia el agente
npm start
```

### CORS errors

**Solución:** Agrega CORS en tu servidor:

```javascript
// En scripts/calendar-agent/index.js
const cors = require('cors');

app.use(cors());
```

## 📚 Recursos Adicionales

- **Documentación completa:** `scripts/calendar-agent/README.md`
- **API Reference:** `scripts/calendar-agent/calendarAPI.js`
- **Procesador de datos:** `scripts/calendar-agent/calendarProcessor.js`

## 🚀 Próximas Mejoras

- [ ] Sincronización con Google Calendar
- [ ] Exportación a PDF
- [ ] Notificaciones por correo
- [ ] Calendario compartido (cloud)
- [ ] Dashboard de analíticos
- [ ] API de integración externa

## 💡 Tips y Mejores Prácticas

1. **Organiza tus calendarios:** Guarda los archivos Excel originales en un directorio separado
2. **Usa nombres descriptivos:** Facilita encontrar los calendarios generados
3. **Revisa antes de descargar:** Verifica que los datos sean correctos
4. **Mantén respaldos:** Haz copia de los archivos importantes
5. **Documenta cambios:** Si modificas el formato, actualiza la documentación

## 📞 Soporte

Si encuentras problemas durante la integración:

1. Revisa los logs de la consola
2. Consulta la sección de Troubleshooting
3. Revisa la documentación en `scripts/calendar-agent/README.md`
4. Abre un issue en el repositorio

---

**Versión:** 1.0.0  
**Última actualización:** 2026-08-30  
**Status:** ✅ Listo para producción
