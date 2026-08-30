import React, { useState, useEffect } from 'react';
import { FileText, Trash2, RefreshCw } from 'lucide-react';
import CalendarAgentPanel from './CalendarAgentPanel';

export default function CalendarPage() {
  const [calendars, setCalendars] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCalendars();
  }, []);

  const loadCalendars = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/calendar/list');
      const data = await response.json();
      setCalendars(data.calendars || []);
    } catch (error) {
      console.error('Error loading calendars:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCalendar = async (fileName) => {
    if (window.confirm(`¿Eliminar ${fileName}.xlsx?`)) {
      try {
        const response = await fetch(`/api/calendar/delete/${fileName}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          loadCalendars();
        }
      } catch (error) {
        console.error('Error deleting calendar:', error);
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📅 Gestor de Calendarios</h1>
          <p className="text-gray-600">Sistema inteligente de automatización de calendarios por equipo y sede</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel del Agente */}
          <div className="lg:col-span-2">
            <CalendarAgentPanel />
          </div>

          {/* Panel de Información */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Características</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="text-blue-500">✓</span>
                  <span>Generación automática de calendarios</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-500">✓</span>
                  <span>Filtrado por Sede y Equipo</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-500">✓</span>
                  <span>Calendarios mes a mes</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-500">✓</span>
                  <span>Descarga directa en Excel</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-500">✓</span>
                  <span>Formato profesional</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200 p-6">
              <h3 className="text-lg font-bold text-green-900 mb-4">🎯 Beneficios</h3>
              <ul className="space-y-2 text-sm text-green-800">
                <li>⚡ Ahorra tiempo en planificación</li>
                <li>📈 Mejor organización</li>
                <li>🔄 Actualización automática</li>
                <li>👥 Acceso centralizado</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tabla de Calendarios Generados */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">📁 Calendarios Generados</h2>
            <button
              onClick={loadCalendars}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              Actualizar
            </button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            {calendars.length === 0 ? (
              <div className="p-12 text-center">
                <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No hay calendarios generados aún</p>
                <p className="text-gray-400 text-sm">Genera el primero usando el panel de arriba</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Creado</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calendars.map((calendar, idx) => (
                      <tr
                        key={idx}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FileText size={20} className="text-blue-500" />
                            <span className="font-medium text-gray-800 truncate">
                              {calendar.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(calendar.created)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={`/calendars/${calendar.file}`}
                              download
                              className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition"
                            >
                              Descargar
                            </a>
                            <button
                              onClick={() => deleteCalendar(calendar.name)}
                              className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition flex items-center gap-1"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
