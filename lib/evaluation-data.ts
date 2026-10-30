// Batería de Evaluación - Datos y configuración

export interface Question {
  id: number
  text: string
  type: 'single' | 'priority'
  options?: { key: string; label: string }[]
  priorityOptions?: { key: string; label: string }[]
}

export interface Section {
  id: string
  name: string
  title: string
  subtitle: string
  color: string
  questions: Question[]
}

export const ANSWER_POINTS: Record<string, number> = {
  a: 1,
  b: 2,
  c: 4,
  d: 6,
}

export const PRIORITY_SEVERITY: Record<string, number> = {
  falta_materiales: 6,
  fallas_mecanicas: 4,
  personal: 2,
  set_ups_lentos: 1,
}

export const SECTION_RANGES: Record<string, [number, number, string][]> = {
  infraestructura: [
    [4, 10, 'Bronce'],
    [11, 18, 'Plata'],
    [19, 24, 'Oro'],
  ],
  equipo_productivo: [
    [3, 7, 'Bronce'],
    [8, 13, 'Plata'],
    [14, 18, 'Oro'],
  ],
  financiera: [
    [3, 7, 'Bronce'],
    [8, 13, 'Plata'],
    [14, 18, 'Oro'],
  ],
  operacion: [
    [8, 19, 'Bronce'],
    [20, 35, 'Plata'],
    [36, 48, 'Oro'],
  ],
}

export const INTEGRAL_RANGES: [number, number, string][] = [
  [18, 45, 'Bronce'],
  [46, 85, 'Plata'],
  [86, 108, 'Oro'],
]

export const SECTION_PROFILES: Record<string, { riesgo: string; reto: string }> = {
  'infraestructura-Bronce': {
    riesgo: 'Información en papel y silos manuales.',
    reto: 'Centralización de datos y respaldos básicos.',
  },
  'infraestructura-Plata': {
    riesgo: 'Uso de software aislado sin integración.',
    reto: 'Migración a la nube y flujo de datos interdepartamental.',
  },
  'infraestructura-Oro': {
    riesgo: 'Infraestructura lista para industria integrada.',
    reto: 'Interoperabilidad total y ciberseguridad avanzada.',
  },
  'equipo_productivo-Bronce': {
    riesgo: 'Maquinaria antigua y paros frecuentes.',
    reto: 'Implementar mantenimiento preventivo digital básico.',
  },
  'equipo_productivo-Plata': {
    riesgo: 'Capacidad de conexión no aprovechada.',
    reto: 'Extracción de datos de rendimiento (OEE) y monitoreo técnico.',
  },
  'equipo_productivo-Oro': {
    riesgo: 'Planta inteligente con baja tasa de falla.',
    reto: 'Integración de mantenimiento predictivo mediante sensores e IA.',
  },
  'financiera-Bronce': {
    riesgo: 'Desconocimiento de costos reales y riesgos fiscales.',
    reto: 'Consultoría de supervivencia contable y costeo inicial.',
  },
  'financiera-Plata': {
    riesgo: 'Cierre mensual lento y asincronía contable.',
    reto: 'Integración fiscal-operativa y estados financieros en tiempo real.',
  },
  'financiera-Oro': {
    riesgo: 'Transparencia financiera total.',
    reto: 'Modelos de rentabilidad predictiva y planeación fiscal estratégica.',
  },
  'operacion-Bronce': {
    riesgo: 'Desperdicio alto y falta de trazabilidad.',
    reto: 'Orden operativo, documentación de procesos y control de mermas.',
  },
  'operacion-Plata': {
    riesgo: 'Cuellos de botella por mala comunicación.',
    reto: 'Digitalización de hojas de ingeniería y control de calidad estadístico.',
  },
  'operacion-Oro': {
    riesgo: 'Excelencia en operación y trazabilidad.',
    reto: 'Optimización de cadena de valor ampliada y visibilidad total de proveedores.',
  },
}

export const INTEGRAL_PROFILES: Record<string, { riesgo: string; reto: string }> = {
  Bronce: {
    riesgo: 'Empresa con alto riesgo operativo.',
    reto: 'Digitalización básica, orden administrativo y consultoría de supervivencia contable.',
  },
  Plata: {
    riesgo: 'Uso de herramientas aisladas.',
    reto: 'ERP integral, integración de costos de producción y consultoría en optimización de flujos.',
  },
  Oro: {
    riesgo: 'Cerca de Industria 4.0.',
    reto: 'Business Intelligence, mantenimiento predictivo y consultoría financiera avanzada para expansión.',
  },
}

export const SECTIONS: Section[] = [
  {
    id: 'infraestructura',
    name: 'Infraestructura y digitalización',
    title: 'Infraestructura',
    subtitle: 'Digitalización',
    color: '#FF1493', // Rosa mexicano neon
    questions: [
      {
        id: 1,
        text: '¿Cómo se capturan actualmente los datos de producción?',
        type: 'single',
        options: [
          { key: 'a', label: 'Papel/Bitácoras' },
          { key: 'b', label: 'Excel al final de turno' },
          { key: 'c', label: 'Terminales digitales' },
          { key: 'd', label: 'Sistemas automatizados/IoT' },
        ],
      },
      {
        id: 2,
        text: '¿Cuál es la principal herramienta para la planeación de recursos y finanzas?',
        type: 'single',
        options: [
          { key: 'a', label: 'Registro manual' },
          { key: 'b', label: 'Documentos digitales independientes' },
          { key: 'c', label: 'Software contable básico' },
          { key: 'd', label: 'ERP integral' },
        ],
      },
      {
        id: 3,
        text: '¿Cómo gestiona el intercambio de información con proveedores/clientes?',
        type: 'single',
        options: [
          { key: 'a', label: 'Teléfono/Presencial' },
          { key: 'b', label: 'Correo manual' },
          { key: 'c', label: 'Portales nube' },
          { key: 'd', label: 'Integración EDI/API/MRP' },
        ],
      },
      {
        id: 4,
        text: '¿Qué porcentaje de procesos de gestión de su empresa están en la nube o con respaldo automático?',
        type: 'single',
        options: [
          { key: 'a', label: '0%' },
          { key: 'b', label: 'Menos del 50%' },
          { key: 'c', label: 'Más del 80%' },
          { key: 'd', label: '100% (Paperless)' },
        ],
      },
    ],
  },
  {
    id: 'equipo_productivo',
    name: 'Situación del equipo productivo',
    title: 'Equipo',
    subtitle: 'Productivo',
    color: '#00CED1', // Turquesa neon
    questions: [
      {
        id: 5,
        text: '¿Cuál es la antigüedad promedio de su maquinaria y equipo principal?',
        type: 'single',
        options: [
          { key: 'a', label: '>20 años' },
          { key: 'b', label: '10-20 años' },
          { key: 'c', label: '5-10 años' },
          { key: 'd', label: '<5 años' },
        ],
      },
      {
        id: 6,
        text: '¿Cómo se realiza el mantenimiento de sus equipos productivos?',
        type: 'single',
        options: [
          { key: 'a', label: 'Correctivo' },
          { key: 'b', label: 'Preventivo manual' },
          { key: 'c', label: 'Basado en uso (Software)' },
          { key: 'd', label: 'Predictivo (Sensores)' },
        ],
      },
      {
        id: 7,
        text: '¿Su maquinaria tiene capacidad de conectarse a red para recolección de datos?',
        type: 'single',
        options: [
          { key: 'a', label: 'No, opera aislada' },
          { key: 'b', label: 'Requiere instalación sensores' },
          { key: 'c', label: 'Sí, pero no se usan' },
          { key: 'd', label: 'Sí, tiene monitoreo activo' },
        ],
      },
    ],
  },
  {
    id: 'financiera',
    name: 'Gestión financiera y costos',
    title: 'Gestión',
    subtitle: 'Financiera',
    color: '#9B59B6', // Púrpura neon
    questions: [
      {
        id: 8,
        text: '¿Con qué precisión conoce el costo unitario real de sus productos?',
        type: 'single',
        options: [
          { key: 'a', label: 'Basado en estimación/Experiencia' },
          { key: 'b', label: 'Por prorrateo global' },
          { key: 'c', label: 'Por orden de producción' },
          { key: 'd', label: 'En tiempo real/Trazable' },
        ],
      },
      {
        id: 9,
        text: '¿Cuánto tiempo le toma al área financiera generar estados financieros?',
        type: 'single',
        options: [
          { key: 'a', label: '>15 días' },
          { key: 'b', label: '7-15 días' },
          { key: 'c', label: '<7 días' },
          { key: 'd', label: 'Al día (Cierre continuo)' },
        ],
      },
      {
        id: 10,
        text: '¿Cómo es el cumplimiento de requisitos fiscales (SAT) en sus procesos?',
        type: 'single',
        options: [
          { key: 'a', label: 'Externo desfasado' },
          { key: 'b', label: 'Manual en portal SAT' },
          { key: 'c', label: 'Integrado a ventas' },
          { key: 'd', label: 'Automatizado y vinculado a almacén' },
        ],
      },
    ],
  },
  {
    id: 'operacion',
    name: 'Operación, paros y calidad',
    title: 'Operación',
    subtitle: 'y Calidad',
    color: '#FF6B35', // Naranja neon
    questions: [
      {
        id: 11,
        text: '¿Cuál es el problema más recurrente en su cadena de suministro?',
        type: 'single',
        options: [
          { key: 'a', label: 'Desabasto' },
          { key: 'b', label: 'Exceso stock' },
          { key: 'c', label: 'Diferencias registro físico vs sistema' },
          { key: 'd', label: 'Costos logísticos altos' },
        ],
      },
      {
        id: 12,
        text: '¿Qué tan frecuentes son los retrabajos o rechazos por falta de información?',
        type: 'single',
        options: [
          { key: 'a', label: 'Muy frecuentes (diarios)' },
          { key: 'b', label: 'Ocasionales' },
          { key: 'c', label: 'Raros' },
          { key: 'd', label: 'Evitados por sistema' },
        ],
      },
      {
        id: 13,
        text: '¿Cuál es la mayor barrera para modernizar su empresa?',
        type: 'single',
        options: [
          { key: 'a', label: 'Resistencia al cambio' },
          { key: 'b', label: 'Presupuesto/Costo' },
          { key: 'c', label: 'Complejidad técnica' },
          { key: 'd', label: 'Malas experiencias previas' },
        ],
      },
      {
        id: 14,
        text: '¿Cómo se comunican los objetivos de producción al equipo operativo?',
        type: 'single',
        options: [
          { key: 'a', label: 'De palabra' },
          { key: 'b', label: 'Pizarrones físicos' },
          { key: 'c', label: 'Reportes impresos' },
          { key: 'd', label: 'Tableros digitales en tiempo real' },
        ],
      },
      {
        id: 15,
        text: '¿Qué nivel de trazabilidad tiene sobre un lote de producto terminado?',
        type: 'single',
        options: [
          { key: 'a', label: 'Nula' },
          { key: 'b', label: 'Parcial manual' },
          { key: 'c', label: 'Alta en sistema' },
          { key: 'd', label: 'Total desde proveedor' },
        ],
      },
      {
        id: 16,
        text: 'Principal causa de paros no programados (ordena de mayor a menor impacto)',
        type: 'priority',
        priorityOptions: [
          { key: 'falta_materiales', label: 'Falta de materiales' },
          { key: 'fallas_mecanicas', label: 'Fallas mecánicas' },
          { key: 'personal', label: 'Personal' },
          { key: 'set_ups_lentos', label: 'Set-ups lentos' },
        ],
      },
      {
        id: 17,
        text: '¿Cuál es su mayor cuello de botella para la liberación de calidad?',
        type: 'single',
        options: [
          { key: 'a', label: 'No hay muestreo estadístico' },
          { key: 'b', label: 'Datos aislados en papel' },
          { key: 'c', label: 'Criterios subjetivos' },
          { key: 'd', label: 'Falta trazabilidad de rechazo' },
        ],
      },
      {
        id: 18,
        text: '¿Cómo fluye la información técnica (planos/fórmulas) al operador?',
        type: 'single',
        options: [
          { key: 'a', label: 'Memoria/Experiencia' },
          { key: 'b', label: 'Carpeta física' },
          { key: 'c', label: 'Consulta en oficina' },
          { key: 'd', label: 'Tablero digital en estación' },
        ],
      },
    ],
  },
]

export const TOTAL_QUESTIONS = SECTIONS.reduce((acc, s) => acc + s.questions.length, 0)
