import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function DashboardCharts({ data }) {
  // Procesar datos para el gráfico de dona (por categoría)
  const categoryCount = data.reduce((acc, curr) => {
    acc[curr.categoria] = (acc[curr.categoria] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(categoryCount).map(key => ({
    name: key,
    value: categoryCount[key]
  }));

  const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'];

  // Procesar actividad reciente
  const recentActivity = [...data]
    .sort((a, b) => new Date(b.ultima_actualizacion) - new Date(a.ultima_actualizacion))
    .slice(0, 5);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('es-ES', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    }).format(date);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Gráfico de Dona */}
      <div className="bg-panel rounded-xl border border-gray-800 p-6 lg:col-span-2 shadow-lg">
        <h3 className="text-lg font-semibold mb-6">Distribución por Categoría</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={110}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#1F2937', color: '#F8FAFC' }}
                itemStyle={{ color: '#F8FAFC' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Actividad Reciente */}
      <div className="bg-panel rounded-xl border border-gray-800 p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-6">Actividad Reciente</h3>
        <div className="space-y-6">
          {recentActivity.map((item, idx) => (
            <div key={idx} className="flex gap-4 relative">
              {/* Timeline line */}
              {idx !== recentActivity.length - 1 && (
                <div className="absolute top-8 left-2.5 bottom-[-24px] w-[1px] bg-gray-800"></div>
              )}
              
              {/* Timeline node */}
              <div className="relative mt-1.5">
                <div className={`w-5 h-5 rounded-full border-4 border-panel ${item.estado === 'Actualizado' ? 'bg-accent-green' : 'bg-accent-blue'} shadow-sm z-10`}></div>
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <p className="text-sm font-medium">{item.proyecto_ciudad}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-400">{formatDate(item.ultima_actualizacion)}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-300">
                    {item.categoria}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
