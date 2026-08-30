#!/bin/bash

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     🎯 Agente de Automatización de Calendarios - Setup       ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Crear directorios necesarios
echo -e "${BLUE}[1/5]${NC} Creando directorios necesarios..."
mkdir -p ../../public/uploads
mkdir -p ../../public/calendars
mkdir -p ../../public/downloads
echo -e "${GREEN}✓ Directorios creados${NC}"
echo ""

# 2. Instalar dependencias
echo -e "${BLUE}[2/5]${NC} Instalando dependencias npm..."
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependencias instaladas${NC}"
else
    echo -e "${YELLOW}⚠ Error al instalar dependencias${NC}"
    exit 1
fi
echo ""

# 3. Copiar archivos de calendario si existen en la carpeta de descargas
echo -e "${BLUE}[3/5]${NC} Buscando archivos de calendario..."
if [ -f "Calendario_Maestr_a_Del_Juego_LIMA.xlsx" ]; then
    cp Calendario_Maestr_a_Del_Juego_LIMA.xlsx ../../public/uploads/
    echo -e "${GREEN}✓ Archivo Calendario_Maestr_a_Del_Juego_LIMA.xlsx copiado${NC}"
fi

if [ -f "PROGRAMACION_2026_CREAR_LIMA.xlsx" ]; then
    cp PROGRAMACION_2026_CREAR_LIMA.xlsx ../../public/uploads/
    echo -e "${GREEN}✓ Archivo PROGRAMACION_2026_CREAR_LIMA.xlsx copiado${NC}"
fi
echo ""

# 4. Crear archivo de configuración
echo -e "${BLUE}[4/5]${NC} Creando archivo de configuración..."
cat > .env << EOF
# Configuración del Agente de Calendario
PORT=3001
NODE_ENV=development
DEBUG=false

# Rutas de archivos
UPLOADS_DIR=../../public/uploads
CALENDARS_DIR=../../public/calendars
DOWNLOADS_DIR=../../public/downloads

# Base de datos (opcional para futuros desarrollos)
DB_HOST=localhost
DB_USER=admin
DB_PASS=
DB_NAME=calendar_db
EOF
echo -e "${GREEN}✓ Archivo .env creado${NC}"
echo ""

# 5. Mensaje de finalización
echo -e "${BLUE}[5/5]${NC} Configuración completada"
echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                   ✓ Setup Completado                         ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}Para iniciar el agente, ejecuta:${NC}"
echo "  npm start"
echo ""
echo -e "${GREEN}Para desarrollo (con auto-reload):${NC}"
echo "  npm run dev"
echo ""
echo "El agente estará disponible en: http://localhost:3001"
echo ""
echo -e "${YELLOW}Próximos pasos:${NC}"
echo "  1. Copiar archivos Excel a public/uploads/"
echo "  2. Integrar el componente en el dashboard"
echo "  3. Configurar rutas en App.jsx"
echo ""
