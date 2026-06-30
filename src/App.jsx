import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend 
} from 'recharts';
import { 
  Activity, Users, DollarSign, CheckCircle, Search, Bell, 
  LayoutDashboard, FileText, Settings, PieChart, ExternalLink, Filter,
  Menu, X, MapPin, Briefcase, Sparkles, RefreshCw
} from 'lucide-react';
import logoCrear from './assets/logo-crear.png';

// --- API URL DE APPS SCRIPT ---
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbweuSj-dsQKgKURgx61P4SBU9_CMlmHm6RxlW5Wshse7TArLleik-lrnr7S1fOFes15aw/exec';

// --- MOCK DATA PARA GRÁFICOS ---
const globalKpis = [
  { title: 'Ingresos Totales (Q2)', value: '$1.2M', trend: '+15.3%', isPositive: true, icon: DollarSign, color: 'text-green-400' },
  { title: 'Participantes Activos', value: '450', trend: '+5.2%', isPositive: true, icon: Users, color: 'text-blue-400' },
  { title: 'Net Promoter Score', value: '92', trend: '+2 pts', isPositive: true, icon: Activity, color: 'text-purple-400' },
  { title: 'Cumplimiento Operativo', value: '100%', trend: 'Estable', isPositive: true, icon: CheckCircle, color: 'text-emerald-400' },
];

const trendData = [
  { month: 'Ene', ingresos: 120, participantes: 200 },
  { month: 'Feb', ingresos: 150, participantes: 250 },
  { month: 'Mar', ingresos: 180, participantes: 310 },
  { month: 'Abr', ingresos: 220, participantes: 380 },
  { month: 'May', ingresos: 270, participantes: 420 },
  { month: 'Jun', ingresos: 320, participantes: 450 },
];

const regionalData = [
  { name: 'Lima', ingresos: 350, participantes: 120 },
  { name: 'CDMX', ingresos: 290, participantes: 105 },
  { name: 'GYE', ingresos: 210, participantes: 85 },
  { name: 'Quito', ingresos: 180, participantes: 60 },
  { name: 'Medellín', ingresos: 170, participantes: 80 },
];

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [fileData, setFileData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lastSync, setLastSync] = useState(new Date());
  const [aiInsight, setAiInsight] = useState("Iniciando IA para análisis en vivo...");

  const fetchData = () => {
    fetch(SCRIPT_URL)
      .then(res => res.json())
      .then(data => {
        const formattedData = data.map((item, index) => {
          let region = 'Global';
          if (item["PROYECTO / CIUDAD"].toUpperCase().includes('LIMA')) region = 'Perú';
          else if (item["PROYECTO / CIUDAD"].toUpperCase().includes('CDMX')) region = 'México';
          else if (item["PROYECTO / CIUDAD"].toUpperCase().includes('MEDELLIN')) region = 'Colombia';
          else if (item["PROYECTO / CIUDAD"].toUpperCase().includes('QUITO') || item["PROYECTO / CIUDAD"].toUpperCase().includes('GYE') || item["PROYECTO / CIUDAD"].toUpperCase().includes('CUENCA')) region = 'Ecuador';

          return {
            id: index,
            name: item["PROYECTO / CIUDAD"],
            region: region,
            category: item["CATEGORÍA"],
            status: item["ESTADO"],
            date: item["ÚLTIMA ACTUALIZACIÓN"] ? new Date(item["ÚLTIMA ACTUALIZACIÓN"]).toLocaleDateString('es-ES') : 'N/A',
            link: item["ENLACE EJECUTIVO"]
          };
        });
        setFileData(formattedData);
        setLastSync(new Date());
        
        // Simulación de IA Insights basados en los datos en tiempo real
        const actualizados = formattedData.filter(f => f.status === 'Actualizado').length;
        setAiInsight(`IA Insight: Flujo de datos óptimo. ${actualizados} directorios regionales verificados y en línea.`);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData(); // Carga inicial
    const interval = setInterval(() => {
      fetchData(); // Sincronización en vivo cada 30 segundos
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status) => {
    if (status === 'Actualizado') return <span className="px-3 py-1 bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 rounded-full text-[10px] sm:text-xs font-bold whitespace-nowrap">Actualizado</span>;
    return <span className="px-3 py-1 bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30 rounded-full text-[10px] sm:text-xs font-bold whitespace-nowrap">Pendiente</span>;
  };

  const getCategoryBadge = (category) => {
    if (category === 'Maestría Estratégica') return <span className="px-2 sm:px-3 py-1 bg-[#8B5CF6]/20 text-[#8B5CF6] rounded-md text-[10px] sm:text-xs font-semibold whitespace-nowrap">{category}</span>;
    if (category === 'Archivo Regional') return <span className="px-2 sm:px-3 py-1 bg-[#3B82F6]/20 text-[#3B82F6] rounded-md text-[10px] sm:text-xs font-semibold whitespace-nowrap">{category}</span>;
    return <span className="px-2 sm:px-3 py-1 bg-[#F59E0B]/20 text-[#F59E0B] rounded-md text-[10px] sm:text-xs font-semibold whitespace-nowrap">{category}</span>;
  };

  return (
    <div className="flex h-screen bg-[#0B0F19] text-[#F8FAFC] font-sans overflow-hidden">
      
      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed lg:static top-0 left-0 h-full w-72 lg:w-64 bg-[#151A2D] border-r border-[#2A3143] flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-6 border-b border-[#2A3143] flex justify-between items-center">
          <div>
            <h1 className="flex items-center gap-3">
              <img src={logoCrear} alt="CREAR Poder Sin Límites" className="h-10 w-auto object-contain bg-white p-1 rounded" />
            </h1>
          </div>
          <button 
            className="lg:hidden text-slate-400 hover:text-white bg-[#0B0F19] p-2 rounded-lg"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-[#3B82F6]/10 text-[#3B82F6] rounded-lg font-medium border border-[#3B82F6]/20 transition-all">
            <LayoutDashboard size={18} /> Resumen Global
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800/50 hover:text-white rounded-lg font-medium transition-all">
            <DollarSign size={18} /> Finanzas
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800/50 hover:text-white rounded-lg font-medium transition-all">
            <PieChart size={18} /> Analítica Regional
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800/50 hover:text-white rounded-lg font-medium transition-all">
            <FileText size={18} /> Directorio Maestro
          </a>
        </nav>

        {/* PERFIL CEO - SIDEBAR */}
        <div className="p-5 border-t border-[#2A3143] bg-[#0B0F19]/50">
           <div className="flex items-center gap-3 mb-4">
             <div className="w-12 h-12 rounded-full border-2 border-[#3B82F6] bg-slate-800 flex items-center justify-center font-bold text-lg text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]">
               FA
             </div>
             <div>
               <p className="font-bold text-white text-sm">Fernando Aragón</p>
               <p className="text-xs text-[#3B82F6] font-semibold">CEO y Socio</p>
             </div>
           </div>
           <div className="space-y-2 text-[11px] text-slate-400">
             <p className="flex items-center gap-2"><MapPin size={12} className="text-[#10B981]" /> Residencia: Buenos Aires</p>
             <p className="flex items-center gap-2"><Briefcase size={12} className="text-[#8B5CF6]" /> Facilitador Transformación</p>
           </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        
        {/* TOPBAR */}
        <header className="h-16 lg:h-20 bg-[#151A2D]/90 backdrop-blur-md border-b border-[#2A3143] flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 w-full">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden text-slate-400 hover:text-white p-2 -ml-2"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center bg-[#0B0F19] border border-[#2A3143] rounded-lg px-4 py-2 w-96 focus-within:border-[#3B82F6] transition-colors">
              <Search size={16} className="text-slate-500 mr-3" />
              <input 
                type="text" 
                placeholder="Buscar proyectos, métricas o archivos..." 
                className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-slate-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="md:hidden flex items-center">
              <img src={logoCrear} alt="CREAR" className="h-8 w-auto object-contain bg-white p-1 rounded" />
            </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors hidden sm:block">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#151A2D]"></span>
            </button>
            <div className="flex items-center gap-3 sm:pl-6 sm:border-l border-[#2A3143]">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-white">Fer Aragón</p>
                <p className="text-xs text-[#3B82F6]">Command Center</p>
              </div>
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-[#3B82F6]/20">
                FA
              </div>
            </div>
          </div>
        </header>

        {/* SCROLLABLE DASHBOARD AREA */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6 lg:space-y-8 pb-20 lg:pb-8">
          
          {/* HEADER TITLES & AI SYNC INDICATOR */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl lg:text-3xl font-black text-white">Dashboard Ejecutivo</h2>
              <p className="text-sm lg:text-base text-slate-400 mt-1">Inteligencia Operativa y Control Regional - {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</p>
            </div>
            
            <div className="flex items-center gap-3 bg-gradient-to-r from-[#8B5CF6]/20 to-[#3B82F6]/20 border border-[#8B5CF6]/30 px-4 py-2 rounded-xl w-full md:w-auto">
              <div className="relative flex h-3 w-3 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8B5CF6] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#8B5CF6]"></span>
              </div>
              <div>
                <p className="text-xs font-bold text-white flex items-center gap-1"><Sparkles size={12} className="text-[#8B5CF6]"/> IA Live Sync Activo</p>
                <p className="text-[10px] text-slate-300">Última captura: {lastSync.toLocaleTimeString('es-ES')}</p>
              </div>
            </div>
          </div>
          
          {/* AI INSIGHTS BAR */}
          <div className="bg-[#10B981]/10 border border-[#10B981]/30 rounded-lg p-3 flex items-center gap-3 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <RefreshCw size={16} className={`text-[#10B981] ${loading ? 'animate-spin' : ''} flex-shrink-0`} />
            <p className="text-xs sm:text-sm text-[#10B981] font-medium leading-tight">{aiInsight}</p>
          </div>



          {/* KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {globalKpis.map((kpi, idx) => (
              <div key={idx} className="bg-[#151A2D] border border-[#2A3143] rounded-xl p-5 lg:p-6 relative overflow-hidden group hover:border-[#3B82F6]/50 transition-colors">
                <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent to-current ${kpi.color}`}></div>
                <div className="flex justify-between items-start mb-4">
                  <p className="text-slate-400 text-xs lg:text-sm font-semibold uppercase tracking-wider">{kpi.title}</p>
                  <kpi.icon size={20} className={`${kpi.color} opacity-80 hidden sm:block`} />
                </div>
                <h3 className="text-3xl lg:text-4xl font-black text-white">{kpi.value}</h3>
                <div className="mt-4 flex items-center gap-2 text-xs lg:text-sm">
                  <span className={`font-bold ${kpi.isPositive ? 'text-[#10B981]' : 'text-red-400'}`}>
                    {kpi.trend}
                  </span>
                  <span className="text-slate-500 hidden sm:inline">vs trimestre anterior</span>
                </div>
              </div>
            ))}
          </div>

          {/* CHARTS ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AREA CHART - TENDENCIA */}
            <div className="bg-[#151A2D] border border-[#2A3143] rounded-xl p-4 lg:p-6 overflow-x-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 w-full min-w-[300px]">
                <h3 className="text-base lg:text-lg font-bold text-white">Tendencia de Ingresos & Participantes</h3>
                <select className="bg-[#0B0F19] border border-[#2A3143] text-xs text-slate-300 rounded px-2 py-1 outline-none w-full sm:w-auto">
                  <option>Últimos 6 meses</option>
                  <option>Año 2026</option>
                </select>
              </div>
              <div className="h-64 lg:h-72 w-full min-w-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorParticipantes" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A3143" vertical={false} />
                    <XAxis dataKey="month" stroke="#64748b" tick={{fill: '#64748b', fontSize: 10}} axisLine={false} tickLine={false} />
                    <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 10}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#2A3143', borderRadius: '8px' }}
                      itemStyle={{ fontWeight: 'bold', fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="ingresos" name="Ingresos (k USD)" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorIngresos)" />
                    <Area type="monotone" dataKey="participantes" name="Participantes" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorParticipantes)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* BAR CHART - REGIONAL */}
            <div className="bg-[#151A2D] border border-[#2A3143] rounded-xl p-4 lg:p-6 overflow-x-auto">
              <div className="flex justify-between items-center mb-6 min-w-[300px]">
                <h3 className="text-base lg:text-lg font-bold text-white">Desempeño Comparativo Regional</h3>
                <button className="text-slate-400 hover:text-white"><Filter size={16}/></button>
              </div>
              <div className="h-64 lg:h-72 w-full min-w-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={12}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A3143" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b', fontSize: 10}} axisLine={false} tickLine={false} />
                    <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 10}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{fill: '#2A3143', opacity: 0.4}}
                      contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#2A3143', borderRadius: '8px' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                    <Bar dataKey="ingresos" name="Ingresos (k USD)" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="participantes" name="Participantes" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* DATAGRID - DIRECTORIO DE ARCHIVOS */}
          <div className="bg-[#151A2D] border border-[#2A3143] rounded-xl overflow-hidden shadow-2xl shadow-black/50">
            <div className="p-4 lg:p-6 border-b border-[#2A3143] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
              <div>
                <h3 className="text-base lg:text-lg font-bold text-white">Directorio Maestro de Archivos</h3>
                <p className="text-xs lg:text-sm text-slate-400">Sincronización en vivo con la Unidad Compartida</p>
              </div>
              <div className="flex w-full sm:w-auto items-center gap-2">
                {/* Mobile Search Input */}
                <div className="flex-1 md:hidden flex items-center bg-[#0B0F19] border border-[#2A3143] rounded-lg px-3 py-2 focus-within:border-[#3B82F6]">
                  <Search size={14} className="text-slate-500 mr-2" />
                  <input 
                    type="text" 
                    placeholder="Buscar..." 
                    className="bg-transparent border-none outline-none text-xs w-full text-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="px-3 lg:px-4 py-2 bg-[#3B82F6] hover:bg-blue-600 text-white text-xs lg:text-sm font-bold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap">
                  <ExternalLink size={14} />
                  <span className="hidden sm:inline">Auditoría</span>
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-[#0B0F19]">
                    <th className="px-4 lg:px-6 py-4 text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-[#2A3143]">Nombre del Reporte</th>
                    <th className="px-4 lg:px-6 py-4 text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-[#2A3143]">Región</th>
                    <th className="px-4 lg:px-6 py-4 text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-[#2A3143]">Categoría</th>
                    <th className="px-4 lg:px-6 py-4 text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-[#2A3143]">Estado</th>
                    <th className="px-4 lg:px-6 py-4 text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-[#2A3143]">Última Sincronización</th>
                    <th className="px-4 lg:px-6 py-4 text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-[#2A3143] text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A3143]/50">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="w-8 h-8 border-4 border-[#3B82F6] border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-slate-400 font-medium text-sm animate-pulse">Analizando flujos con IA y sincronizando en vivo con Google Drive...</span>
                        </div>
                      </td>
                    </tr>
                  ) : fileData.filter(file => file.name.toLowerCase().includes(searchTerm.toLowerCase())).map((file) => (
                    <tr key={file.id} className="hover:bg-[#3B82F6]/5 transition-colors group">
                      <td className="px-4 lg:px-6 py-3 lg:py-4 font-medium text-white flex items-center gap-2 lg:gap-3 text-xs lg:text-sm">
                        <FileText size={16} className="text-slate-500 group-hover:text-[#3B82F6] flex-shrink-0" />
                        <span className="truncate max-w-[150px] sm:max-w-[200px] lg:max-w-none">{file.name}</span>
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 text-slate-300 text-xs lg:text-sm">{file.region}</td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4">{getCategoryBadge(file.category)}</td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4">{getStatusBadge(file.status)}</td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 text-slate-400 text-[10px] lg:text-xs">{file.date}</td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 text-right">
                        <a href={file.link} target="_blank" rel="noopener noreferrer" className="text-[#3B82F6] hover:text-white font-bold text-xs lg:text-sm transition-colors border border-[#3B82F6]/30 px-3 py-1.5 rounded bg-[#3B82F6]/10 hover:bg-[#3B82F6] hover:border-[#3B82F6]">
                          Abrir
                        </a>
                      </td>
                    </tr>
                  ))}
                  {(!loading && fileData.filter(file => file.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0) && (
                     <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-slate-400 text-sm">
                        No se encontraron archivos que coincidan con la búsqueda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
