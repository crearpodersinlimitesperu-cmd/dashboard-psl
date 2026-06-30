import React from 'react';
import { Files, Activity, MapPin, Clock } from 'lucide-react';

export default function KPICards({ data }) {
  // Cálculos básicos
  const totalFiles = data.length;
  const updatedFiles = data.filter(item => item.estado === 'Actualizado').length;
  const healthPercentage = totalFiles > 0 ? Math.round((updatedFiles / totalFiles) * 100) : 0;
  
  // Regiones únicas
  const regions = new Set(data.map(item => {
    const parts = item.proyecto_ciudad.replace('.xlsx', '').split(' ');
    return parts.length > 1 ? parts[1] : parts[0];
  })).size;

  // Última actualización global
  const sortedDates = [...data].sort((a, b) => new Date(b.ultima_actualizacion) - new Date(a.ultima_actualizacion));
  const lastUpdate = sortedDates.length > 0 ? new Date(sortedDates[0].ultima_actualizacion) : null;
  const formattedLastUpdate = lastUpdate 
    ? lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'N/A';

  const kpis = [
    {
      title: "Archivos Procesados",
      value: totalFiles,
      icon: <Files className="w-6 h-6 text-accent-blue" />,
      trend: "+2 esta semana",
      trendUp: true
    },
    {
      title: "Estado de Salud",
      value: `${healthPercentage}%`,
      icon: <Activity className="w-6 h-6 text-accent-green" />,
      trend: healthPercentage === 100 ? "Óptimo" : "Requiere atención",
      trendUp: healthPercentage >= 80
    },
    {
      title: "Regiones Activas",
      value: regions,
      icon: <MapPin className="w-6 h-6 text-accent-purple" />,
      trend: "Estable",
      trendUp: true
    },
    {
      title: "Última Actividad",
      value: formattedLastUpdate,
      icon: <Clock className="w-6 h-6 text-gray-400" />,
      trend: "Datos sincronizados",
      trendUp: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, idx) => (
        <div 
          key={idx} 
          className="bg-panel rounded-xl p-6 border border-gray-800 shadow-lg hover:border-gray-700 transition-colors duration-300 relative overflow-hidden group"
        >
          {/* Subtle gradient hover effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-sm font-medium text-gray-400 mb-1">{kpi.title}</p>
              <h3 className="text-3xl font-bold tracking-tight">{kpi.value}</h3>
            </div>
            <div className="p-3 bg-base/50 rounded-lg backdrop-blur-sm border border-gray-800">
              {kpi.icon}
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm relative z-10">
            <span className={kpi.trendUp ? "text-accent-green" : "text-red-400"}>
              {kpi.trend}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
