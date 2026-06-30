import React, { useState, useEffect } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell
} from 'recharts';
import { 
  AlertCircle, CheckCircle2, AlertTriangle, TrendingUp, DollarSign, Users, 
  MapPin, Trophy, Calendar, Database, X, ChevronRight, Brain, Target, Activity, Zap, FileText, ArrowRight
} from 'lucide-react';
import logoCrear from './assets/logo-crear.png';

// --- MOCK DATA ---

const radarData = [
  { subject: 'Ventas', A: 85, fullMark: 100 },
  { subject: 'Cobranza', A: 65, fullMark: 100 },
  { subject: 'Impactos', A: 90, fullMark: 100 },
  { subject: 'Asistencia', A: 75, fullMark: 100 },
  { subject: 'Conversión', A: 80, fullMark: 100 },
  { subject: 'Satisfacción', A: 95, fullMark: 100 },
  { subject: 'Rentabilidad', A: 70, fullMark: 100 },
];

const funnelData = [
  { name: 'Leads', value: 10000, drop: '100%' },
  { name: 'Contactados', value: 7500, drop: '75%' },
  { name: 'Cita', value: 4000, drop: '53%' },
  { name: 'Impacto', value: 2500, drop: '62%' },
  { name: 'Inscrito', value: 1200, drop: '48%' },
  { name: 'Pagó', value: 1050, drop: '87%' },
  { name: 'Entrenó', value: 980, drop: '93%' },
  { name: 'Graduado', value: 900, drop: '91%' },
  { name: 'MJ', value: 450, drop: '50%' },
];

const sedes = [
  { name: 'Lima', status: 'red' },
  { name: 'México CDMX', status: 'green' },
  { name: 'Medellín', status: 'red' },
  { name: 'Quito', status: 'amber' },
  { name: 'Guayaquil', status: 'green' },
  { name: 'Cuenca', status: 'amber' },
];

const topSedes = [
  { rank: 1, name: 'Lima', score: '98 pts' },
  { rank: 2, name: 'México', score: '94 pts' },
  { rank: 3, name: 'Medellín', score: '89 pts' },
  { rank: 4, name: 'Quito', score: '82 pts' },
  { rank: 5, name: 'Guayaquil', score: '78 pts' },
  { rank: 6, name: 'Cuenca', score: '71 pts' },
];

const topPerformers = {
  trainers: ['Carlos S.', 'María P.', 'José L.', 'Ana G.', 'Luis V.'],
  lideres: ['Roberto M.', 'Elena C.', 'Pedro F.', 'Sofía R.', 'Miguel A.'],
  aliados: ['Aliado Alpha', 'Aliado Beta', 'Aliado Gamma', 'Aliado Delta', 'Aliado Epsilon'],
  quantums: ['Quantum 1', 'Quantum 2', 'Quantum 3', 'Quantum 4', 'Quantum 5'],
  vendedores: ['Diana T.', 'Hugo N.', 'Carmen B.', 'Raúl E.', 'Silvia W.']
};

const calendario = [
  { col: 'HOY', tasks: [{ name: 'Impacto CDMX', type: 'impacto' }, { name: 'Reunión Directorio', type: 'reunion' }, { name: 'Cierre Cobranza', type: 'cobranza' }] },
  { col: 'MAÑANA', tasks: [{ name: 'C1 Lima', type: 'c1' }, { name: 'Evento VIP', type: 'evento' }] },
  { col: '7 DÍAS', tasks: [{ name: 'MJ Medellín', type: 'mj' }, { name: 'C2 Quito', type: 'c2' }, { name: 'Revisión Pagos', type: 'pagos' }] },
  { col: '30 DÍAS', tasks: [{ name: 'Lanzamiento Cuenca', type: 'evento' }, { name: 'Auditoría', type: 'reunion' }] },
];

const getTaskColor = (type) => {
  const colors = {
    impacto: 'bg-[#007AFF] text-white',
    reunion: 'bg-[#FFAB00] text-black',
    cobranza: 'bg-[#FF3B30] text-white',
    c1: 'bg-[#00C853] text-white',
    evento: 'bg-[#8B5CF6] text-white',
    mj: 'bg-[#EAB308] text-black',
    c2: 'bg-[#10B981] text-white',
    pagos: 'bg-[#EF4444] text-white',
  };
  return colors[type] || 'bg-slate-700 text-white';
};

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbweuSj-dsQKgKURgx61P4SBU9_CMlmHm6RxlW5Wshse7TArLleik-lrnr7S1fOFes15aw/exec';

// --- MAIN APP COMPONENT ---

export default function MissionControl() {
  const [showDocs, setShowDocs] = useState(false);
  const [docsData, setDocsData] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);

  const openDocs = () => {
    setShowDocs(true);
    if (docsData.length === 0) {
      setLoadingDocs(true);
      fetch(SCRIPT_URL)
        .then(res => res.json())
        .then(data => {
          setDocsData(data);
          setLoadingDocs(false);
        })
        .catch(() => setLoadingDocs(false));
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans selection:bg-[#007AFF] selection:text-white pb-20">
      
      {/* HEADER GLOBAL */}
      <header className="sticky top-0 z-40 bg-[#050505]/90 backdrop-blur-xl border-b border-[#2A2A2A] px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <img src={logoCrear} alt="CREAR" className="h-10 w-auto bg-white p-1 rounded object-contain" />
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-widest text-white uppercase">Centro de Comando Global</h1>
            <p className="text-sm text-gray-400 font-medium">La empresa en una sola pantalla. Actualización en tiempo real.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#121212] border border-[#2A2A2A] px-4 py-2 rounded-full">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C853] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00C853]"></span>
            </span>
            <span className="text-xs font-bold text-[#00C853] tracking-widest">LIVE SYNC</span>
          </div>
          <button 
            onClick={openDocs}
            className="flex items-center gap-2 bg-[#007AFF]/10 hover:bg-[#007AFF]/20 border border-[#007AFF]/50 text-[#007AFF] px-4 py-2 rounded-full text-xs font-bold transition-all"
          >
            <Database size={14} /> CENTRO DOCUMENTAL
          </button>
        </div>
      </header>

      <main className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8">
        
        {/* FILA 1: NÚCLEO FINANCIERO Y OPERATIVO */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-[#121212] border border-[#2A2A2A] rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10"><DollarSign size={100} /></div>
            <h3 className="text-xs font-bold text-gray-500 tracking-widest mb-2 uppercase">Facturación del Mes</h3>
            <div className="text-5xl font-black text-white mb-2">$184.000</div>
            <div className="flex justify-between text-sm font-bold text-gray-400 mb-4">
              <span>Meta: $250.000</span>
              <span className="text-[#00C853]">Proyección: $267.000</span>
            </div>
            <div className="w-full bg-[#2A2A2A] rounded-full h-4 relative overflow-hidden">
              <div className="bg-gradient-to-r from-[#007AFF] to-[#00C853] h-4 rounded-full" style={{ width: '73%' }}></div>
            </div>
            <div className="text-right mt-1 text-xs font-bold text-[#007AFF]">73%</div>
          </div>

          <div className="bg-[#121212] border border-[#2A2A2A] rounded-2xl p-6">
            <h3 className="text-xs font-bold text-gray-500 tracking-widest mb-6 uppercase flex items-center gap-2"><Activity size={14}/> Caja y Flujo</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400">Caja Disponible</p>
                <p className="text-xl font-bold text-white">$142.500</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Cobranza Pendiente</p>
                <p className="text-xl font-bold text-[#FFAB00]">$38.200</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Pagos Pendientes</p>
                <p className="text-xl font-bold text-[#FF3B30]">$15.400</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Flujo de Caja</p>
                <p className="text-xl font-bold text-[#00C853]">Positivo</p>
              </div>
            </div>
          </div>

          <div className="bg-[#121212] border border-[#2A2A2A] rounded-2xl p-6">
            <h3 className="text-xs font-bold text-gray-500 tracking-widest mb-6 uppercase flex items-center gap-2"><Users size={14}/> Operaciones</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400">Participantes Activos</p>
                <p className="text-xl font-bold text-white">4,250</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Inscritos Semana</p>
                <p className="text-xl font-bold text-[#007AFF]">+124</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Desertores</p>
                <p className="text-xl font-bold text-[#FF3B30]">-18</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Reingresos</p>
                <p className="text-xl font-bold text-[#00C853]">+5</p>
              </div>
            </div>
          </div>
        </section>

        {/* FILA 2 & 3 & 4: MAPA, RADAR, ALERTAS */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* MAPA MUNDIAL */}
          <div className="bg-[#121212] border border-[#2A2A2A] rounded-2xl p-6 flex flex-col">
            <h3 className="text-xs font-bold text-gray-500 tracking-widest mb-6 uppercase flex items-center gap-2"><MapPin size={14}/> Mapa Mundial</h3>
            <div className="flex-1 grid grid-cols-2 gap-4 place-content-center">
              {sedes.map(sede => (
                <div key={sede.name} className="flex items-center justify-between p-3 bg-[#1A1A1A] rounded-lg border border-[#2A2A2A] hover:border-gray-500 transition-colors cursor-pointer">
                  <span className="text-sm font-bold text-gray-300">{sede.name}</span>
                  <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_currentColor] ${
                    sede.status === 'green' ? 'bg-[#00C853] text-[#00C853]' : 
                    sede.status === 'amber' ? 'bg-[#FFAB00] text-[#FFAB00]' : 
                    'bg-[#FF3B30] text-[#FF3B30]'
                  }`}></div>
                </div>
              ))}
            </div>
          </div>

          {/* RADAR EJECUTIVO */}
          <div className="bg-[#121212] border border-[#2A2A2A] rounded-2xl p-6 flex flex-col items-center">
            <h3 className="text-xs font-bold text-gray-500 tracking-widest mb-2 uppercase flex items-center gap-2 w-full"><Target size={14}/> Radar Ejecutivo Global</h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#2A2A2A" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 10, fontWeight: 'bold' }} />
                  <Radar name="CREAR" dataKey="A" stroke="#007AFF" fill="#007AFF" fillOpacity={0.3} strokeWidth={2} />
                  <Tooltip contentStyle={{ backgroundColor: '#121212', borderColor: '#2A2A2A', color: '#fff' }} itemStyle={{color: '#007AFF'}}/>
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ALERTAS CRÍTICAS */}
          <div className="bg-[#121212] border border-[#2A2A2A] rounded-2xl p-6 flex flex-col">
            <h3 className="text-xs font-bold text-gray-500 tracking-widest mb-6 uppercase flex items-center gap-2"><AlertTriangle size={14}/> Alertas Críticas</h3>
            <div className="space-y-3 flex-1 overflow-y-auto">
              <div className="flex items-start gap-3 bg-[#FF3B30]/10 border border-[#FF3B30]/30 p-3 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-[#FF3B30] mt-1.5 shadow-[0_0_8px_#FF3B30]"></div>
                <p className="text-sm font-medium text-white">Lima perdió 14 inscritos.</p>
              </div>
              <div className="flex items-start gap-3 bg-[#FFAB00]/10 border border-[#FFAB00]/30 p-3 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-[#FFAB00] mt-1.5 shadow-[0_0_8px_#FFAB00]"></div>
                <p className="text-sm font-medium text-white">Quito tiene 22 pagos vencidos.</p>
              </div>
              <div className="flex items-start gap-3 bg-[#FF3B30]/10 border border-[#FF3B30]/30 p-3 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-[#FF3B30] mt-1.5 shadow-[0_0_8px_#FF3B30]"></div>
                <p className="text-sm font-medium text-white">Medellín sin actualizar indicadores.</p>
              </div>
              <div className="flex items-start gap-3 bg-[#00C853]/10 border border-[#00C853]/30 p-3 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-[#00C853] mt-1.5 shadow-[0_0_8px_#00C853]"></div>
                <p className="text-sm font-medium text-white">México superó meta trimestral.</p>
              </div>
              <div className="flex items-start gap-3 bg-[#FF3B30]/10 border border-[#FF3B30]/30 p-3 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-[#FF3B30] mt-1.5 shadow-[0_0_8px_#FF3B30]"></div>
                <p className="text-sm font-medium text-white">Ecuador tiene 3 entrenamientos en riesgo.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FILA 9: IA EJECUTIVA (Adelantada por prioridad) */}
        <section>
          <div className="bg-gradient-to-r from-[#1A1A1A] via-[#121212] to-[#050505] border border-[#2A2A2A] rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#007AFF] opacity-5 blur-[100px] rounded-full"></div>
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="bg-[#007AFF]/20 p-3 rounded-xl border border-[#007AFF]/30 text-[#007AFF]">
                <Brain size={32} />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-wide text-white">IA CEO</h2>
                <p className="text-gray-400">Motor de Inteligencia Estratégica</p>
              </div>
            </div>
            <div className="relative z-10 space-y-2">
              <p className="text-lg font-medium text-white mb-4">Buenos días Fernando. Hoy debes enfocarte en:</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-300"><ChevronRight size={16} className="text-[#007AFF]"/> <strong>Lima</strong> está 18% debajo de la meta. Requiere intervención inmediata.</li>
                <li className="flex items-center gap-3 text-gray-300"><ChevronRight size={16} className="text-[#00C853]"/> <strong>México</strong> superará presupuesto proyectado.</li>
                <li className="flex items-center gap-3 text-gray-300"><ChevronRight size={16} className="text-[#FFAB00]"/> Hay <strong>14 personas</strong> que podrían desertar esta semana (Riesgo Alto).</li>
                <li className="flex items-center gap-3 text-gray-300"><ChevronRight size={16} className="text-[#FF3B30]"/> Existen <strong>22 pagos</strong> sin seguimiento en la sede Quito.</li>
                <li className="flex items-center gap-3 text-gray-300"><ChevronRight size={16} className="text-[#007AFF]"/> <em>Recomendación:</em> Reforzar el Impacto programado para este sábado.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FILA 8: EMBUDO DE CONVERSIÓN */}
        <section>
          <div className="bg-[#121212] border border-[#2A2A2A] rounded-2xl p-6 overflow-x-auto">
            <h3 className="text-xs font-bold text-gray-500 tracking-widest mb-6 uppercase flex items-center gap-2"><Filter size={14}/> Embudo de Conversión (Funnel Global)</h3>
            <div className="flex justify-between items-center min-w-[1000px] gap-2">
              {funnelData.map((step, idx) => (
                <React.Fragment key={step.name}>
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4 text-center hover:bg-[#2A2A2A] transition-colors">
                      <p className="text-xs text-gray-500 font-bold uppercase mb-1">{step.name}</p>
                      <p className="text-xl font-black text-white">{step.value.toLocaleString()}</p>
                    </div>
                  </div>
                  {idx < funnelData.length - 1 && (
                    <div className="flex flex-col items-center px-2">
                      <ArrowRight size={16} className="text-gray-600 mb-1" />
                      <span className="text-[10px] font-bold text-[#007AFF]">{funnelData[idx+1].drop}</span>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* FILA 5 & 6: RANKINGS */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="bg-[#121212] border border-[#2A2A2A] rounded-2xl p-6 xl:col-span-1">
            <h3 className="text-xs font-bold text-gray-500 tracking-widest mb-6 uppercase flex items-center gap-2"><Trophy size={14}/> Top Sedes</h3>
            <div className="space-y-4">
              {topSedes.map((sede) => (
                <div key={sede.rank} className="flex items-center justify-between border-b border-[#2A2A2A] pb-2 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className={`font-black text-lg ${sede.rank <= 3 ? 'text-[#FFAB00]' : 'text-gray-600'}`}>{sede.rank}</span>
                    <span className="font-bold text-gray-300">{sede.name}</span>
                  </div>
                  <span className="text-xs font-bold text-[#00C853]">{sede.score}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-[#121212] border border-[#2A2A2A] rounded-2xl p-6 xl:col-span-2">
            <h3 className="text-xs font-bold text-gray-500 tracking-widest mb-6 uppercase flex items-center gap-2"><Zap size={14}/> Top Performers</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(topPerformers).map(([category, names]) => (
                <div key={category}>
                  <h4 className="text-[10px] text-gray-500 font-bold uppercase mb-3 border-b border-[#2A2A2A] pb-1">Top {category}</h4>
                  <ul className="space-y-2">
                    {names.map((n, i) => (
                      <li key={i} className="text-xs text-gray-300 flex items-center gap-2">
                        <span className="text-gray-600 font-mono">{i+1}.</span> {n}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FILA 7: CALENDARIO ESTRATÉGICO */}
        <section>
          <div className="bg-[#121212] border border-[#2A2A2A] rounded-2xl p-6 overflow-x-auto">
            <h3 className="text-xs font-bold text-gray-500 tracking-widest mb-6 uppercase flex items-center gap-2"><Calendar size={14}/> Calendario Estratégico</h3>
            <div className="grid grid-cols-4 gap-4 min-w-[800px]">
              {calendario.map((col) => (
                <div key={col.col} className="bg-[#050505] rounded-xl border border-[#2A2A2A] p-4">
                  <h4 className="text-xs font-bold text-gray-500 mb-4">{col.col}</h4>
                  <div className="space-y-3">
                    {col.tasks.map((t, i) => (
                      <div key={i} className={`px-3 py-2 rounded-lg text-xs font-bold ${getTaskColor(t.type)}`}>
                        {t.name}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FILA 10 & 11: FINANCIERO Y CULTURA */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#121212] border border-[#2A2A2A] rounded-2xl p-6">
            <h3 className="text-xs font-bold text-gray-500 tracking-widest mb-6 uppercase">Centro Financiero Detallado</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 bg-[#1A1A1A] rounded text-center border border-[#2A2A2A]"><p className="text-[10px] text-gray-500 uppercase">Ingresos</p><p className="font-bold">$184k</p></div>
              <div className="p-3 bg-[#1A1A1A] rounded text-center border border-[#2A2A2A]"><p className="text-[10px] text-gray-500 uppercase">Egresos</p><p className="font-bold text-[#FF3B30]">$82k</p></div>
              <div className="p-3 bg-[#1A1A1A] rounded text-center border border-[#2A2A2A]"><p className="text-[10px] text-gray-500 uppercase">Margen</p><p className="font-bold text-[#00C853]">55%</p></div>
              <div className="p-3 bg-[#1A1A1A] rounded text-center border border-[#2A2A2A]"><p className="text-[10px] text-gray-500 uppercase">ROI</p><p className="font-bold text-[#007AFF]">120%</p></div>
              <div className="p-3 bg-[#1A1A1A] rounded text-center border border-[#2A2A2A]"><p className="text-[10px] text-gray-500 uppercase">Caja</p><p className="font-bold">$142k</p></div>
              <div className="p-3 bg-[#1A1A1A] rounded text-center border border-[#2A2A2A]"><p className="text-[10px] text-gray-500 uppercase">Utilidad</p><p className="font-bold text-[#00C853]">$102k</p></div>
              <div className="p-3 bg-[#1A1A1A] rounded text-center border border-[#2A2A2A] col-span-2"><p className="text-[10px] text-gray-500 uppercase">Rentabilidad Top</p><p className="font-bold text-[#FFAB00]">Lima (62%)</p></div>
            </div>
          </div>
          <div className="bg-[#121212] border border-[#2A2A2A] rounded-2xl p-6">
            <h3 className="text-xs font-bold text-gray-500 tracking-widest mb-6 uppercase">Indicadores de Cultura</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 bg-[#1A1A1A] rounded text-center border border-[#2A2A2A]"><p className="text-[10px] text-gray-500 uppercase">NPS</p><p className="font-bold text-[#007AFF]">92</p></div>
              <div className="p-3 bg-[#1A1A1A] rounded text-center border border-[#2A2A2A]"><p className="text-[10px] text-gray-500 uppercase">Compromiso</p><p className="font-bold text-[#00C853]">88%</p></div>
              <div className="p-3 bg-[#1A1A1A] rounded text-center border border-[#2A2A2A]"><p className="text-[10px] text-gray-500 uppercase">Asistencia</p><p className="font-bold">95%</p></div>
              <div className="p-3 bg-[#1A1A1A] rounded text-center border border-[#2A2A2A]"><p className="text-[10px] text-gray-500 uppercase">Deserción</p><p className="font-bold text-[#FF3B30]">4.2%</p></div>
              <div className="p-3 bg-[#1A1A1A] rounded text-center border border-[#2A2A2A]"><p className="text-[10px] text-gray-500 uppercase">Cumplimiento</p><p className="font-bold">98%</p></div>
              <div className="p-3 bg-[#1A1A1A] rounded text-center border border-[#2A2A2A]"><p className="text-[10px] text-gray-500 uppercase">Transformación</p><p className="font-bold text-[#FFAB00]">Alta</p></div>
              <div className="p-3 bg-[#1A1A1A] rounded text-center border border-[#2A2A2A] col-span-2"><p className="text-[10px] text-gray-500 uppercase">Referidos</p><p className="font-bold text-[#007AFF]">320 Mes</p></div>
            </div>
          </div>
        </section>

      </main>

      {/* MODAL CENTRO DOCUMENTAL */}
      {showDocs && (
        <div className="fixed inset-0 bg-[#000000]/80 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-4xl bg-[#121212] border-l border-[#2A2A2A] h-full flex flex-col shadow-2xl">
            <div className="p-6 border-b border-[#2A2A2A] flex justify-between items-center bg-[#050505]">
              <h2 className="text-xl font-bold flex items-center gap-3 text-white"><Database className="text-[#007AFF]" /> Centro Documental</h2>
              <button onClick={() => setShowDocs(false)} className="p-2 hover:bg-[#2A2A2A] rounded-full transition-colors text-gray-400 hover:text-white"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {loadingDocs ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                  <div className="w-8 h-8 border-4 border-[#007AFF] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-gray-400">Accediendo a la base de datos segura...</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#1A1A1A]">
                      <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Archivo</th>
                      <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Categoría</th>
                      <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Estado</th>
                      <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A2A2A]">
                    {docsData.map((doc, idx) => (
                      <tr key={idx} className="hover:bg-[#1A1A1A]/50 transition-colors">
                        <td className="px-4 py-4 text-sm font-medium text-gray-200">{doc["PROYECTO / CIUDAD"]}</td>
                        <td className="px-4 py-4 text-sm text-gray-400">{doc["CATEGORÍA"]}</td>
                        <td className="px-4 py-4">
                          <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${doc["ESTADO"] === 'Actualizado' ? 'bg-[#00C853]/20 text-[#00C853]' : 'bg-[#FFAB00]/20 text-[#FFAB00]'}`}>
                            {doc["ESTADO"]}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <a href={doc["ENLACE EJECUTIVO"]} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#007AFF] hover:underline">Abrir</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
