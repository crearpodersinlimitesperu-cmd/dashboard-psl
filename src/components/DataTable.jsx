import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function DataTable({ data }) {
  
  const getCategoryBadge = (category) => {
    switch(category) {
      case 'Maestría Estratégica':
        return 'bg-accent-blue/10 text-accent-blue border-accent-blue/20';
      case 'Archivo Regional':
        return 'bg-accent-purple/10 text-accent-purple border-accent-purple/20';
      case 'Control Operativo':
        return 'bg-accent-green/10 text-accent-green border-accent-green/20';
      default:
        return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  const getStatusBadge = (status) => {
    return status === 'Actualizado' 
      ? 'bg-accent-green/10 text-accent-green' 
      : 'bg-yellow-500/10 text-yellow-500';
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('es-ES', { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="bg-panel rounded-xl border border-gray-800 shadow-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-800 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Archivos de Gestión</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-900/50">
              <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Proyecto / Ciudad</th>
              <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Categoría</th>
              <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Última Actualización</th>
              <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-gray-800/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-medium text-sm">{row.proyecto_ciudad}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 text-xs rounded-full border ${getCategoryBadge(row.categoria)}`}>
                    {row.categoria}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${row.estado === 'Actualizado' ? 'bg-accent-green' : 'bg-yellow-500'}`}></div>
                    <span className={`text-xs font-medium ${getStatusBadge(row.estado).split(' ')[1]}`}>
                      {row.estado}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {formatDate(row.ultima_actualizacion)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <a 
                    href={row.enlace_ejecutivo}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center p-2 rounded-lg bg-accent-blue/10 text-accent-blue hover:bg-accent-blue hover:text-white transition-colors duration-200"
                    title="Abrir Documento"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
