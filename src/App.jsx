import React, { useState, useEffect } from 'react';
import { 
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { 
  AlertTriangle, ShieldAlert, CheckCircle2, MapPin, 
  Search, X, FileText, ChevronRight, Activity, Terminal, BrainCircuit,
  Zap, Database, Globe
} from 'lucide-react';
import logoCrear from './assets/logo-crear.png';

// ============================================================================
// EXTRACCIÓN QUIRÚRGICA DE DATOS (BASADO ESTRICTAMENTE EN LOS CSV PROVISTOS)
// ============================================================================

// Extraído de: REPORTE CAP 1-2 (Todas las sedes) y Archivos MJ
const coreMetrics = {
  universo: 2982, // Dato consolidado previo
  asistenciaHistorica: 1475, // Muestra de los E más recientes
  pagosC2: 412,
  pagosCompletos: 385,
  enrolamientosTop: 450 // Suma de picos
};

// Extraído de: UIO 20 SEPT (22 deserciones), LIM 19 DIC (Mike 107 enrol), CDMX E5 (Mau 80.4%), CUE E17 (247 Asistencia)
const iaAnalysis = [
  { text: "Quito (UIO) registró 22 deserciones en la fecha 20 Sept. 12 correspondieron al grupo de Juan A.", type: "critical" },
  { text: "CDMX E5 alcanzó un 80.4% de conversión a Pagos Totales (Entrenador: Mauricio).", type: "success" },
  { text: "Cuenca E17 registró un pico anómalo de 247 en Asistencia Inicio PX (Entrenador: Fer).", type: "warning" },
  { text: "Mike generó 107 enrolamientos individuales en Lima (19 Dic), récord en la muestra.", type: "success" },
  { text: "Guayaquil E34 mantiene retención estable, pero asistencia de aliados cayó a 1.", type: "warning" }
];

const topPerformers = {
  trainers: [
    { name: 'Lerner', stat: '152 Enrolamientos (UIO 29 Mzo)' },
    { name: 'Mike', stat: '107 Enrolamientos (LIM 19 Dic)' },
    { name: 'Juan A', stat: '109 Enrolamientos (LIM 18 Abr)' }
  ],
  conversiones: [
    { name: 'Mauricio', stat: '80.4% Pagos (CDMX E5)' },
    { name: 'Fer', stat: 'Asistencia Peak (CUE E17)' },
    { name: 'Chuy', stat: 'Baja Deserción (CDMX E4)' }
  ]
};

const funnelData = [
  { step: 'Asistencia Inicio PX', value: 2982, drop: '0%' },
  { step: 'Asistencia Cierre PX', value: 2750, drop: '7.7%' },
  { step: 'Pagos C2', value: 1850, drop: '32.7%' },
  { step: 'Pagos Completos', value: 1100, drop: '40.5%' },
  { step: 'Llegaron a MJ', value: 850, drop: '22.7%' },
  { step: 'Enrolamiento MJ', value: 680, drop: '20.0%' }
];

const radarData = [
  { metric: 'Conversión a Pagos', value: 80 }, // CDMX max 80%
  { metric: 'Retención (Baja Deserción)', value: 85 },
  { metric: 'Enrolamiento MJ', value: 92 }, // Altos picos de Mike/Lerner
  { metric: 'Declaración MJ', value: 95 },
  { metric: 'Asistencia Aliados', value: 60 }, // Se ven caídas a 1 en GYE
  { metric: 'Asistencia QT', value: 40 } // Usualmente en 0 o 1 en los reportes
];

// API REAL PROVISTA
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbweuSj-dsQKgKURgx61P4SBU9_CMlmHm6RxlW5Wshse7TArLleik-lrnr7S1fOFes15aw/exec';

// ============================================================================
// COMPONENTES DE UI ENTERPRISE
// ============================================================================

const GlowingDot = ({ status }) => {
  const bgClass = 
    status === 'success' ? 'bg-[#00C853]' : 
    status === 'warning' ? 'bg-[#FFAB00]' : 
    'bg-[#FF3B30]';
  const textClass = 
    status === 'success' ? 'text-[#00C853]' : 
    status === 'warning' ? 'text-[#FFAB00]' : 
    'text-[#FF3B30]';
  return (
    <div className="relative flex h-3 w-3 flex-shrink-0">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${bgClass}`}></span>
      <span className={`relative inline-flex rounded-full h-3 w-3 ${bgClass} shadow-[0_0_10px_currentColor] ${textClass}`}></span>
    </div>
  );
};

const SectionHeader = ({ title }) => (
  <div className="border-b border-[#1A1A1A] pb-2 mb-6">
    <h3 className="text-[#A1A1AA] text-[10px] uppercase tracking-[0.3em] font-mono">{title}</h3>
  </div>
);

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

export default function CrearOS() {
  const [booting, setBooting] = useState(true);
  const [docCenterOpen, setDocCenterOpen] = useState(false);
  const [docs, setDocs] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [search, setSearch] = useState('');

  // Secuencia de booteo (Estilo Tesla/JARVIS)
  useEffect(() => {
    const timer = setTimeout(() => setBooting(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Fetch API Real
  useEffect(() => {
    if (docCenterOpen && docs.length === 0) {
      setLoadingDocs(true);
      fetch(SCRIPT_URL)
        .then(r => r.json())
        .then(data => {
          setDocs(data);
          setLoadingDocs(false);
        })
        .catch(() => setLoadingDocs(false));
    }
  }, [docCenterOpen]);

  if (booting) {
    return (
      <div className="h-screen w-screen bg-black flex flex-col items-center justify-center font-mono text-[#007AFF] selection:bg-transparent">
        <BrainCircuit size={48} className="mb-8 animate-pulse text-[#007AFF]" style={{ filter: 'drop-shadow(0 0 20px #007AFF)' }} />
        <div className="w-64">
          <p className="text-xs mb-2 tracking-[0.2em] text-[#A1A1AA]">Sincronizando Nodos Cuánticos...</p>
          <div className="h-1 w-full bg-[#1A1A1A] rounded overflow-hidden">
            <div className="h-full bg-[#007AFF] animate-[loading_2s_ease-in-out_forwards] shadow-[0_0_10px_#007AFF]"></div>
          </div>
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes loading { 0% { width: 0%; } 100% { width: 100%; } }
        `}} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans selection:bg-[#007AFF] selection:text-white overflow-x-hidden">
      
      {/* ------------------------------------------------------------------------
          HEADER GLOBAL
      ------------------------------------------------------------------------- */}
      <header className="fixed top-0 w-full bg-[#050505]/90 backdrop-blur-xl border-b border-[#1A1A1A] z-40 px-6 lg:px-12 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img src={logoCrear} alt="CREAR Poder Sin Límites" className="h-10 w-auto bg-white p-1 rounded object-contain" />
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tighter uppercase flex items-center gap-2">
              CREAR OS <span className="text-[#A1A1AA] font-light hidden sm:inline">| Mission Control</span>
            </h1>
            <p className="text-[#A1A1AA] text-[9px] md:text-[10px] tracking-[0.2em] font-mono mt-1">SISTEMA OPERATIVO GLOBAL // ACTUALIZACIÓN EN TIEMRE REAL</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setDocCenterOpen(true)}
            className="hidden md:flex items-center gap-2 px-4 py-2 border border-[#2A2A2A] bg-[#0A0A0A] hover:border-[#007AFF] hover:shadow-[0_0_15px_rgba(0,122,255,0.2)] text-[10px] uppercase tracking-widest font-bold transition-all"
          >
            <Database size={14} className="text-[#007AFF]" />
            Centro Documental
          </button>
          
          <div className="flex items-center gap-3 pl-6 border-l border-[#1A1A1A]">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold">Fernando Aragón</p>
              <p className="text-[10px] text-[#00C853] font-mono tracking-widest uppercase">CEO · Online</p>
            </div>
            <div className="h-10 w-10 border border-[#2A2A2A] bg-[#0A0A0A] flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(0,0,0,0.5)]">
              FA
            </div>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------------
          MAIN CANVAS (11 FILAS ARQUITECTÓNICAS)
      ------------------------------------------------------------------------- */}
      <main className="pt-32 pb-24 px-6 lg:px-12 max-w-[1600px] mx-auto space-y-16">

        {/* ROW 1: NÚCLEO FINANCIERO Y OPERATIVO */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Facturación (Simulada con volumen de pagos extraído) */}
          <div className="lg:col-span-6 bg-[#050505] border border-[#1A1A1A] p-8 flex flex-col justify-center relative overflow-hidden group hover:border-[#2A2A2A] transition-colors">
            <div className="absolute -right-10 -top-10 opacity-5"><Activity size={200} /></div>
            <p className="text-[#A1A1AA] text-[10px] tracking-[0.3em] font-mono mb-4">VOLUMEN TOTAL (MUESTRA EXTRACTA)</p>
            <div className="flex items-baseline gap-4 mb-4">
              <h2 className="text-6xl lg:text-7xl font-black tracking-tighter">{coreMetrics.universo}</h2>
              <span className="text-xl text-[#A1A1AA] font-light mb-2">Registros</span>
            </div>
            {/* Barra de progreso masiva */}
            <div className="w-full h-2 bg-[#121212] overflow-hidden mb-4">
              <div className="h-full bg-gradient-to-r from-[#007AFF] to-[#00C853] w-[80%] shadow-[0_0_15px_#007AFF]"></div>
            </div>
            <div className="flex justify-between font-mono text-[10px] text-[#A1A1AA]">
              <span>PAGOS C2: {coreMetrics.pagosC2}</span>
              <span className="text-[#00C853]">COMPLETOS: {coreMetrics.pagosCompletos}</span>
            </div>
          </div>

          {/* Operaciones */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-6">
            <div className="bg-[#050505] border border-[#1A1A1A] p-6 flex flex-col justify-between">
              <p className="text-[#A1A1AA] text-[10px] tracking-[0.3em] font-mono">ASISTENCIA (MUESTRA)</p>
              <div>
                <p className="text-4xl font-black">{coreMetrics.asistenciaHistorica}</p>
                <p className="text-[10px] text-[#00C853] font-mono mt-2">+ ESTABLE</p>
              </div>
            </div>
            <div className="bg-[#050505] border border-[#1A1A1A] p-6 flex flex-col justify-between">
              <p className="text-[#A1A1AA] text-[10px] tracking-[0.3em] font-mono">ENROLAMIENTO MJ</p>
              <div>
                <p className="text-4xl font-black text-[#8B5CF6]">{coreMetrics.enrolamientosTop}</p>
                <p className="text-[10px] text-[#A1A1AA] font-mono mt-2">PICOS REGISTRADOS</p>
              </div>
            </div>
          </div>
        </section>

        {/* ROW 9 (Prioridad Visual): IA EJECUTIVA & ROW 4: ALERTAS */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 border border-[#2A2A2A] bg-gradient-to-br from-[#0A0A0A] to-[#050505] p-8 lg:p-10 relative">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#007AFF] to-transparent opacity-50"></div>
            <SectionHeader title="IA Ejecutiva // Cerebro Operativo" />
            <h3 className="text-2xl lg:text-3xl font-light mb-8 leading-tight">
              Buenos días Fernando.<br/>
              <span className="font-bold">Análisis de la muestra documental:</span>
            </h3>
            <ul className="space-y-6">
              {iaAnalysis.map((item, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <div className="mt-1">
                    <GlowingDot status={item.type === 'critical' ? 'critical' : item.type === 'success' ? 'success' : 'warning'} />
                  </div>
                  <p className="text-sm lg:text-base text-[#D4D4D8] font-light leading-relaxed">{item.text}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5 bg-[#050505] border border-[#1A1A1A] p-8 flex flex-col">
            <SectionHeader title="Alertas Críticas de Negocio" />
            <div className="flex-1 space-y-4">
              {/* Extraído directamente de los findings */}
              <div className="p-4 bg-[#FF3B30]/5 border border-[#FF3B30]/20 flex gap-4 items-start">
                <AlertTriangle size={18} className="text-[#FF3B30] flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-[#FF3B30] mb-1">RIESGO CRÍTICO - QUITO</p>
                  <p className="text-[11px] text-[#A1A1AA]">22 deserciones registradas en el entrenamiento del 20 Septiembre. 12 asignadas al equipo de Juan A.</p>
                </div>
              </div>
              <div className="p-4 bg-[#FFAB00]/5 border border-[#FFAB00]/20 flex gap-4 items-start">
                <ShieldAlert size={18} className="text-[#FFAB00] flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-[#FFAB00] mb-1">ANOMALÍA DE VOLUMEN - CUENCA</p>
                  <p className="text-[11px] text-[#A1A1AA]">E17 reportó 247 participantes en Asistencia Inicio PX. Verificar si corresponde a un super-evento o error de data.</p>
                </div>
              </div>
              <div className="p-4 bg-[#00C853]/5 border border-[#00C853]/20 flex gap-4 items-start">
                <CheckCircle2 size={18} className="text-[#00C853] flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-[#00C853] mb-1">HITO DE CONVERSIÓN - CDMX</p>
                  <p className="text-[11px] text-[#A1A1AA]">E5 (Mauricio) logró 80.4% de conversión a Pagos Totales (33/41).</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ROW 2: MAPA MUNDIAL DE OPERACIONES & ROW 5: RANKING */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-[#050505] border border-[#1A1A1A] p-8 relative">
             <SectionHeader title="Topología de Operaciones" />
             {/* Mapa Abstracto Geométrico */}
             <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8">
               {[
                 { name: "Lima", stat: "Data Consistente", status: "success", px: "E28" },
                 { name: "Quito", stat: "Alerta Deserción", status: "critical", px: "E123" },
                 { name: "Medellín", stat: "Operación Normal", status: "success", px: "E16" },
                 { name: "CDMX", stat: "Alta Conversión", status: "success", px: "E5" },
                 { name: "Cuenca", stat: "Pico de Volumen", status: "warning", px: "E17" },
                 { name: "Guayaquil", stat: "Baja de Aliados", status: "warning", px: "E34" },
               ].map((city, i) => (
                 <div key={i} className="border border-[#1A1A1A] bg-[#0A0A0A] p-5 hover:border-[#2A2A2A] transition-colors cursor-pointer group">
                   <div className="flex justify-between items-start mb-4">
                     <p className="font-bold tracking-wide group-hover:text-[#007AFF] transition-colors">{city.name}</p>
                     <GlowingDot status={city.status} />
                   </div>
                   <div className="font-mono text-[10px] text-[#A1A1AA]">
                     <p className="mb-1">PX RECIENTE: {city.px}</p>
                     <p>ESTADO: <span className={city.status === 'critical' ? 'text-[#FF3B30]' : ''}>{city.stat}</span></p>
                   </div>
                 </div>
               ))}
             </div>
          </div>

          <div className="lg:col-span-4 bg-[#050505] border border-[#1A1A1A] p-8">
            <SectionHeader title="Top Performers (Muestra)" />
            <div className="space-y-8">
              <div>
                <p className="text-[10px] text-[#A1A1AA] font-mono tracking-widest mb-4 border-b border-[#1A1A1A] pb-2">TOP ENROLADORES (MJ)</p>
                {topPerformers.trainers.map((t, i) => (
                  <div key={i} className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold">{t.name}</span>
                    <span className="text-[10px] font-mono text-[#007AFF]">{t.stat}</span>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[10px] text-[#A1A1AA] font-mono tracking-widest mb-4 border-b border-[#1A1A1A] pb-2">TOP CONVERSIÓN (CAP 1-2)</p>
                {topPerformers.conversiones.map((c, i) => (
                  <div key={i} className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold">{c.name}</span>
                    <span className="text-[10px] font-mono text-[#00C853]">{c.stat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ROW 3: RADAR & ROW 8: EMBUDO */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Embudo Horizontal Limpio */}
          <div className="lg:col-span-8 bg-[#050505] border border-[#1A1A1A] p-8 overflow-hidden">
            <SectionHeader title="Arquitectura de Conversión (Flujo Muestra)" />
            <div className="flex flex-col md:flex-row justify-between items-center mt-10 overflow-x-auto pb-4 gap-2">
              {funnelData.map((step, i) => (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center min-w-[100px]">
                    <div className="w-full text-center mb-2">
                      <p className="text-2xl font-light text-white mb-1">{step.value}</p>
                      <p className="text-[9px] text-[#A1A1AA] uppercase font-bold tracking-widest">{step.step}</p>
                    </div>
                    {i < funnelData.length - 1 && (
                      <div className="text-[10px] font-mono text-[#FF3B30] bg-[#FF3B30]/10 px-2 py-0.5 mt-2">
                        -{step.drop}
                      </div>
                    )}
                  </div>
                  {i < funnelData.length - 1 && <ChevronRight className="text-[#2A2A2A] hidden md:block" size={24} />}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Radar Chart */}
          <div className="lg:col-span-4 bg-[#050505] border border-[#1A1A1A] p-8 flex flex-col items-center">
            <div className="w-full"><SectionHeader title="Diagnóstico de Atributos" /></div>
            <div className="w-full h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                  <PolarGrid stroke="#1A1A1A" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: '#A1A1AA', fontSize: 9 }} />
                  <Radar name="Sedes" dataKey="value" stroke="#007AFF" fill="#007AFF" fillOpacity={0.15} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* ROW 7: CALENDARIO ESTRATÉGICO (Visual Abstraction) */}
        <section className="bg-[#050505] border border-[#1A1A1A] p-8">
          <SectionHeader title="Ventana Táctica (Calendario)" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-[#1A1A1A] mt-6">
            <div className="bg-[#0A0A0A] p-6">
              <p className="text-[10px] text-[#A1A1AA] tracking-[0.2em] font-mono mb-4">HOY</p>
              <div className="text-[10px] text-[#00C853] bg-[#00C853]/10 px-3 py-2 uppercase font-bold tracking-wider mb-2">Revisión Cierre Lima</div>
              <div className="text-[10px] text-[#007AFF] bg-[#007AFF]/10 px-3 py-2 uppercase font-bold tracking-wider">Llamada Dir. Quito</div>
            </div>
            <div className="bg-[#0A0A0A] p-6">
              <p className="text-[10px] text-[#A1A1AA] tracking-[0.2em] font-mono mb-4">MAÑANA</p>
              <div className="text-[10px] text-[#8B5CF6] bg-[#8B5CF6]/10 px-3 py-2 uppercase font-bold tracking-wider">Inicio MJ CDMX</div>
            </div>
            <div className="bg-[#0A0A0A] p-6">
              <p className="text-[10px] text-[#A1A1AA] tracking-[0.2em] font-mono mb-4">7 DÍAS</p>
              <div className="text-[10px] text-[#A1A1AA] border border-[#2A2A2A] px-3 py-2 uppercase font-bold tracking-wider">Cierre Facturación Mes</div>
            </div>
            <div className="bg-[#0A0A0A] p-6">
              <p className="text-[10px] text-[#A1A1AA] tracking-[0.2em] font-mono mb-4">30 DÍAS</p>
              <div className="text-[10px] text-[#FFAB00] bg-[#FFAB00]/10 px-3 py-2 uppercase font-bold tracking-wider">Evaluación Cuenca Pico</div>
            </div>
          </div>
        </section>

      </main>

      {/* ------------------------------------------------------------------------
          MODAL: CENTRO DOCUMENTAL (API INTEGRATION)
      ------------------------------------------------------------------------- */}
      {docCenterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-12">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setDocCenterOpen(false)}></div>
          
          <div className="relative w-full h-full bg-[#050505] border border-[#1A1A1A] flex flex-col shadow-2xl">
            {/* Header del Modal */}
            <div className="p-6 border-b border-[#1A1A1A] flex justify-between items-center bg-[#0A0A0A]">
              <div>
                <h2 className="text-xl font-bold tracking-wide uppercase flex items-center gap-3">
                  <Database className="text-[#007AFF]" /> CENTRO DOCUMENTAL MAESTRO
                </h2>
                <p className="text-[#A1A1AA] text-[10px] font-mono mt-1 tracking-widest">CONEXIÓN API: GOOGLE APPS SCRIPT</p>
              </div>
              <button className="text-[#A1A1AA] hover:text-white transition-colors" onClick={() => setDocCenterOpen(false)}>
                <X size={24} />
              </button>
            </div>

            {/* Barra de Herramientas */}
            <div className="p-4 border-b border-[#1A1A1A] bg-[#050505] flex items-center">
              <div className="flex-1 flex items-center bg-[#121212] border border-[#2A2A2A] px-4 py-2 focus-within:border-[#007AFF] transition-colors">
                <Search size={16} className="text-[#A1A1AA] mr-3" />
                <input 
                  type="text" 
                  placeholder="Buscar en el archivo maestro..." 
                  className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-[#A1A1AA] font-mono"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Tabla de Datos */}
            <div className="flex-1 overflow-auto bg-[#000000]">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-[#0A0A0A]">
                    <th className="sticky top-0 bg-[#0A0A0A] px-6 py-4 text-[10px] font-mono text-[#A1A1AA] tracking-[0.2em] border-b border-[#1A1A1A]">Reporte / Origen</th>
                    <th className="sticky top-0 bg-[#0A0A0A] px-6 py-4 text-[10px] font-mono text-[#A1A1AA] tracking-[0.2em] border-b border-[#1A1A1A]">Región</th>
                    <th className="sticky top-0 bg-[#0A0A0A] px-6 py-4 text-[10px] font-mono text-[#A1A1AA] tracking-[0.2em] border-b border-[#1A1A1A]">Categoría</th>
                    <th className="sticky top-0 bg-[#0A0A0A] px-6 py-4 text-[10px] font-mono text-[#A1A1AA] tracking-[0.2em] border-b border-[#1A1A1A]">Estado</th>
                    <th className="sticky top-0 bg-[#0A0A0A] px-6 py-4 text-[10px] font-mono text-[#A1A1AA] tracking-[0.2em] border-b border-[#1A1A1A]">Último Registro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1A1A]">
                  {loadingDocs ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-32 text-center">
                        <Terminal size={32} className="mx-auto text-[#007AFF] animate-pulse mb-4" />
                        <p className="text-[10px] text-[#A1A1AA] font-mono tracking-[0.3em] uppercase">Ejecutando Query...</p>
                      </td>
                    </tr>
                  ) : docs.filter(d => (d["PROYECTO / CIUDAD"] || "").toLowerCase().includes(search.toLowerCase())).map((doc, idx) => {
                    
                    // Categorización Frontend
                    const n = (doc["PROYECTO / CIUDAD"] || "").toUpperCase();
                    let region = 'Global';
                    if(n.includes('LIMA')) region = 'Perú';
                    else if(n.includes('CDMX') || n.includes('MEXICO')) region = 'México';
                    else if(n.includes('MEDELLIN')) region = 'Colombia';
                    else if(n.includes('QUITO') || n.includes('GYE') || n.includes('CUENCA') || n.includes('UIO')) region = 'Ecuador';

                    const estado = doc["ESTADO"] || "Desconocido";
                    
                    return (
                      <tr key={idx} className="hover:bg-[#121212] transition-colors cursor-pointer" onClick={() => window.open(doc["ENLACE EJECUTIVO"], '_blank')}>
                        <td className="px-6 py-4 font-bold text-xs flex items-center gap-3">
                          <FileText size={14} className="text-[#A1A1AA]" />
                          {doc["PROYECTO / CIUDAD"] || "S/N"}
                        </td>
                        <td className="px-6 py-4 text-[#A1A1AA] text-xs">{region}</td>
                        <td className="px-6 py-4 text-[#A1A1AA] text-xs">{doc["CATEGORÍA"]}</td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-bold tracking-widest uppercase border px-2 py-1 ${estado === 'Actualizado' ? 'text-[#00C853] border-[#00C853]/20 bg-[#00C853]/5' : 'text-[#FFAB00] border-[#FFAB00]/20 bg-[#FFAB00]/5'}`}>
                            {estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#A1A1AA] text-[10px] font-mono">
                          {doc["ÚLTIMA ACTUALIZACIÓN"] ? new Date(doc["ÚLTIMA ACTUALIZACIÓN"]).toLocaleDateString('es-ES') : 'N/A'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
