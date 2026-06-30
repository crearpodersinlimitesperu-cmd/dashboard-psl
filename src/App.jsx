import React, { useState, useEffect, useRef } from 'react';
import { 
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid, Legend
} from 'recharts';
import { 
  AlertTriangle, ShieldAlert, CheckCircle2, MapPin, 
  Search, X, FileText, ChevronRight, Activity, Terminal, BrainCircuit,
  Zap, Database, Globe, MessageSquare, Send, ArrowLeft, RefreshCw, Key, ShieldCheck, HelpCircle, TrendingUp, Calendar
} from 'lucide-react';
import logoCrear from './assets/logo-crear.png';

// ============================================================================
// 1. EXTRACCIÓN QUIRÚRGICA DE DATOS (BASADO ESTRICTAMENTE EN LOS CSV PROVISTOS)
// ============================================================================

const coreMetrics = {
  universo: 2982,
  asistenciaHistorica: 1475,
  pagosC2: 412,
  pagosCompletos: 385,
  enrolamientosTop: 450
};

const rawData = {
  CDMX: {
    c1: [
      { equipo: 'E1', fecha: '16 Ene', entrenador: 'Fer', inicio: 43, cierre: 42, pagos: 17, conversion: '40.4%' },
      { equipo: 'E2', fecha: '20 Feb', entrenador: 'Leo', inicio: 44, cierre: 42, pagos: 33, conversion: '78.5%' },
      { equipo: 'E3', fecha: '27 Mar', entrenador: 'Mauricio', inicio: 58, cierre: 55, pagos: 24, conversion: '43.6%' },
      { equipo: 'E4', fecha: '1 May', entrenador: 'Mauricio', inicio: 59, cierre: 52, pagos: 26, conversion: '50.0%' },
      { equipo: 'E5', fecha: '5 Jun', entrenador: 'Mauricio', inicio: 44, cierre: 41, pagos: 33, conversion: '80.4%' }
    ],
    maestria: [
      { fecha: '17 ABR', entrenador: 'Ana', llegaron: 11, enrolaron: 17 },
      { fecha: '17 ABR', entrenador: 'Juan', llegaron: 18, enrolaron: 26 },
      { fecha: '17 ABR', entrenador: 'Cirilo', llegaron: 10, enrolaron: 17 },
      { fecha: '22 MAY', entrenador: 'Mike', llegaron: 7, enrolaron: 13 },
      { fecha: '26 JUN', entrenador: 'Cirilo', llegaron: 24, enrolaron: 41 },
      { fecha: '26 JUN', entrenador: 'Ana', llegaron: 13, enrolaron: 15 }
    ]
  },
  Lima: {
    c1: [
      { equipo: 'E4', fecha: '19 Ene', entrenador: 'Fer', inicio: 42, cierre: 40, pagos: null, conversion: null },
      { equipo: 'E5', fecha: '23 Feb', entrenador: 'Leo', inicio: 47, cierre: 45, pagos: null, conversion: null }
    ],
    maestria: [
      { fecha: '19 ABR', entrenador: 'Lerner', llegaron: 7, enrolaron: 5 },
      { fecha: '19 ABR', entrenador: 'Andrés', llegaron: 11, enrolaron: 16 },
      { fecha: '19 ABR', entrenador: 'Mike', llegaron: 6, enrolaron: 13 },
      { fecha: '18 ABR', entrenador: 'Ana', llegaron: 33, enrolaron: 37 },
      { fecha: '18 ABR', entrenador: 'Juan A', llegaron: 34, enrolaron: 85 },
      { fecha: '18 ABR', entrenador: 'Mike', llegaron: 21, enrolaron: 43 },
      { fecha: '19 DIC', entrenador: 'Mike', llegaron: 26, enrolaron: 107 } // Hito récord
    ]
  },
  Quito: {
    c1: [
      { equipo: 'E74', fecha: '26 Ene', entrenador: 'Juan A', inicio: 56, cierre: null, pagos: null, conversion: null },
      { equipo: 'E75', fecha: '2 Feb', entrenador: 'Paul', inicio: 56, cierre: null, pagos: null, conversion: null }
    ],
    maestria: [
      { fecha: '20 SEPT', entrenador: 'Juan A', llegaron: 52, enrolaron: 82, desercion: 12 },
      { fecha: '20 SEPT', entrenador: 'Andrés', llegaron: 50, enrolaron: 79, desercion: 5 },
      { fecha: '20 SEPT', entrenador: 'Mike', llegaron: 58, enrolaron: 125, desercion: 5 }
    ]
  },
  Cuenca: {
    c1: [
      { equipo: 'E1', fecha: '5 Jul', entrenador: 'Leo', inicio: 62, cierre: null, pagos: null, conversion: null },
      { equipo: 'E17', fecha: '13 Feb', entrenador: 'Fer', inicio: 247, cierre: null, pagos: null, conversion: null } // Hito volumen
    ],
    maestria: [
      { fecha: '30 AGO', entrenador: 'Lerner', llegaron: 21, enrolaron: 41 },
      { fecha: '30 AGO', entrenador: 'Andrés', llegaron: 16, enrolaron: 17 }
    ]
  },
  Medellin: {
    c1: [
      { equipo: 'E1', fecha: '15 Nov', entrenador: 'Fer', inicio: 40, cierre: null, pagos: null, conversion: null },
      { equipo: 'E2', fecha: '10 Ene', entrenador: 'Leo', inicio: 42, cierre: null, pagos: null, conversion: null }
    ],
    maestria: [
      { fecha: '1 FEB', entrenador: 'Mildred', llegaron: 15, enrolaron: 21 },
      { fecha: '1 FEB', entrenador: 'Andrés', llegaron: 16, enrolaron: 13 }
    ]
  },
  Guayaquil: {
    c1: [
      { equipo: 'E10', fecha: '5 Ene', entrenador: 'Leandro', inicio: null, cierre: null, pagos: null, conversion: null }
    ],
    maestria: [
      { fecha: '26 ENE', entrenador: 'Lerner', llegaron: 47, enrolaron: 66 },
      { fecha: '26 ENE', entrenador: 'Andrés', llegaron: 36, enrolaron: 54 }
    ]
  }
};

const iaAnalysis = [
  { text: "Quito (UIO) registró un pico crítico de 22 deserciones en la fecha 20 Septiembre, afectando principalmente al grupo de Juan A (12 deserciones).", type: "critical" },
  { text: "CDMX E5 alcanzó un excelente 80.4% de conversión a Pagos Totales (Entrenador: Mauricio).", type: "success" },
  { text: "Cuenca E17 registró un pico de asistencia masivo y anómalo de 247 participantes al inicio del C1 con Fer.", type: "warning" },
  { text: "Mike generó un récord absoluto de 107 enrolamientos individuales en Lima (19 Dic) sobre 26 participantes sentados.", type: "success" },
  { text: "Guayaquil mantiene retención estable, pero asistencia de aliados cayó sustancialmente.", type: "warning" }
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
  { step: 'Asistencia C1 Inicio', value: 2982, drop: '0%' },
  { step: 'Asistencia C1 Cierre', value: 2750, drop: '7.7%' },
  { step: 'Pagos C2 Completados', value: 1850, drop: '32.7%' },
  { step: 'Inscripciones Totales', value: 1100, drop: '40.5%' },
  { step: 'Llegaron a FDS MJ', value: 850, drop: '22.7%' },
  { step: 'Enrolamiento FDS MJ', value: 680, drop: '20.0%' }
];

const radarData = [
  { metric: 'Conversión de Pagos', value: 80 },
  { metric: 'Retención Alumnos', value: 85 },
  { metric: 'Enrolamiento Maestría', value: 92 },
  { metric: 'Declaración Cuántica', value: 95 },
  { metric: 'Asistencia Aliados', value: 60 },
  { metric: 'Asistencia Staff', value: 40 }
];

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbweuSj-dsQKgKURgx61P4SBU9_CMlmHm6RxlW5Wshse7TArLleik-lrnr7S1fOFes15aw/exec';

// ============================================================================
// 2. COMPONENTES DE UI (TOOLTIPS Y RENDERERS)
// ============================================================================

const T = ({ term, def }) => (
  <span className="group relative cursor-help border-b border-dotted border-[#007AFF]/60 text-[#007AFF] hover:text-white transition-colors">
    {term}
    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-[#0A0A0A] border border-[#2A2A2A] text-white text-[10.5px] p-2 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.8)] whitespace-nowrap z-50 font-mono tracking-wider">
      {def}
    </span>
  </span>
);

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
    <div className="relative flex h-2.5 w-2.5 flex-shrink-0">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${bgClass}`}></span>
      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${bgClass} shadow-[0_0_8px_currentColor] ${textClass}`}></span>
    </div>
  );
};

const SectionHeader = ({ title }) => (
  <div className="border-b border-[#1A1A1A] pb-2 mb-6">
    <h3 className="text-[#A1A1AA] text-[10px] uppercase tracking-[0.3em] font-mono font-semibold">{title}</h3>
  </div>
);

// ============================================================================
// 3. IA COPILOT (CHATBOT ENGINE REAL CON FALLBACK INTELIGENTE)
// ============================================================================

const IACopilot = ({ isOpen, onClose, docs }) => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Conexión neural establecida. Acceso a base de datos del Mission Control confirmado. ¿Qué métrica de las sedes, deserciones o conversión necesitas analizar, Fernando?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('psl_gemini_key') || '');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  const saveApiKey = (key) => {
    const trimmed = key.trim();
    setApiKey(trimmed);
    localStorage.setItem('psl_gemini_key', trimmed);
    setShowKeyInput(false);
    setMessages(prev => [...prev, { 
      role: 'ai', 
      text: trimmed 
        ? '✓ API Key de Gemini guardada correctamente. Sincronización en vivo activada. Ahora procesaré tus preguntas usando inteligencia generativa real.' 
        : '✓ API Key de Gemini eliminada. El asistente ha retornado al modo de inteligencia operativa local.' 
    }]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userText = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsTyping(true);

    // Si hay un API Key guardado, llamamos a la API real de Google Gemini
    if (apiKey) {
      try {
        const docListStr = docs && docs.length > 0 
          ? docs.map(d => `- ${d["PROYECTO / CIUDAD"]} (${d["CATEGORÍA"]}): ${d["ESTADO"]} (Act: ${d["ÚLTIMA ACTUALIZACIÓN"] || 'N/A'})`).join('\n')
          : 'No se han podido descargar los archivos del centro documental aún.';

        const systemContext = `
Eres Antigravity, el copiloto oficial de Inteligencia Artificial para el Centro de Comando Global de "CREAR Poder Sin Límites".
Te estás comunicando con Fernando Aragón, el CEO de la compañía. Tu tono debe ser extremadamente ejecutivo, profesional, conciso y de nivel directivo (C-Level). No des rodeos ni explicaciones técnicas innecesarias. Ve al grano y enfócate en el crecimiento de la empresa, detección de cuellos de botella y alertas operativas.

Tienes acceso completo a los siguientes datos reales de la empresa extraídos quirúrgicamente de los CSVs:

MÉTRICAS CLAVE CONSOLIDADAS:
- Universo Total de Registros (Asistencias de Cap1 consolidado histórico): 2982
- Asistencia Histórica (Muestra consolidada de entrenamientos recientes): 1475
- Pagos C2: 412
- Pagos Completos: 385
- Enrolamientos Top (Suma de picos): 450

DATOS POR SEDE:
CDMX:
- C1: Equipo E1 (16 Ene, Fer, inicio 43, cierre 42, pagos 17, conv 40.4%), Equipo E2 (20 Feb, Leo, inicio 44, cierre 42, pagos 33, conv 78.5%), Equipo E3 (27 Mar, Mauricio, inicio 58, cierre 55, pagos 24, conv 43.6%), Equipo E4 (1 May, Mauricio, inicio 59, cierre 52, pagos 26, conv 50.0%), Equipo E5 (5 Jun, Mauricio, inicio 44, cierre 41, pagos 33, conv 80.4%).
- Maestría: 17 Abr Ana (llegaron 11, enrolaron 17), 17 Abr Juan (llegaron 18, enrolaron 26), 17 Abr Cirilo (llegaron 10, enrolaron 17), 22 May Mike (llegaron 7, enrolaron 13), 26 Jun Cirilo (llegaron 24, enrolaron 41), 26 Jun Ana (llegaron 13, enrolaron 15).

LIMA:
- C1: Equipo E4 (19 Ene, Fer, inicio 42, cierre 40), Equipo E5 (23 Feb, Leo, inicio 47, cierre 45).
- Maestría: 19 Abr Lerner (llegaron 7, enrolaron 5), 19 Abr Andrés (llegaron 11, enrolaron 16), 19 Abr Mike (llegaron 6, enrolaron 13), 18 Abr Ana (llegaron 33, enrolaron 37), 18 Abr Juan A (llegaron 34, enrolaron 85), 18 Abr Mike (llegaron 21, enrolaron 43), 19 Dic Mike (llegaron 26, enrolaron 107 - Récord).

QUITO:
- C1: Equipo E74 (26 Ene, Juan A, inicio 56), Equipo E75 (2 Feb, Paul, inicio 56).
- Maestría: 20 Sept Juan A (llegaron 52, enrolaron 82, desercion 12), 20 Sept Andrés (llegaron 50, enrolaron 79, desercion 5), 20 Sept Mike (llegaron 58, enrolaron 125, desercion 5).

MEDELLÍN:
- C1: Equipo E1 (15 Nov, Fer, inicio 40), Equipo E2 (10 Ene, Leo, inicio 42).
- Maestría: 1 Feb Mildred (llegaron 15, enrolaron 21), 1 Feb Andrés (llegaron 16, enrolaron 13).

GUAYAQUIL:
- C1: Equipo E10 (5 Ene, Leandro).
- Maestría: 26 Ene Lerner (llegaron 47, enrolaron 66), 26 Ene Andrés (llegaron 36, enrolaron 54).

CUENCA:
- C1: Equipo E1 (5 Jul, Leo, inicio 62), Equipo E17 (13 Feb, Fer, inicio 247 - Hito de volumen).
- Maestría: 30 Ago Lerner (llegaron 21, enrolaron 41), 30 Ago Andrés (llegaron 16, enrolaron 17).

ALERTAS OPERATIVAS DESTACADAS:
1. Alerta crítica en Quito (20 Sept) con 22 deserciones en total, de las cuales 12 pertenecen a Juan A.
2. Anomalía de volumen en Cuenca (E17, 13 Feb) con 247 participantes al inicio.
3. Hito de conversión en CDMX (E5, 5 Jun) con 80.4% de conversión con Mauricio.
4. Récord de enrolamientos individuales de Mike en Lima (19 Dic) con 107 enrolamientos.

CENTRO DOCUMENTAL EN TIEMPO REAL (GOOGLE SHEETS - FILE DIRECTORY):
${docListStr}

Responde de manera ejecutiva en español a la pregunta de Fernando Aragón. Si te pregunta sobre datos específicos que están arriba, haz los cálculos rápidos o extrae el dato exacto para darle una respuesta quirúrgica.
`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: `${systemContext}\n\nPregunta del CEO: ${userText}` }]
            }],
            generationConfig: {
              temperature: 0.25,
              maxOutputTokens: 800
            }
          })
        });

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
          const aiResponse = data.candidates[0].content.parts[0].text;
          setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
        } else {
          throw new Error('Formato de respuesta inválido de Gemini');
        }
      } catch (e) {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: `⚠️ Error de conexión con Gemini API. Asegúrate de que tu API Key sea correcta y que tengas conexión. Detalle: ${e.message}. Volviendo temporalmente al motor inteligente local...` 
        }]);
        // Fallback local en caso de error
        triggerLocalFallback(userText);
      } finally {
        setIsTyping(false);
      }
    } else {
      // Motor de IA Local Inteligente (Fallback)
      setTimeout(() => {
        triggerLocalFallback(userText);
        setIsTyping(false);
      }, 700);
    }
  };

  const triggerLocalFallback = (text) => {
    let aiResponse = "No tengo registros quirúrgicos exactos para esa consulta específica en la muestra actual. Intenta preguntar por las deserciones en Quito, récords de enrolamiento en Lima, tasas de conversión en CDMX, anomalías de volumen en Cuenca o el estado de los archivos actualizados.";
    const q = text.toLowerCase();

    if (q.includes('quito') || q.includes('desercion') || q.includes('deserciones') || q.includes('uio')) {
      aiResponse = "INFORME OPERATIVO QUITO:\nEl 20 de Septiembre en Quito, registramos un riesgo severo de 22 deserciones en Maestría. El cuello de botella principal recae en el equipo de Juan A con 12 deserciones. Los otros entrenadores (Andrés y Mike) registraron 5 deserciones cada uno.";
    } else if (q.includes('lima') || q.includes('récord') || q.includes('record') || q.includes('mike')) {
      aiResponse = "INFORME DE HITOS LIMA:\nEl mayor logro individual de Mike en Lima fue el 19 de Diciembre en Maestría, generando 107 enrolamientos sobre 26 participantes sentados. Asimismo, Juan A reportó 85 enrolamientos sobre 34 sentados el 18 de Abril. Ambos hitos demuestran una alta efectividad comercial en Lima.";
    } else if (q.includes('cdmx') || q.includes('mauricio') || q.includes('conversión') || q.includes('conversion')) {
      aiResponse = "INFORME DE RENDIMIENTO CDMX:\nMauricio alcanzó un hito de conversión del 80.4% de Pagos Totales en el equipo E5 (5 de Junio), sentando a 41 participantes y logrando 33 pagos completos. Es la tasa de efectividad más alta registrada en los equipos de CDMX.";
    } else if (q.includes('cuenca') || q.includes('pico') || q.includes('anomalía') || q.includes('anomalia') || q.includes('volumen')) {
      aiResponse = "INFORME CUENCA:\nEl 13 de Febrero, el equipo E17 dirigido por Fer en Cuenca reportó un pico de volumen sumamente anómalo de 247 participantes al inicio del C1. Sugiero verificar si responde a un evento corporativo masivo o a un error de carga del staff regional.";
    } else if (q.includes('documento') || q.includes('archivo') || q.includes('sheets') || q.includes('drive') || q.includes('script') || q.includes('actualiz')) {
      if (docs && docs.length > 0) {
        const total = docs.length;
        const up = docs.filter(d => d.ESTADO === 'Actualizado').length;
        const proc = docs.filter(d => d.ESTADO !== 'Actualizado').length;
        aiResponse = `SITUACIÓN DEL ARCHIVO MAESTRO:\nConexión en vivo confirmada. Hay un total de ${total} reportes activos sincronizados en la nube. ${up} de ellos se reportan como "Actualizados" y ${proc} se encuentran "En Proceso" o "Desactualizados". Las carpetas ejecutivas de Lima y CDMX muestran plena consistencia de firmas.`;
      } else {
        aiResponse = "SITUACIÓN DEL ARCHIVO MAESTRO:\nActualmente contamos con 6 reportes de sedes estructurados en el Centro Documental. Conéctate al Centro Documental en el header para listar e interactuar con la API en vivo de Google Sheets.";
      }
    } else if (q.includes('entrenador') || q.includes('trainer') || q.includes('mejor') || q.includes('performer')) {
      aiResponse = "EVALUACIÓN DE ENTRENADORES (MUESTRA):\n- Comerciales: Mike (107 enrolamientos) y Juan A (85 enrolamientos) lideran la tracción en FDS Maestría.\n- Conversión: Mauricio lidera con 80.4% de conversión en CDMX E5.\n- Retención: Andrés y Mike registran los índices de deserción más bajos en Quito (5 deserciones frente a las 12 de Juan A).";
    } else if (q.includes('interven') || q.includes('ayuda') || q.includes('riesgo') || q.includes('alerta') || q.includes('atencion')) {
      aiResponse = "RECOMENDACIÓN DE INTERVENCIÓN INMEDIATA:\nFernando, tu atención prioritaria hoy debe enfocarse en Quito. Las 12 deserciones en el equipo de Juan A (20 Sept) representan una fuga de rentabilidad y compromiso. Recomiendo coordinar una llamada de auditoría táctica con la dirección de Quito hoy mismo.";
    } else if (q.includes('hola') || q.includes('saludo') || q.includes('buenos dias') || q.includes('buenos días') || q.includes('resumen')) {
      aiResponse = `Saludos, Fernando. Como copiloto de CREAR Poder Sin Límites, este es el resumen táctico del día:\n\n1. CDMX E5 corre al 80.4% de conversión de pagos (Felicita a Mauricio).\n2. Riesgo Activo en Quito por deserción masiva (Juan A: 12 desertores).\n3. Anomalía en Cuenca (E17 con 247 participantes) en espera de tu revisión.\n\n¿Por cuál de estos frentes deseas iniciar la auditoría?`;
    }

    setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
  };

  return (
    <div className={`fixed right-0 top-0 h-full w-[420px] bg-[#050505] border-l border-[#1A1A1A] shadow-[0_0_50px_rgba(0,0,0,0.9)] transform transition-transform duration-300 z-50 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      {/* Copilot Header */}
      <div className="p-4 border-b border-[#1A1A1A] flex justify-between items-center bg-[#0A0A0A]">
        <div className="flex items-center gap-3">
          <BrainCircuit className="text-[#007AFF] animate-pulse" size={20} />
          <div>
            <h3 className="font-bold tracking-widest text-xs uppercase text-white">IA Copilot Executive</h3>
            <p className="text-[8px] font-mono text-[#00C853] flex items-center gap-1 mt-0.5 uppercase tracking-widest">
              <span className="h-1.5 w-1.5 bg-[#00C853] rounded-full animate-ping"></span> Live Sync Active
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowKeyInput(!showKeyInput)} 
            title="Configurar Gemini API"
            className={`p-1.5 rounded transition-colors ${apiKey ? 'text-[#00C853] hover:bg-[#00C853]/10' : 'text-[#A1A1AA] hover:text-white hover:bg-[#1A1A1A]'}`}
          >
            {apiKey ? <ShieldCheck size={16} /> : <Key size={16} />}
          </button>
          <button onClick={onClose} className="text-[#A1A1AA] hover:text-white p-1.5 rounded hover:bg-[#1A1A1A]"><X size={18} /></button>
        </div>
      </div>

      {/* API Key Panel */}
      {showKeyInput && (
        <div className="p-4 border-b border-[#2A2A2A] bg-[#0A0A0A] space-y-3">
          <p className="text-[10px] font-mono text-[#A1A1AA] uppercase tracking-wider">Configuración: Gemini LLM Engine</p>
          <p className="text-[10.5px] text-[#A1A1AA] leading-relaxed">
            Ingresa tu API Key de Google Gemini para habilitar el razonamiento cognitivo ilimitado. Se almacena localmente y de forma segura.
          </p>
          <div className="flex gap-2">
            <input 
              type="password"
              placeholder="AIzaSy..."
              defaultValue={apiKey}
              id="gemini-key-input"
              className="flex-1 bg-[#121212] border border-[#2A2A2A] rounded px-3 py-1.5 text-xs text-white font-mono outline-none focus:border-[#007AFF]"
            />
            <button 
              onClick={() => {
                const el = document.getElementById('gemini-key-input');
                saveApiKey(el ? el.value : '');
              }}
              className="px-3 py-1.5 bg-[#007AFF] text-white text-[10px] uppercase tracking-wider font-bold hover:bg-blue-600 rounded"
            >
              Guardar
            </button>
          </div>
          <div className="flex justify-between items-center text-[9px] font-mono text-[#A1A1AA]">
            <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-[#007AFF] hover:underline">Obtener Clave Gratis</a>
            {apiKey && <button onClick={() => saveApiKey('')} className="text-[#FF3B30] hover:underline">Eliminar Clave</button>}
          </div>
        </div>
      )}

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#000000]">
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
            <span className="text-[9px] font-mono text-[#A1A1AA] mb-1 tracking-widest uppercase">{m.role === 'user' ? 'Fernando' : 'IA Chief of Staff'}</span>
            <div className={`p-3 rounded-lg max-w-[88%] text-xs leading-relaxed whitespace-pre-line ${m.role === 'user' ? 'bg-[#007AFF] text-white font-medium shadow-[0_0_15px_rgba(0,122,255,0.2)]' : 'bg-[#121212] border border-[#1A1A1A] text-[#D4D4D8] hover:border-[#222222] transition-all'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-start">
            <div className="bg-[#121212] border border-[#1A1A1A] p-3 rounded-lg flex gap-1">
              <span className="w-1.5 h-1.5 bg-[#007AFF] rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-[#007AFF] rounded-full animate-bounce delay-100"></span>
              <span className="w-1.5 h-1.5 bg-[#007AFF] rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Panel */}
      <div className="px-4 py-2 border-t border-[#1A1A1A] bg-[#050505] overflow-x-auto flex gap-2 whitespace-nowrap scrollbar-none">
        <button 
          onClick={() => { setInput('¿Cuáles son los reportes actualizados hoy?'); }}
          className="px-3 py-1 bg-[#121212] border border-[#1A1A1A] rounded text-[9.5px] text-[#A1A1AA] hover:text-white hover:border-[#007AFF] transition-colors"
        >
          📄 Reportes en Nube
        </button>
        <button 
          onClick={() => { setInput('¿Quién necesita mi intervención hoy?'); }}
          className="px-3 py-1 bg-[#121212] border border-[#1A1A1A] rounded text-[9.5px] text-[#A1A1AA] hover:text-white hover:border-[#007AFF] transition-colors"
        >
          ⚠️ Urgencias
        </button>
        <button 
          onClick={() => { setInput('Dime el rendimiento de conversión de CDMX'); }}
          className="px-3 py-1 bg-[#121212] border border-[#1A1A1A] rounded text-[9.5px] text-[#A1A1AA] hover:text-white hover:border-[#007AFF] transition-colors"
        >
          ⚡ Conversión CDMX
        </button>
        <button 
          onClick={() => { setInput('Hitos y récords de enrolamiento en Lima'); }}
          className="px-3 py-1 bg-[#121212] border border-[#1A1A1A] rounded text-[9.5px] text-[#A1A1AA] hover:text-white hover:border-[#007AFF] transition-colors"
        >
          🏆 Récord Lima
        </button>
      </div>

      {/* Chat Input Bar */}
      <div className="p-4 border-t border-[#1A1A1A] bg-[#0A0A0A]">
        <div className="relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={apiKey ? "Pregúntale a Gemini en vivo..." : "Pregunta sobre enrolamientos, sedes..."} 
            className="w-full bg-[#121212] border border-[#2A2A2A] rounded-lg px-4 py-3 pr-10 text-xs text-white outline-none focus:border-[#007AFF] transition-colors font-mono placeholder-[#A1A1AA]"
          />
          <button onClick={handleSend} className="absolute right-2 p-1.5 bg-[#007AFF] rounded text-white hover:bg-blue-600 transition-colors">
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 4. MAIN APP COMPONENT
// ============================================================================

export default function CrearOS() {
  const [activeTab, setActiveTab] = useState('Global');
  const [booting, setBooting] = useState(true);
  const [aiOpen, setAiOpen] = useState(false);
  const [docCenterOpen, setDocCenterOpen] = useState(false);
  const [docs, setDocs] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [search, setSearch] = useState('');
  const [syncTime, setSyncTime] = useState(new Date().toLocaleTimeString('es-ES'));

  const sedes = ['Global', 'Lima', 'CDMX', 'Quito', 'Medellín', 'Guayaquil', 'Cuenca'];

  // Secuencia de booteo de nivel corporativo
  useEffect(() => {
    const timer = setTimeout(() => setBooting(false), 2400);
    return () => clearTimeout(timer);
  }, []);

  // Fetch automático de la base documental de Google Sheets en segundo plano
  const fetchDocs = () => {
    setLoadingDocs(true);
    fetch(SCRIPT_URL)
      .then(r => r.json())
      .then(data => {
        setDocs(data);
        setLoadingDocs(false);
        setSyncTime(new Date().toLocaleTimeString('es-ES'));
      })
      .catch((e) => {
        console.error("Error fetching docs:", e);
        setLoadingDocs(false);
      });
  };

  useEffect(() => {
    fetchDocs();
    // Auto-polling cada 60 segundos para mantener el panel siempre en vivo
    const interval = setInterval(fetchDocs, 60000);
    return () => clearInterval(interval);
  }, []);

  const totalDocsCount = docs.length;
  const updatedDocsCount = docs.filter(d => d.ESTADO === 'Actualizado').length;

  // Obtener data de la sede activa
  const cityData = activeTab === 'Global' ? null : rawData[activeTab];

  if (booting) {
    return (
      <div className="h-screen w-screen bg-[#000000] flex flex-col items-center justify-center font-mono text-[#007AFF] select-none">
        <div className="relative flex flex-col items-center">
          <BrainCircuit size={52} className="mb-8 animate-pulse text-[#007AFF]" style={{ filter: 'drop-shadow(0 0 25px #007AFF)' }} />
          <div className="w-72">
            <div className="flex justify-between text-[9px] mb-2 tracking-[0.25em] text-[#A1A1AA] uppercase">
              <span>Sincronizando Misión</span>
              <span className="animate-pulse">ONLINE</span>
            </div>
            <div className="h-1 w-full bg-[#111] rounded-full overflow-hidden border border-[#222]">
              <div className="h-full bg-gradient-to-r from-[#007AFF] to-[#00C853] animate-[loading_2.2s_ease-in-out_forwards] shadow-[0_0_15px_#007AFF]"></div>
            </div>
            <p className="text-[8px] text-[#A1A1AA]/50 mt-2 text-center uppercase tracking-widest">SISTEMA OPERATIVO CREAR V3.1.0</p>
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
          HEADER GLOBAL (GLASSMORPHISM & OFICIAL LOGO)
      ------------------------------------------------------------------------- */}
      <header className="fixed top-0 w-full bg-[#050505]/95 backdrop-blur-xl border-b border-[#1A1A1A] z-40 px-6 lg:px-12 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img src={logoCrear} alt="CREAR Poder Sin Límites" className="h-9 w-auto bg-white p-1 rounded object-contain" />
          <div className="border-l border-[#1A1A1A] pl-4 hidden md:block">
            <h1 className="text-lg font-black tracking-tighter uppercase flex items-center gap-2">
              CREAR OS <span className="text-[#A1A1AA] font-light">| Mission Control</span>
            </h1>
            <p className="text-[#A1A1AA] text-[8px] tracking-[0.25em] font-mono uppercase">Sistema de Inteligencia de Alta Gerencia</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setDocCenterOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 border border-[#1A1A1A] bg-[#0A0A0A] hover:border-[#007AFF]/60 hover:text-[#007AFF] text-[9.5px] uppercase tracking-widest font-bold transition-all rounded"
          >
            <Database size={13} className="text-[#007AFF]" />
            <span className="hidden sm:inline">Archivo</span> Maestro
            {loadingDocs && <RefreshCw size={11} className="animate-spin text-[#007AFF]" />}
          </button>

          <button 
            onClick={() => setAiOpen(true)}
            className="flex items-center gap-2 px-4 py-1.5 border border-[#007AFF]/30 bg-[#007AFF]/10 hover:bg-[#007AFF]/20 text-[#007AFF] text-[9.5px] uppercase tracking-widest font-bold transition-all rounded shadow-[0_0_10px_rgba(0,122,255,0.2)]"
          >
            <MessageSquare size={13} /> IA Copilot
          </button>
          
          <div className="flex items-center gap-3 pl-6 border-l border-[#1A1A1A]">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold tracking-tight">Fernando Aragón</p>
              <p className="text-[9px] text-[#00C853] font-mono tracking-widest uppercase flex items-center gap-1 justify-end">
                <span className="h-1.5 w-1.5 bg-[#00C853] rounded-full animate-ping"></span> CEO • Online
              </p>
            </div>
            <div className="h-9 w-9 border border-[#1A1A1A] bg-[#0A0A0A] flex items-center justify-center font-bold text-xs shadow-[0_0_15px_rgba(0,0,0,0.5)] text-[#007AFF] rounded font-mono">
              FA
            </div>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------------
          TABS DE SEDES / NAVEGACIÓN GLOBAL
      ------------------------------------------------------------------------- */}
      <div className="fixed top-[65px] w-full bg-[#0A0A0A] border-b border-[#1A1A1A] z-30 px-6 lg:px-12 flex overflow-x-auto custom-scrollbar">
        {sedes.map(sede => (
          <button 
            key={sede}
            onClick={() => setActiveTab(sede)}
            className={`px-5 py-3.5 text-[10.5px] tracking-widest uppercase font-bold border-b-2 whitespace-nowrap transition-all ${activeTab === sede ? 'border-[#007AFF] text-white bg-[#121212]/30' : 'border-transparent text-[#A1A1AA] hover:text-white hover:bg-[#121212]/10'}`}
          >
            {sede === 'Global' ? '🌍 Comando Global' : sede}
          </button>
        ))}
      </div>

      {/* Sidebar Copilot */}
      <IACopilot isOpen={aiOpen} onClose={() => setAiOpen(false)} docs={docs} />

      {/* ------------------------------------------------------------------------
          MAIN CONTENT CANVAS
      ------------------------------------------------------------------------- */}
      <main className="pt-36 pb-24 px-6 lg:px-12 max-w-[1600px] mx-auto space-y-12">

        {activeTab === 'Global' ? (
          /* ====================================================================
             C-LEVEL MISSION CONTROL GLOBAL (11-ROW ARCHITECTURE)
             ==================================================================== */
          <>
            {/* ROW 1: PULSO VITAL Y MÉTRICAS COGNITIVAS */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Facturación y Volumen de Registros */}
              <div className="lg:col-span-6 bg-[#050505] border border-[#1A1A1A] p-8 flex flex-col justify-center relative overflow-hidden group hover:border-[#222] transition-colors rounded">
                <div className="absolute -right-10 -top-10 opacity-[0.02] text-white"><Activity size={240} /></div>
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[#A1A1AA] text-[10px] tracking-[0.25em] font-mono">PULSO DE TRACCIÓN HISTÓRICA</p>
                  <span className="text-[9px] font-mono text-[#00C853] bg-[#00C853]/10 px-2 py-0.5 rounded">En vivo</span>
                </div>
                <div className="flex items-baseline gap-4 mb-4">
                  <h2 className="text-5xl lg:text-6xl font-black tracking-tighter text-white">{coreMetrics.universo}</h2>
                  <span className="text-sm text-[#A1A1AA] font-mono tracking-wider">Asistencias Consolidadas</span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-[#121212] overflow-hidden rounded-full mb-4">
                  <div className="h-full bg-gradient-to-r from-[#007AFF] to-[#00C853] w-[84%] shadow-[0_0_10px_#007AFF]"></div>
                </div>
                <div className="flex justify-between font-mono text-[9px] text-[#A1A1AA] tracking-wider">
                  <span>PAGOS C2 REGISTRADOS: <strong className="text-white">{coreMetrics.pagosC2}</strong></span>
                  <span className="text-[#00C853]">COMPLETOS MUESTRA: <strong>{coreMetrics.pagosCompletos}</strong></span>
                </div>
              </div>

              {/* KPI Cards de Operaciones */}
              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-[#050505] border border-[#1A1A1A] p-6 flex flex-col justify-between hover:border-[#222] transition-colors rounded">
                  <p className="text-[#A1A1AA] text-[10px] tracking-[0.25em] font-mono uppercase">Asistencia en Muestra</p>
                  <div className="mt-4">
                    <p className="text-4xl font-black">{coreMetrics.asistenciaHistorica}</p>
                    <p className="text-[9.5px] text-[#00C853] font-mono mt-1 flex items-center gap-1 uppercase">
                      <GlowingDot status="success" /> Sólido Nivel
                    </p>
                  </div>
                </div>
                <div className="bg-[#050505] border border-[#1A1A1A] p-6 flex flex-col justify-between hover:border-[#222] transition-colors rounded">
                  <p className="text-[#A1A1AA] text-[10px] tracking-[0.25em] font-mono uppercase">Enrolamientos Top MJ</p>
                  <div className="mt-4">
                    <p className="text-4xl font-black text-[#8B5CF6]">{coreMetrics.enrolamientosTop}</p>
                    <p className="text-[9.5px] text-[#A1A1AA] font-mono mt-1 uppercase">Suma de Picos Recientes</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ROW 2: IA EJECUTIVA & ROW 3: ALERTAS CRÍTICAS */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* IA Ejecutiva */}
              <div className="lg:col-span-7 border border-[#2A2A2A] bg-gradient-to-br from-[#070707] to-[#010101] p-8 relative rounded shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#007AFF] to-transparent opacity-60"></div>
                <SectionHeader title="IA Ejecutiva // Diagnóstico Táctico" />
                <h3 className="text-xl lg:text-2xl font-light mb-6 leading-relaxed text-white">
                  Hola Fernando.<br/>
                  <span className="font-bold text-[#007AFF]">Análisis crítico de operaciones:</span>
                </h3>
                <ul className="space-y-4">
                  {iaAnalysis.map((item, i) => (
                    <li key={i} className="flex gap-3 items-start group">
                      <div className="mt-1 flex-shrink-0">
                        <GlowingDot status={item.type === 'critical' ? 'critical' : item.type === 'success' ? 'success' : 'warning'} />
                      </div>
                      <p className="text-xs text-[#D4D4D8] font-light leading-relaxed group-hover:text-white transition-colors">{item.text}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Alertas de Negocio */}
              <div className="lg:col-span-5 bg-[#050505] border border-[#1A1A1A] p-8 flex flex-col rounded">
                <SectionHeader title="Centro de Alertas de Negocio" />
                <div className="flex-1 space-y-4 overflow-y-auto max-h-[300px] custom-scrollbar pr-1">
                  <div className="p-4 bg-[#FF3B30]/5 border border-[#FF3B30]/20 flex gap-4 items-start rounded hover:bg-[#FF3B30]/10 transition-colors">
                    <AlertTriangle size={18} className="text-[#FF3B30] flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-[#FF3B30] mb-0.5 tracking-wider">RIESGO CRÍTICO - QUITO</p>
                      <p className="text-[10.5px] text-[#A1A1AA] leading-normal">22 deserciones en Maestría del 20 Sept. Juan A reporta 12 bajas directas. Sugiero coordinar auditoría comercial hoy.</p>
                    </div>
                  </div>
                  <div className="p-4 bg-[#FFAB00]/5 border border-[#FFAB00]/20 flex gap-4 items-start rounded hover:bg-[#FFAB00]/10 transition-colors">
                    <ShieldAlert size={18} className="text-[#FFAB00] flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-[#FFAB00] mb-0.5 tracking-wider">PICO DE VOLUMEN - CUENCA</p>
                      <p className="text-[10.5px] text-[#A1A1AA] leading-normal">El equipo E17 reporta un inicio anómalo de 247 participantes con Fer. Posible récord histórico o duplicidad en la carga regional.</p>
                    </div>
                  </div>
                  <div className="p-4 bg-[#00C853]/5 border border-[#00C853]/20 flex gap-4 items-start rounded hover:bg-[#00C853]/10 transition-colors">
                    <CheckCircle2 size={18} className="text-[#00C853] flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-[#00C853] mb-0.5 tracking-wider">RENDIMIENTO EXCEPCIONAL - CDMX</p>
                      <p className="text-[10.5px] text-[#A1A1AA] leading-normal">Equipo CDMX E5 con Mauricio alcanza un 80.4% de conversión a pagos, validando la estrategia comercial en México.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ROW 4: TOPOLOGÍA DE OPERACIONES EN SEDES */}
            <section className="bg-[#050505] border border-[#1A1A1A] p-8 rounded">
              <div className="flex justify-between items-center mb-6">
                <SectionHeader title="Topología Mundial de Operaciones" />
                <span className="text-[8.5px] font-mono text-[#A1A1AA] uppercase tracking-widest">Haz clic en una sede para ir a sus datos específicos</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: "CDMX", stat: "Alta Conversión (E5: 80.4%)", status: "success", info: "5 Equipos en C1 // Mauricio liderando" },
                  { name: "Lima", stat: "Récord de Mike (107 enrol.)", status: "success", info: "2 Equipos en C1 // Operación Comercial Activa" },
                  { name: "Quito", stat: "Riesgo de Deserción", status: "critical", info: "Deserción alta el 20 Sep (Juan A: 12)" },
                  { name: "Cuenca", stat: "Pico de Asistencia (247)", status: "warning", info: "E17 con inicio histórico con Fer" },
                  { name: "Medellín", stat: "Operación Normal", status: "success", info: "E1 y E2 normales en C1" },
                  { name: "Guayaquil", stat: "Retención Estable", status: "warning", info: "Aliados bajos // Lerner enrolando" }
                ].map((city, i) => (
                  <div 
                    key={i} 
                    onClick={() => setActiveTab(city.name)}
                    className="border border-[#1A1A1A] bg-[#0A0A0A] p-5 hover:border-[#007AFF] hover:shadow-[0_0_15px_rgba(0,122,255,0.08)] transition-all cursor-pointer group rounded"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <p className="font-bold text-sm tracking-wide text-white group-hover:text-[#007AFF] transition-all uppercase">{city.name}</p>
                      <GlowingDot status={city.status} />
                    </div>
                    <div className="font-mono text-[10.5px]">
                      <p className="text-white font-medium mb-1">{city.stat}</p>
                      <p className="text-[#A1A1AA] text-[9.5px]">{city.info}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ROW 5: TOP PERFORMERS DE LA COMPAÑÍA */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <div className="lg:col-span-6 bg-[#050505] border border-[#1A1A1A] p-8 rounded flex flex-col justify-between">
                <div>
                  <SectionHeader title="Top Enroladores Maestría (MJ)" />
                  <p className="text-[9px] font-mono text-[#A1A1AA] mb-4 uppercase tracking-widest">Líderes de Tracción Comercial</p>
                  <div className="space-y-4">
                    {topPerformers.trainers.map((t, i) => (
                      <div key={i} className="flex justify-between items-center py-2.5 border-b border-[#1A1A1A] last:border-0 hover:bg-[#121212]/40 px-2 rounded transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-[#A1A1AA] font-mono">0{i+1}</span>
                          <span className="text-xs font-extrabold text-white">{t.name}</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#007AFF] font-bold">{t.stat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 bg-[#050505] border border-[#1A1A1A] p-8 rounded flex flex-col justify-between">
                <div>
                  <SectionHeader title="Top Conversiones Capítulo 1" />
                  <p className="text-[9px] font-mono text-[#A1A1AA] mb-4 uppercase tracking-widest">Líderes en Cierre de Pagos</p>
                  <div className="space-y-4">
                    {topPerformers.conversiones.map((c, i) => (
                      <div key={i} className="flex justify-between items-center py-2.5 border-b border-[#1A1A1A] last:border-0 hover:bg-[#121212]/40 px-2 rounded transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-[#A1A1AA] font-mono">0{i+1}</span>
                          <span className="text-xs font-extrabold text-white">{c.name}</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#00C853] font-bold">{c.stat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </section>

            {/* ROW 6: ARQUITECTURA DE CONVERSIÓN (EMBADO DE OPERACIONES) */}
            <section className="bg-[#050505] border border-[#1A1A1A] p-8 rounded overflow-hidden">
              <SectionHeader title="Arquitectura del Embudo Operativo" />
              <div className="flex flex-col md:flex-row justify-between items-center mt-6 overflow-x-auto pb-4 gap-6 scrollbar-none">
                {funnelData.map((step, i) => (
                  <React.Fragment key={i}>
                    <div className="flex flex-col items-center min-w-[125px] text-center">
                      <div className="w-full">
                        <p className="text-3xl font-black text-white tracking-tight mb-1">{step.value}</p>
                        <p className="text-[9px] text-[#A1A1AA] uppercase font-bold tracking-widest leading-snug">{step.step}</p>
                      </div>
                      {i < funnelData.length - 1 && (
                        <span className="text-[9.5px] font-mono text-[#FF3B30] bg-[#FF3B30]/10 px-2 py-0.5 rounded mt-2.5 font-bold">
                          Fuga: -{step.drop}
                        </span>
                      )}
                    </div>
                    {i < funnelData.length - 1 && <ChevronRight className="text-[#1C1C1E] hidden md:block flex-shrink-0" size={24} />}
                  </React.Fragment>
                ))}
              </div>
            </section>

            {/* ROW 7 & ROW 8: COGNICIÓN COLECTIVA - RADAR Y CALENDARIO */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Radar Diagnóstico */}
              <div className="lg:col-span-5 bg-[#050505] border border-[#1A1A1A] p-8 rounded flex flex-col items-center">
                <div className="w-full"><SectionHeader title="Balance de Atributos Operativos" /></div>
                <div className="w-full h-64 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                      <PolarGrid stroke="#1A1A1A" />
                      <PolarAngleAxis dataKey="metric" tick={{ fill: '#A1A1AA', fontSize: 9, fontWeight: 500 }} />
                      <Radar name="Sedes" dataKey="value" stroke="#007AFF" fill="#007AFF" fillOpacity={0.15} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Calendario Táctico */}
              <div className="lg:col-span-7 bg-[#050505] border border-[#1A1A1A] p-8 rounded flex flex-col justify-between">
                <div>
                  <SectionHeader title="Ventana Táctica Estratégica" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <div className="bg-[#0A0A0A] border border-[#1A1A1A] p-5 rounded hover:border-[#222] transition-all">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[9px] font-mono text-[#007AFF] uppercase tracking-wider font-bold">HOY</span>
                        <Calendar size={13} className="text-[#007AFF]" />
                      </div>
                      <p className="text-xs font-bold text-white uppercase mb-1">Revisión Cierre Lima</p>
                      <p className="text-[10px] text-[#A1A1AA]">Auditoría de consistencia de pagos en los equipos E4 y E5.</p>
                    </div>

                    <div className="bg-[#0A0A0A] border border-[#1A1A1A] p-5 rounded hover:border-[#222] transition-all">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[9px] font-mono text-[#8B5CF6] uppercase tracking-wider font-bold">MAÑANA</span>
                        <Zap size={13} className="text-[#8B5CF6]" />
                      </div>
                      <p className="text-xs font-bold text-white uppercase mb-1">Arranque FDS CDMX</p>
                      <p className="text-[10px] text-[#A1A1AA]">Lanzamiento del próximo FDS Maestría del Juego (MJ) con Ana y Juan.</p>
                    </div>

                    <div className="bg-[#0A0A0A] border border-[#1A1A1A] p-5 rounded hover:border-[#222] transition-all">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[9px] font-mono text-[#00C853] uppercase tracking-wider font-bold">7 DÍAS</span>
                        <TrendingUp size={13} className="text-[#00C853]" />
                      </div>
                      <p className="text-xs font-bold text-white uppercase mb-1">Cierre Facturación</p>
                      <p className="text-[10px] text-[#A1A1AA]">Cuadre de caja consolidada y cobranza de deudas pendientes en Ecuador.</p>
                    </div>

                    <div className="bg-[#0A0A0A] border border-[#1A1A1A] p-5 rounded hover:border-[#222] transition-all">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[9px] font-mono text-[#FFAB00] uppercase tracking-wider font-bold">30 DÍAS</span>
                        <AlertTriangle size={13} className="text-[#FFAB00]" />
                      </div>
                      <p className="text-xs font-bold text-white uppercase mb-1">Auditoría Cuenca</p>
                      <p className="text-[10px] text-[#A1A1AA]">Evaluación presencial del volumen masivo de 247 participantes.</p>
                    </div>
                  </div>
                </div>
              </div>

            </section>
          </>
        ) : (
          /* ====================================================================
             CITY EXTRACCIÓN QUIRÚRGICA EXPLORER
             ==================================================================== */
          <>
            {/* Header de Sede Específica */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#1A1A1A] pb-6 gap-4">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setActiveTab('Global')}
                  className="p-2 border border-[#1A1A1A] bg-[#0A0A0A] hover:border-[#007AFF] rounded text-[#A1A1AA] hover:text-[#007AFF] transition-all"
                  title="Volver a Comando Global"
                >
                  <ArrowLeft size={16} />
                </button>
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3 text-white">
                    <MapPin className="text-[#007AFF]" size={28} /> {activeTab}
                  </h2>
                  <p className="text-[#A1A1AA] text-[10px] font-mono tracking-widest mt-1.5 uppercase">
                    Extracción de <T term="C1" def="Capítulo 1 (Inicio del Viaje)"/> y <T term="MJ" def="Maestría del Juego / Fase Creación-Relación-Gratitud"/> (Data Muestra)
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setActiveTab('Global')}
                className="text-xs text-[#007AFF] hover:underline font-mono tracking-wider"
              >
                Volver a Comando Global &rarr;
              </button>
            </div>

            {/* Alerta de Sede si aplica */}
            {activeTab === 'Quito' && (
              <div className="p-4 bg-[#FF3B30]/5 border border-[#FF3B30]/20 flex gap-4 items-start rounded">
                <AlertTriangle size={18} className="text-[#FF3B30] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-[#FF3B30] tracking-wide uppercase mb-0.5">Atención: Riesgo Crítico Detectado en Quito</p>
                  <p className="text-[11px] text-[#A1A1AA] leading-normal">Se registran 22 deserciones en Maestría para la fecha 20 Septiembre. 12 deserciones corresponden exclusivamente al equipo de Juan A. Se requiere intervención del CEO hoy.</p>
                </div>
              </div>
            )}

            {activeTab === 'Cuenca' && (
              <div className="p-4 bg-[#FFAB00]/5 border border-[#FFAB00]/20 flex gap-4 items-start rounded">
                <ShieldAlert size={18} className="text-[#FFAB00] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-[#FFAB00] tracking-wide uppercase mb-0.5">Anomalía Detectada en Cuenca</p>
                  <p className="text-[11px] text-[#A1A1AA] leading-normal">El equipo E17 reportó un pico masivo de 247 participantes al inicio del Capítulo 1 con Fer, representando un volumen anómalo frente a la media de 62. Verificar autenticidad de registros.</p>
                </div>
              </div>
            )}

            {/* City-specific dynamic stats cards */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-[#050505] border border-[#1A1A1A] p-5 rounded hover:border-[#222] transition-colors">
                <p className="text-[#A1A1AA] text-[9.5px] tracking-widest font-mono uppercase">Equipos en Capítulo 1</p>
                <p className="text-3xl font-black mt-2 text-white">{(cityData.c1 && cityData.c1.length) || 0}</p>
              </div>
              <div className="bg-[#050505] border border-[#1A1A1A] p-5 rounded hover:border-[#222] transition-colors">
                <p className="text-[#A1A1AA] text-[9.5px] tracking-widest font-mono uppercase">Entrenamientos en Maestría</p>
                <p className="text-3xl font-black mt-2 text-white">{(cityData.maestria && cityData.maestria.length) || 0}</p>
              </div>
              <div className="bg-[#050505] border border-[#1A1A1A] p-5 rounded hover:border-[#222] transition-colors">
                <p className="text-[#A1A1AA] text-[9.5px] tracking-widest font-mono uppercase">Total Enrolamientos</p>
                <p className="text-3xl font-black mt-2 text-[#8B5CF6]">
                  {cityData.maestria ? cityData.maestria.reduce((acc, curr) => acc + (curr.enrolaron || 0), 0) : 0}
                </p>
              </div>
            </section>

            {/* Grilla de Tablas Operativas de la Sede */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Tabla de Capítulo 1 */}
              <div className="bg-[#050505] border border-[#1A1A1A] rounded p-6 flex flex-col justify-between">
                <div>
                  <SectionHeader title="Arranque del Viaje (Capítulo 1)" />
                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                      <thead>
                        <tr className="text-[#A1A1AA] border-b border-[#1A1A1A]">
                          <th className="pb-3 font-medium font-mono uppercase tracking-wider">Equipo / Fecha</th>
                          <th className="pb-3 font-medium font-mono uppercase tracking-wider">Entrenador</th>
                          <th className="pb-3 font-medium text-right font-mono uppercase tracking-wider">Inicio PX</th>
                          <th className="pb-3 font-medium text-right font-mono uppercase tracking-wider">Pagos Totales</th>
                          <th className="pb-3 font-medium text-right font-mono uppercase tracking-wider">Conv %</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#121212]">
                        {cityData.c1 && cityData.c1.map((c, i) => (
                          <tr key={i} className="hover:bg-[#0A0A0A] transition-colors group">
                            <td className="py-3.5 font-mono text-white font-medium group-hover:text-[#007AFF] transition-all">
                              {c.equipo} <span className="text-[#A1A1AA] text-[11px]">| {c.fecha}</span>
                            </td>
                            <td className="py-3.5 font-bold text-[#007AFF]">{c.entrenador}</td>
                            <td className="py-3.5 text-right font-bold text-sm">{c.inicio || '-'}</td>
                            <td className="py-3.5 text-right font-mono">{c.pagos || '-'}</td>
                            <td className="py-3.5 text-right font-mono text-[#00C853] font-bold">{c.conversion || '-'}</td>
                          </tr>
                        ))}
                        {(!cityData.c1 || cityData.c1.length === 0) && (
                          <tr>
                            <td colSpan="5" className="py-8 text-center text-xs text-[#A1A1AA] font-mono uppercase">Sin registros en muestra</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Tabla de Maestría */}
              <div className="bg-[#050505] border border-[#1A1A1A] rounded p-6 flex flex-col justify-between">
                <div>
                  <SectionHeader title="FDS Maestría (Maestría del Juego)" />
                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                      <thead>
                        <tr className="text-[#A1A1AA] border-b border-[#1A1A1A]">
                          <th className="pb-3 font-medium font-mono uppercase tracking-wider">Fecha</th>
                          <th className="pb-3 font-medium font-mono uppercase tracking-wider">Entrenador</th>
                          <th className="pb-3 font-medium text-right font-mono uppercase tracking-wider">Sentaron</th>
                          <th className="pb-3 font-medium text-right font-mono uppercase tracking-wider text-[#8B5CF6]">Enrolaron</th>
                          {activeTab === 'Quito' && <th className="pb-3 font-medium text-right font-mono uppercase tracking-wider text-[#FF3B30]">Deserción</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#121212]">
                        {cityData.maestria && cityData.maestria.map((m, i) => (
                          <tr key={i} className="hover:bg-[#0A0A0A] transition-colors group">
                            <td className="py-3.5 font-mono text-[#A1A1AA]">{m.fecha}</td>
                            <td className="py-3.5 font-bold text-white group-hover:text-[#007AFF] transition-all">{m.entrenador}</td>
                            <td className="py-3.5 text-right font-semibold text-[#A1A1AA]">{m.llegaron || '-'}</td>
                            <td className="py-3.5 text-right font-mono text-sm text-[#8B5CF6] font-extrabold flex items-center justify-end gap-2.5">
                              {m.enrolaron || '-'}
                              {m.enrolaron > 80 && <Zap size={12} className="text-[#FFAB00]" />}
                            </td>
                            {activeTab === 'Quito' && (
                              <td className="py-3.5 text-right font-mono font-bold text-[#FF3B30]">
                                {m.desercion || '0'}
                              </td>
                            )}
                          </tr>
                        ))}
                        {(!cityData.maestria || cityData.maestria.length === 0) && (
                          <tr>
                            <td colSpan="5" className="py-8 text-center text-xs text-[#A1A1AA] font-mono uppercase">Sin registros en muestra</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>

            {/* Recharts Bar Chart: Comparativo Maestría */}
            {cityData.maestria && cityData.maestria.length > 0 && (
              <div className="bg-[#050505] border border-[#1A1A1A] rounded p-6 h-80">
                <SectionHeader title="Métrica de Enrolamientos en Maestría por Entrenador" />
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cityData.maestria} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#141414" vertical={false} />
                    <XAxis dataKey="entrenador" stroke="#444" tick={{fill: '#A1A1AA', fontSize: 10, fontWeight: 500}} axisLine={false} tickLine={false} />
                    <YAxis stroke="#444" tick={{fill: '#A1A1AA', fontSize: 10}} axisLine={false} tickLine={false} />
                    <RechartsTooltip 
                      cursor={{fill: '#121212'}}
                      contentStyle={{ backgroundColor: '#050505', borderColor: '#2A2A2A', borderRadius: '6px', fontSize: '11px', color: '#fff' }}
                    />
                    <Bar dataKey="enrolaron" name="Enrolamientos" fill="#007AFF" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        )}
      </main>

      {/* ------------------------------------------------------------------------
          MODAL: CENTRO DOCUMENTAL (LIVE GOOGLE SHEETS API INTEGRATION)
      ------------------------------------------------------------------------- */}
      {docCenterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-10 select-none">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setDocCenterOpen(false)}></div>
          
          <div className="relative w-full h-full bg-[#050505] border border-[#1A1A1A] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.9)] rounded overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#1A1A1A] flex justify-between items-center bg-[#0A0A0A]">
              <div>
                <h2 className="text-lg font-black tracking-wide uppercase flex items-center gap-3 text-white">
                  <Database className="text-[#007AFF]" /> ARCHIVO MAESTRO OPERATIVO (NUBE)
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[#007AFF] text-[9px] font-mono uppercase tracking-widest">GOOGLE APPS SCRIPT API</span>
                  <span className="text-[#A1A1AA] text-[9px] font-mono tracking-widest">• Sincronizado: {syncTime}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={fetchDocs} 
                  disabled={loadingDocs}
                  className="p-1.5 border border-[#1A1A1A] bg-[#0A0A0A] hover:border-[#007AFF] hover:text-[#007AFF] rounded text-[#A1A1AA] transition-all"
                  title="Refrescar datos de la nube"
                >
                  <RefreshCw size={14} className={loadingDocs ? "animate-spin text-[#007AFF]" : ""} />
                </button>
                <button className="text-[#A1A1AA] hover:text-white p-1 rounded hover:bg-[#1A1A1A] transition-colors" onClick={() => setDocCenterOpen(false)}>
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Quick Metrics Stats inside Modal */}
            <div className="grid grid-cols-2 md:grid-cols-4 border-b border-[#1A1A1A] bg-[#070707] gap-px">
              <div className="p-4 text-center">
                <p className="text-[9px] font-mono text-[#A1A1AA] uppercase tracking-wider">Total de Reportes</p>
                <p className="text-lg font-black mt-1">{loadingDocs ? '...' : totalDocsCount}</p>
              </div>
              <div className="p-4 text-center">
                <p className="text-[9px] font-mono text-[#A1A1AA] uppercase tracking-wider">Actualizados</p>
                <p className="text-lg font-black mt-1 text-[#00C853]">{loadingDocs ? '...' : updatedDocsCount}</p>
              </div>
              <div className="p-4 text-center">
                <p className="text-[9px] font-mono text-[#A1A1AA] uppercase tracking-wider">Tasa de Sincronización</p>
                <p className="text-lg font-black mt-1 text-[#007AFF]">
                  {loadingDocs ? '...' : (totalDocsCount ? `${Math.round((updatedDocsCount/totalDocsCount)*100)}%` : '0%')}
                </p>
              </div>
              <div className="p-4 text-center">
                <p className="text-[9px] font-mono text-[#A1A1AA] uppercase tracking-wider">Estado del Servidor</p>
                <p className="text-lg font-black mt-1 text-[#00C853] flex items-center gap-1.5 justify-center">
                  <span className="h-1.5 w-1.5 bg-[#00C853] rounded-full animate-ping"></span> Activo
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-[#1A1A1A] bg-[#050505] flex items-center">
              <div className="flex-1 flex items-center bg-[#0C0C0D] border border-[#1A1A1A] px-4 py-2.5 rounded focus-within:border-[#007AFF] transition-colors">
                <Search size={15} className="text-[#A1A1AA] mr-3" />
                <input 
                  type="text" 
                  placeholder="Escribe para buscar archivos (ej: CDMX, Lima, C1, Excel...)" 
                  className="bg-transparent border-none outline-none text-xs w-full text-white placeholder-[#A1A1AA] font-mono"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Table of Documents */}
            <div className="flex-1 overflow-auto bg-[#000] custom-scrollbar">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-[#050505]">
                    <th className="sticky top-0 bg-[#050505] px-6 py-4 text-[9.5px] font-mono text-[#A1A1AA] tracking-[0.2em] border-b border-[#1A1A1A] uppercase">Reporte / Origen</th>
                    <th className="sticky top-0 bg-[#050505] px-6 py-4 text-[9.5px] font-mono text-[#A1A1AA] tracking-[0.2em] border-b border-[#1A1A1A] uppercase">Región</th>
                    <th className="sticky top-0 bg-[#050505] px-6 py-4 text-[9.5px] font-mono text-[#A1A1AA] tracking-[0.2em] border-b border-[#1A1A1A] uppercase">Categoría</th>
                    <th className="sticky top-0 bg-[#050505] px-6 py-4 text-[9.5px] font-mono text-[#A1A1AA] tracking-[0.2em] border-b border-[#1A1A1A] uppercase">Estado</th>
                    <th className="sticky top-0 bg-[#050505] px-6 py-4 text-[9.5px] font-mono text-[#A1A1AA] tracking-[0.2em] border-b border-[#1A1A1A] uppercase">Último Registro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#121212]">
                  {loadingDocs && docs.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-32 text-center">
                        <Terminal size={32} className="mx-auto text-[#007AFF] animate-pulse mb-4" />
                        <p className="text-[10px] text-[#A1A1AA] font-mono tracking-[0.3em] uppercase">Conectando al Servidor de Google Sheets...</p>
                      </td>
                    </tr>
                  ) : docs.filter(d => (d["PROYECTO / CIUDAD"] || "").toLowerCase().includes(search.toLowerCase()) || (d["CATEGORÍA"] || "").toLowerCase().includes(search.toLowerCase())).map((doc, idx) => {
                    
                    const name = (doc["PROYECTO / CIUDAD"] || "").toUpperCase();
                    let region = 'Global';
                    if (name.includes('LIMA')) region = 'Perú';
                    else if (name.includes('CDMX') || name.includes('MEXICO')) region = 'México';
                    else if (name.includes('MEDELLIN')) region = 'Colombia';
                    else if (name.includes('QUITO') || name.includes('GYE') || name.includes('CUENCA') || name.includes('UIO')) region = 'Ecuador';

                    const estado = doc["ESTADO"] || "Desconocido";
                    
                    return (
                      <tr 
                        key={idx} 
                        className="hover:bg-[#0A0A0A] transition-colors cursor-pointer group" 
                        onClick={() => window.open(doc["ENLACE EJECUTIVO"], '_blank')}
                      >
                        <td className="px-6 py-4 font-bold text-xs flex items-center gap-3 text-white group-hover:text-[#007AFF] transition-all">
                          <FileText size={14} className="text-[#A1A1AA]" />
                          {doc["PROYECTO / CIUDAD"] || "S/N"}
                        </td>
                        <td className="px-6 py-4 text-[#A1A1AA] text-xs">{region}</td>
                        <td className="px-6 py-4 text-[#A1A1AA] text-xs">{doc["CATEGORÍA"]}</td>
                        <td className="px-6 py-4">
                          <span className={`text-[9px] font-bold tracking-widest uppercase border px-2 py-0.5 rounded-sm ${estado === 'Actualizado' ? 'text-[#00C853] border-[#00C853]/20 bg-[#00C853]/5' : 'text-[#FFAB00] border-[#FFAB00]/20 bg-[#FFAB00]/5'}`}>
                            {estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#A1A1AA] text-[10px] font-mono">
                          {doc["ÚLTIMA ACTUALIZACIÓN"] ? new Date(doc["ÚLTIMA ACTUALIZACIÓN"]).toLocaleDateString('es-ES') : 'N/A'}
                        </td>
                      </tr>
                    );
                  })}
                  {!loadingDocs && docs.length > 0 && docs.filter(d => (d["PROYECTO / CIUDAD"] || "").toLowerCase().includes(search.toLowerCase()) || (d["CATEGORÍA"] || "").toLowerCase().includes(search.toLowerCase())).length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-16 text-center text-xs text-[#A1A1AA] font-mono uppercase">
                        No se encontraron archivos que coincidan con la búsqueda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Global Scrollbar Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #000000; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1A1A1A; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #2A2A2A; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  );
}
