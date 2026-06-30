import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend 
} from 'recharts';
import { 
  Activity, Users, DollarSign, CheckCircle, Search, Bell, 
  LayoutDashboard, FileText, Settings, Globe, PieChart, ExternalLink, Filter 
} from 'lucide-react';

// --- MOCK DATA BASADO EN TU CARPETA DE DRIVE Y MÉTRICAS DE NEGOCIO ---
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

const fileData = [
  { id: 1, name: 'MAESTRIA LIMA.xlsx', region: 'Perú', category: 'Maestría Estratégica', status: 'Actualizado', date: '29/06/2026', link: '#' },
  { id: 2, name: 'REPORTE CAP 1-2 2026.xlsx', region: 'Global', category: 'Control Operativo', status: 'Actualizado', date: '29/06/2026', link: '#' },
  { id: 3, name: 'MJ CDMX.xlsx', region: 'México', category: 'Archivo Regional', status: 'Actualizado', date: '29/06/2026', link: '#' },
  { id: 4, name: 'MAESTRIA GYE.xlsx', region: 'Ecuador', category: 'Maestría Estratégica', status: 'Actualizado', date: '27/06/2026', link: '#' },
  { id: 5, name: 'MAESTRIA QUITO.xlsx', region: 'Ecuador', category: 'Maestría Estratégica', status: 'Actualizado', date: '27/06/2026', link: '#' },
  { id: 6, name: 'MAESTRIA CUENCA.xlsx', region: 'Ecuador', category: 'Maestría Estratégica', status: 'Actualizado', date: '27/06/2026', link: '#' },
  { id: 7, name: 'MJ MEDELLIN.xlsx', region: 'Colombia', category: 'Archivo Regional', status: 'Revisión Pendiente', date: '22/06/2026', link: '#' },
  { id: 8, name: 'Dashboard Estadísticas - Fer.gs', region: 'Global', category: 'Control Operativo', status: 'Actualizado', date: '29/06/2026', link: '#' },
];

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusBadge = (status) => {
    if (status === 'Actualizado') return <span className="px-3 py-1 bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 rounded-full text-xs font-bold">Actualizado</span>;
    return <span className="px-3 py-1 bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30 rounded-full text-xs font-bold">Pendiente</span>;
  };

  const getCategoryBadge = (category) => {
    if (category === 'Maestría Estratégica') return <span className="px-3 py-1 bg-[#8B5CF6]/20 text-[#8B5CF6] rounded-md text-xs font-semibold">{category}</span>;
    if (category === 'Archivo Regional') return <span className="px-3 py-1 bg-[#3B82F6]/20 text-[#3B82F6] rounded-md text-xs font-semibold">{category}</span>;
    return <span className="px-3 py-1 bg-[#F59E0B]/20 text-[#F59E0B] rounded-md text-xs font-semibold">{category}</span>;
  };

  return (
    <div className="flex h-screen bg-[#0B0F19] text-[#F8FAFC] font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#151A2D] border-r border-[#2A3143] flex flex-col">
        <div className="p-6 border-b border-[#2A3143]">
          <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
            <Globe className="text-[#3B82F6]" />
            CREAR <span className="text-[#10B981]">PSL</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Transformación Global</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
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
            <FileText size={18} /> Directorio de Archivos
          </a>
        </nav>

        <div className="p-4 border-t border-[#2A3143]">
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800/50 hover:text-white rounded-lg font-medium transition-all">
            <Settings size={18} /> Configuración
          </a>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* TOPBAR */}
        <header className="h-20 bg-[#151A2D]/80 backdrop-blur-md border-b border-[#2A3143] flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center bg-[#0B0F19] border border-[#2A3143] rounded-lg px-4 py-2 w-96 focus-within:border-[#3B82F6] transition-colors">
            <Search size={16} className="text-slate-500 mr-3" />
            <input 
              type="text" 
              placeholder="Buscar proyectos, métricas o archivos..." 
              className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-slate-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#151A2D]"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-[#2A3143]">
              <div className="text-right">
                <p className="text-sm font-bold text-white">Fer Aragón</p>
                <p className="text-xs text-[#3B82F6]">CEO Dashboard</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center text-white font-bold shadow-lg shadow-[#3B82F6]/20">
                FA
              </div>
            </div>
          </div>
        </header>

        {/* SCROLLABLE DASHBOARD AREA */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {/* HEADER TITLES */}
          <div>
            <h2 className="text-3xl font-black text-white">Command Center</h2>
            <p className="text-slate-400 mt-1">Inteligencia Operativa y Control Regional - {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</p>
          </div>

          {/* KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {globalKpis.map((kpi, idx) => (
              <div key={idx} className="bg-[#151A2D] border border-[#2A3143] rounded-xl p-6 relative overflow-hidden group hover:border-[#3B82F6]/50 transition-colors">
                <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent to-current ${kpi.color}`}></div>
                <div className="flex justify-between items-start mb-4">
                  <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">{kpi.title}</p>
                  <kpi.icon size={20} className={`${kpi.color} opacity-80`} />
                </div>
                <h3 className="text-4xl font-black text-white">{kpi.value}</h3>
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <span className={`font-bold ${kpi.isPositive ? 'text-[#10B981]' : 'text-red-400'}`}>
                    {kpi.trend}
                  </span>
                  <span className="text-slate-500">vs trimestre anterior</span>
                </div>
              </div>
            ))}
          </div>

          {/* CHARTS ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AREA CHART - TENDENCIA */}
            <div className="bg-[#151A2D] border border-[#2A3143] rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Tendencia de Ingresos & Participantes</h3>
                <select className="bg-[#0B0F19] border border-[#2A3143] text-xs text-slate-300 rounded px-2 py-1 outline-none">
                  <option>Últimos 6 meses</option>
                  <option>Año 2026</option>
                </select>
              </div>
              <div className="h-72 w-full">
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
                    <XAxis dataKey="month" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                    <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#2A3143', borderRadius: '8px' }}
                      itemStyle={{ fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="ingresos" name="Ingresos (k USD)" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorIngresos)" />
                    <Area type="monotone" dataKey="participantes" name="Participantes" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorParticipantes)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* BAR CHART - REGIONAL */}
            <div className="bg-[#151A2D] border border-[#2A3143] rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Desempeño Comparativo Regional</h3>
                <button className="text-slate-400 hover:text-white"><Filter size={16}/></button>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={12}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A3143" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                    <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
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
            <div className="p-6 border-b border-[#2A3143] flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white">Directorio Maestro de Archivos</h3>
                <p className="text-sm text-slate-400">Sincronización en vivo con la Unidad Compartida "Estadísticas"</p>
              </div>
              <button className="px-4 py-2 bg-[#3B82F6] hover:bg-blue-600 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2">
                <ExternalLink size={16} />
                Auditoría Completa
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0B0F19]">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-[#2A3143]">Nombre del Reporte</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-[#2A3143]">Región</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-[#2A3143]">Categoría</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-[#2A3143]">Estado</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-[#2A3143]">Última Sincronización</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-[#2A3143] text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A3143]/50">
                  {fileData.filter(file => file.name.toLowerCase().includes(searchTerm.toLowerCase())).map((file) => (
                    <tr key={file.id} className="hover:bg-[#3B82F6]/5 transition-colors group">
                      <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                        <FileText size={18} className="text-slate-500 group-hover:text-[#3B82F6] transition-colors" />
                        {file.name}
                      </td>
                      <td className="px-6 py-4 text-slate-300 text-sm">{file.region}</td>
                      <td className="px-6 py-4">{getCategoryBadge(file.category)}</td>
                      <td className="px-6 py-4">{getStatusBadge(file.status)}</td>
                      <td className="px-6 py-4 text-slate-400 text-sm">{file.date}</td>
                      <td className="px-6 py-4 text-right">
                        <a href={file.link} className="text-[#3B82F6] hover:text-white font-semibold text-sm transition-colors">
                          Abrir
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
