import React, { useState, useEffect } from 'react';
import { Download, Loader, AlertCircle, FileText, Sheet } from 'lucide-react';

export default function CalendarAgentPanel() {
  const [sedes, setSedes] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [selectedSede, setSelectedSede] = useState('');
  const [selectedEquipo, setSelectedEquipo] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [generatedFile, setGeneratedFile] = useState(null);
  const [fileFormat, setFileFormat] = useState('excel');

  useEffect(() => {
    loadCalendarMetadata();
  }, []);

  const loadCalendarMetadata = async () => {
    try {
      const response = await fetch('/api/calendar/metadata');
      const data = await response.json();
      setSedes(data.sedes || ['LIMA']);
      setEquipos(data.equipos || []);
      if (data.sedes && data.sedes.length > 0) {
        setSelectedSede(data.sedes[0]);
      }
      if (data.equipos && data.equipos.length > 0) {
        setSelectedEquipo(data.equipos[0]);
      }
    } catch (error) {
      setMessage('Error al cargar metadata: ' + error.message);
    }
  };

  const generateCalendar = async () => {
    if (!selectedSede || !selectedEquipo) {
      setMessage('Por favor selecciona Sede y Equipo');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const endpoint = fileFormat === 'pdf' ? '/api/calendar/generate-pdf' : '/api/calendar/generate';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sede: selectedSede,
          equipo: selectedEquipo,
          month: selectedMonth,
          year: selectedYear
        })
      });

      const data = await response.json();

      if (response.ok) {
        setGeneratedFile(data.fileName);
        const formatText = fileFormat === 'pdf' ? 'PDF' : 'Excel';
        setMessage(`✓ Calendario ${formatText} generado: ${data.fileName}`);
      } else {
        setMessage('Error: ' + (data.error || 'No se pudo generar el calendario'));
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadCalendar = () => {
    if (generatedFile) {
      const extension = fileFormat === 'pdf' ? '.pdf' : '.xlsx';
      window.open(`/calendars/${generatedFile}${extension}`, '_blank');
    }
  };

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const anos = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg shadow-xl p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">📅 Agente de Calendarios</h2>
        <p className="text-gray-600">Genera calendarios mensuales por sede y equipo</p>
      </div>

      <div className="space-y-6">
        {/* Selector de Sede */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🏢 Selecciona Sede
          </label>
          <select
            value={selectedSede}
            onChange={(e) => setSelectedSede(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
          >
            <option value="">-- Seleccionar Sede --</option>
            {sedes.map((sede) => (
              <option key={sede} value={sede}>
                {sede}
              </option>
            ))}
          </select>
        </div>

        {/* Selector de Equipo */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            ⚽ Selecciona Equipo
          </label>
          <select
            value={selectedEquipo}
            onChange={(e) => setSelectedEquipo(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
          >
            <option value="">-- Seleccionar Equipo --</option>
            {equipos.map((equipo) => (
              <option key={equipo} value={equipo}>
                {equipo}
              </option>
            ))}
          </select>
        </div>

        {/* Selectores de Mes y Año */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📆 Mes
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
            >
              {meses.map((mes, i) => (
                <option key={i} value={i + 1}>
                  {mes}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📅 Año
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
            >
              {anos.map((ano) => (
                <option key={ano} value={ano}>
                  {ano}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selector de Formato */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            📄 Formato de Exportación
          </label>
          <div className="flex gap-4">
            <button
              onClick={() => setFileFormat('excel')}
              className={`flex-1 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                fileFormat === 'excel'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Sheet size={18} />
              Excel
            </button>
            <button
              onClick={() => setFileFormat('pdf')}
              className={`flex-1 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                fileFormat === 'pdf'
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FileText size={18} />
              PDF
            </button>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={generateCalendar}
            disabled={loading || !selectedSede || !selectedEquipo}
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="animate-spin" size={20} />
                Generando...
              </>
            ) : (
              <>
                ✨ Generar Calendario
              </>
            )}
          </button>

          {generatedFile && (
            <button
              onClick={downloadCalendar}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2"
            >
              <Download size={20} />
              Descargar
            </button>
          )}
        </div>

        {/* Mensaje de Estado */}
        {message && (
          <div className={`p-4 rounded-lg flex gap-3 ${
            message.startsWith('✓')
              ? 'bg-green-50 border border-green-200'
              : message.startsWith('Error')
              ? 'bg-red-50 border border-red-200'
              : 'bg-blue-50 border border-blue-200'
          }`}>
            {message.startsWith('Error') && (
              <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            )}
            <p className={message.startsWith('Error') ? 'text-red-700' : message.startsWith('✓') ? 'text-green-700' : 'text-blue-700'}>
              {message}
            </p>
          </div>
        )}

        {/* Información */}
        <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
          <h3 className="font-semibold text-gray-700 mb-2">💡 Cómo usar:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>1. Selecciona la Sede (LIMA)</li>
            <li>2. Elige el Equipo de la lista</li>
            <li>3. Escoge el Mes y Año deseado</li>
            <li>4. Elige el formato (Excel o PDF con logo CREAR)</li>
            <li>5. Haz clic en "Generar Calendario"</li>
            <li>6. Descarga el archivo generado</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
