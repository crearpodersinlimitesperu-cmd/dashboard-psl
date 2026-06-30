# Command Center PSL - Transformación Global

Dashboard Ejecutivo para el CEO de la empresa "Transformación Global". 
Visualiza métricas, estados y enlaces de documentos extraídos desde Google Drive/Sheets en una interfaz premium (Dark Mode).

## Tecnologías Utilizadas
- **React + Vite**: Para un desarrollo y construcción rápidos.
- **TailwindCSS (v3)**: Estilización moderna y flexible.
- **Recharts**: Para visualización de datos (Gráfico de Dona).
- **Lucide React**: Iconografía profesional.

## Requisitos Previos
- Node.js (v18+)
- npm o yarn

## Instrucciones para correr localmente

1. Clonar el repositorio (si aplica):
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd dashboard-psl
   ```

2. Instalar las dependencias:
   ```bash
   npm install
   ```

3. Levantar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abrir en el navegador:
   El servidor normalmente correrá en `http://localhost:5173`.

## Estructura del Proyecto
- `src/components/`: Componentes modulares de UI (`Layout`, `KPICards`, `DashboardCharts`, `DataTable`).
- `src/data/`: Datos simulados (Mock Data).
- `src/index.css`: Configuración principal de Tailwind y tipografías.

## Despliegue en Vercel
Para publicar este proyecto de forma gratuita y rápida en Vercel:
1. Sube este código a tu cuenta de GitHub.
2. Inicia sesión en [Vercel](https://vercel.com) con GitHub.
3. Haz clic en **Add New...** -> **Project**.
4. Selecciona tu repositorio recién creado.
5. Vercel detectará automáticamente que es un proyecto de Vite.
6. Haz clic en **Deploy**. ¡Listo!
