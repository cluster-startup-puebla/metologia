import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const sourcePath = join(root, "docs/metodologia/ENTENDIMIENTO.md")
const outDir = join(root, "content/methodology")
const n2Dir = join(outDir, "n2")

const SECTORS = [
  ["automotriz", "MOD-AUTO-N2", "Sector 01: Industria Automotriz, Autopartes, BIW y Electrónica SDV"],
  ["agroindustria", "MOD-AGRO-N2", "Sector 02: Agroindustria, Procesamiento de Alimentos y Bebidas"],
  ["plasticos", "MOD-PLAST-N2", "Sector 03: Plásticos, Polímeros Técnicos y Envase Sustentable"],
  ["metalmecanica", "MOD-METAL-N2", "Sector 04: Metalmecánica, Maquinado CNC de Precisión y Pailería"],
  ["textil", "MOD-TEXT-N2", "Sector 05: Textil, Confección y Textiles Técnicos Industriales"],
  ["muebles", "MOD-MUEB-N2", "Sector 06: Muebles, Madera e Ingeniería RTA"],
  ["turismo", "MOD-TUR-N2", "Sector 07: Turismo, Gastronomía y Servicios de Hospitalidad"],
  ["medico-hospitalario", "MOD-MED-N2", "Sector 08: Dispositivos Médicos, Material Quirúrgico y Salud"],
  ["construccion", "MOD-CONST-N2", "Sector 09: Construcción, Prefabricados e Infraestructura"],
  ["logistica", "MOD-LOG-N2", "Sector 10: Logística, Transporte de Carga y Cadena de Suministro"],
  ["artes-graficas", "MOD-GRAF-N2", "Sector 11: Artes Gráficas, Impresión y Empaque Estructural"],
  ["tics-startups", "MOD-TIC-N2", "Sector 12: Startups, Soluciones TICs y Software (KISA / Deep Tech)"],
]

const EXPECTED = {
  agroindustria: 15,
  "artes-graficas": 15,
  automotriz: 20,
  construccion: 16,
  logistica: 16,
  "medico-hospitalario": 14,
  metalmecanica: 16,
  muebles: 16,
  plasticos: 16,
  textil: 16,
  "tics-startups": 15,
  turismo: 16,
}

function choice(value, label, score = null) {
  return { value, label, score }
}

function single(fields) {
  return {
    id: fields.id,
    sourceId: fields.sourceId,
    level: "n1",
    sectorId: null,
    block: fields.block,
    indexId: fields.indexId ?? null,
    section: fields.section,
    type: "single_select",
    sourceType: "seleccion_unica",
    title: fields.title,
    prompt: fields.prompt,
    note: fields.note ?? null,
    options: fields.options,
  }
}

function likert(fields) {
  return {
    id: fields.id,
    sourceId: fields.sourceId,
    level: "n1",
    sectorId: null,
    block: fields.block,
    indexId: fields.indexId,
    section: fields.section,
    type: "likert_7",
    title: fields.prompt,
    prompt: fields.prompt,
    note: null,
    min: 1,
    max: 7,
    minLabel: fields.minLabel,
    maxLabel: fields.maxLabel,
    scaleTo100: fields.scaleTo100,
  }
}

function n1Questions() {
  const sectorOptions = SECTORS.map(([id, , label]) => choice(id, label))
  const profile = "Módulo 0"
  const friction = "Módulo 1"
  return [
    single({
      id: "N1-01",
      sourceId: "F0.1",
      block: "perfilado",
      section: profile,
      title: "Tamaño de la empresa",
      prompt: "¿En qué estrato de tamaño y personal ocupado total se clasifica su unidad económica?",
      options: [
        choice("M1", "Microempresa: 1 a 10 colaboradores directos."),
        choice("M2", "Pequeña empresa: 11 a 50 colaboradores directos."),
        choice("M3", "Mediana empresa: 51 a 250 colaboradores directos."),
        choice("M4", "Grande empresa: más de 250 colaboradores directos."),
      ],
    }),
    single({
      id: "N1-02",
      sourceId: "F0.2",
      block: "enrutamiento",
      section: profile,
      title: "Sector económico",
      prompt: "¿En cuál de los siguientes 12 sectores económicos especializados concentra su empresa la mayor proporción de su facturación bruta anual en la región Puebla-Tlaxcala?",
      note: "Esta respuesta abre un solo instrumento de Nivel 2. No es una pantalla previa al Nivel 1.",
      options: sectorOptions,
    }),
    single({
      id: "N1-03",
      sourceId: "F0.3",
      block: "perfilado",
      section: profile,
      title: "Actividad principal",
      prompt: "¿Cuál es la actividad económica principal?",
      note: "El documento dice que esta respuesta cambia la redacción de los módulos 2, 3 y 4. Esos módulos no traen doble texto.",
      options: [
        choice("MAN", "Manufactura / producción física."),
        choice("SER", "Servicios intensivos en conocimiento (KISA)."),
      ],
    }),
    single({
      id: "N1-04",
      sourceId: "F0.4",
      block: "perfilado",
      section: profile,
      title: "Modelo de negocio",
      prompt: "¿Cuál es su modelo de negocio y canal dominante?",
      options: [
        choice("B2B", "Empresa a empresa."),
        choice("B2C", "Empresa a consumidor."),
      ],
    }),
    single({
      id: "N1-05",
      sourceId: "F0.5",
      block: "perfilado",
      section: profile,
      title: "Alcance geográfico",
      prompt: "¿Cuál es el alcance geográfico actual y la meta a 24 meses?",
      note: "El documento anuncia preguntas de aranceles que no están en el formulario.",
      options: [
        choice("LOC", "Mercado local, regional o nacional."),
        choice("EXP", "Exportación / cadenas globales."),
      ],
    }),
    single({
      id: "N1-06",
      sourceId: "D1",
      block: "fricciones",
      section: friction,
      title: "Obstáculo principal",
      prompt: "¿Cuál fue el principal obstáculo en los últimos 12 meses?",
      options: [
        choice("opt1", "Falta de demanda, pérdida de clientes o ventas insuficientes."),
        choice("opt2", "Falta de liquidez, cobro lento (60 a 120 días) o falta de crédito."),
        choice("opt3", "Escasez de técnicos u operarios, o alta rotación."),
        choice("opt4", "Maquinaria obsoleta o falta de digitalización."),
        choice("opt5", "Costo, fallas o falta de energía eléctrica o agua."),
        choice("opt6", "Inseguridad en carreteras, robo a transporte o sobrecostos de custodia."),
        choice("opt7", "Falta de certificaciones, permisos o trabas de inspección."),
        choice("opt8", "Competencia desleal de informales o importados de bajo costo."),
      ],
    }),
    single({
      id: "N1-07",
      sourceId: "D2",
      block: "fricciones",
      section: friction,
      title: "Costo del obstáculo",
      prompt: "¿Cuál fue el costo o la pérdida por ese obstáculo, como proporción de la facturación?",
      options: [
        choice("opt1", "Menos del 1% de las ventas."),
        choice("opt2", "Entre 1% y 3%."),
        choice("opt3", "Entre 3% y 5%."),
        choice("opt4", "Más del 5%."),
        choice("opt5", "Hay pérdida clara, no cuantificada contablemente."),
      ],
    }),
    single({
      id: "N1-08",
      sourceId: "D3",
      block: "fricciones",
      section: friction,
      title: "Plazo para resolverlo",
      prompt: "¿En qué plazo espera resolverlo?",
      options: [
        choice("opt1", "Menos de 3 meses."),
        choice("opt2", "Entre 3 y 12 meses."),
        choice("opt3", "Entre 1 y 2 años."),
        choice("opt4", "Problema crónico, sin plazo."),
      ],
    }),
    single({
      id: "N1-09",
      sourceId: "D4",
      block: "fricciones",
      section: friction,
      title: "Proyectos de inversión",
      prompt: "¿Qué pasó con los proyectos de inversión en los últimos 24 meses?",
      options: [
        choice("opt1", "Se ejecutaron conforme a lo planeado."),
        choice("opt2", "Se ejecutaron a menor escala o presupuesto."),
        choice("opt3", "Están detenidos por incertidumbre o liquidez."),
        choice("opt4", "Fueron cancelados."),
        choice("opt5", "No se contempló ningún proyecto."),
      ],
    }),
    single({
      id: "N1-10",
      sourceId: "D5",
      block: "fricciones",
      section: friction,
      title: "Siguiente inversión",
      prompt: "¿Qué condición activaría la siguiente inversión?",
      options: [
        choice("opt1", "Contrato u orden de compra en firme."),
        choice("opt2", "Crédito o factoraje accesible."),
        choice("opt3", "Certificación técnica indispensable para cotizar."),
        choice("opt4", "Seguridad física en traslados y certidumbre en tarifas de energía."),
        choice("opt5", "Simplificación de permisos."),
      ],
    }),
    ...[
      ["N1-11", "EN1", "Las normas fiscales, ambientales, laborales y de zonificación en mi entidad son claras, estables y permiten planear inversiones a largo plazo sin sorpresas intempestivas."],
      ["N1-12", "EN2", "El marco legal y los juzgados locales son imparciales, confiables y rápidos para hacer cumplir contratos."],
      ["N1-13", "EN3", "Los costos de seguridad (guardias, cámaras, GPS, seguros) no representan un sobrecosto excesivo."],
      ["N1-14", "EN4", "La empresa opera sin inspecciones discrecionales, clausuras arbitrarias ni pagos informales."],
      ["N1-15", "EN5", "Los trámites estatales y municipales están digitalizados y se resuelven con agilidad."],
      ["N1-16", "EN6", "El clima institucional incentiva a reinvertir utilidades aquí en lugar de mudarse."],
    ].map(([id, sourceId, prompt]) =>
      likert({
        id,
        sourceId,
        block: "entorno",
        indexId: "SEN",
        section: "Módulo 2",
        prompt,
        minLabel: "Totalmente en desacuerdo / obstáculo severo",
        maxLabel: "Totalmente de acuerdo / facilitador excelente",
        scaleTo100: "((value - 1) / 6) * 100",
      }),
    ),
    ...[
      ["N1-17", "ECO1", "Las universidades y escuelas técnicas preparan el personal que la empresa necesita y facilitan educación dual o estadías."],
      ["N1-18", "ECO2", "Hay laboratorios de prueba, metrología o plantas piloto accesibles."],
      ["N1-19", "ECO3", "Hay fondos, subsidios o estímulos fiscales disponibles para modernización o equipo."],
      ["N1-20", "ECO4", "Cámaras o clústeres generan negocio, compras consolidadas y transferencia entre asociados."],
      ["N1-21", "ECO5", "En los últimos 2 años hubo proyectos tecnológicos conjuntos con universidades o centros que mejoraron procesos o productos."],
      ["N1-22", "ECO6", "La empresa puede o quiere colaborar, contratar o comprar a emprendedores o empresas de base tecnológica local."],
    ].map(([id, sourceId, prompt]) =>
      likert({
        id,
        sourceId,
        block: "ecosistema",
        indexId: "SEI",
        section: "Módulo 3",
        prompt,
        minLabel: "Nula o inexistente",
        maxLabel: "Excelente y continua",
        scaleTo100: null,
      }),
    ),
    single({
      id: "N1-23",
      sourceId: "R01",
      block: "traccion",
      indexId: "ITC",
      section: "Módulo 4",
      title: "Barrera para cerrar ventas",
      prompt: "¿Cuál es la principal barrera para cerrar ventas?",
      note: "El documento lista cuatro textos condicionados a manufactura, servicios, B2B y B2C. No dice si se muestra uno solo. Aquí se ven los cuatro.",
      options: [
        choice("opt1", "Manufactura: no cumplir tolerancias, pruebas de laboratorio o capacidad de planta."),
        choice("opt2", "Servicios: falta de ISO 27001, experiencia demostrable o tiempos de respuesta."),
        choice("opt3", "B2B: costo y burocracia de portales de homologación."),
        choice("opt4", "B2C: costo de adquisición de clientes o saturación de canales."),
      ],
    }),
    single({
      id: "N1-24",
      sourceId: "R02",
      block: "traccion",
      indexId: "ITC",
      section: "Módulo 4",
      title: "Cotizaciones perdidas",
      prompt: "¿Qué porcentaje de cotizaciones se pierde por certificación o plazo?",
      options: [
        choice("opt1", "Menos del 5%."),
        choice("opt2", "Entre 6% y 15%."),
        choice("opt3", "Entre 16% y 30%."),
        choice("opt4", "Más del 30%."),
      ],
    }),
    single({
      id: "N1-25",
      sourceId: "R03",
      block: "traccion",
      indexId: "ITC",
      section: "Módulo 4",
      title: "Primera orden",
      prompt: "¿Cuánto tiempo pasa hasta la primera orden en firme?",
      options: [
        choice("opt1", "Menos de 1 mes."),
        choice("opt2", "De 1 a 3 meses."),
        choice("opt3", "De 4 a 6 meses."),
        choice("opt4", "Más de 6 meses."),
      ],
    }),
    single({
      id: "N1-26",
      sourceId: "R04",
      block: "traccion",
      indexId: "ITC",
      section: "Módulo 4",
      title: "Concentración de clientes",
      prompt: "¿Qué porcentaje de las ventas está en los tres principales clientes?",
      options: [
        choice("opt1", "Menos del 25%."),
        choice("opt2", "Entre 26% y 50%."),
        choice("opt3", "Entre 51% y 75%."),
        choice("opt4", "Más del 75%."),
      ],
    }),
    single({
      id: "N1-27",
      sourceId: "R05",
      block: "traccion",
      indexId: "ITC",
      section: "Módulo 4",
      title: "Base de competencia",
      prompt: "¿Sobre qué base compite la empresa?",
      options: [
        choice("opt1", "Guerra de precios."),
        choice("opt2", "Diferenciación y calidad."),
      ],
    }),
    single({
      id: "N1-28",
      sourceId: "R06",
      block: "norma",
      indexId: "IMN",
      section: "Módulo 4",
      title: "Dominio de normas",
      prompt: "¿Cuál es el dominio de las normas del mercado objetivo?",
      options: [
        choice("opt1", "Desconocimiento total."),
        choice("opt2", "Conocimiento reactivo, solo cuando un cliente condiciona la orden."),
        choice("opt3", "Dominio proactivo, con auditorías internas."),
      ],
    }),
    single({
      id: "N1-29",
      sourceId: "R07",
      block: "norma",
      indexId: "IMN",
      section: "Módulo 4",
      title: "Certificaciones",
      prompt: "¿Cuál es el estatus de las certificaciones de tercera parte?",
      options: [
        choice("opt1", "Certificaciones vigentes."),
        choice("opt2", "En proceso, avance superior al 50%."),
        choice("opt3", "Calidad empírica, sin certificado oficial."),
        choice("opt4", "Sin certificación y sin capacidad de costearla."),
      ],
    }),
    single({
      id: "N1-30",
      sourceId: "R08",
      block: "norma",
      indexId: "IMN",
      section: "Módulo 4",
      title: "Trazabilidad",
      prompt: "¿Cómo es la trazabilidad del origen de insumos?",
      options: [
        choice("opt1", "Automatizada (ERP / código de barras)."),
        choice("opt2", "Documental o manual."),
        choice("opt3", "Débil o nula."),
      ],
    }),
    single({
      id: "N1-31",
      sourceId: "R09",
      block: "norma",
      indexId: "IMN",
      section: "Módulo 4",
      title: "Insumos importados",
      prompt: "¿Cuál es la dependencia de insumos importados?",
      options: [
        choice("opt1", "Sin vulnerabilidad: insumos locales y proveedores diversificados."),
        choice("opt2", "Moderada: 1 o 2 insumos importados con sustituto nacional."),
        choice("opt3", "Crítica: un freno en aduana detiene la empresa."),
      ],
    }),
    single({
      id: "N1-32",
      sourceId: "R10",
      block: "norma",
      indexId: "IMN",
      section: "Módulo 4",
      title: "Apoyo de cumplimiento",
      prompt: "¿Dónde rendiría más un apoyo de cumplimiento?",
      options: [
        choice("opt1", "Pruebas de laboratorio y ensayos."),
        choice("opt2", "Consultoría en planta para no conformidades y auditorías."),
        choice("opt3", "Marcas, patentes o códigos de barras en el mercado destino."),
        choice("opt4", "Capacitación en sustentabilidad, huella de carbono y ESG."),
      ],
    }),
    single({
      id: "N1-33",
      sourceId: "R11",
      block: "absorcion",
      indexId: "ICA",
      section: "Módulo 4",
      title: "Capacidad de volumen",
      prompt: "Si un cliente ofrece duplicar el volumen en 90 días, ¿qué pasaría?",
      options: [
        choice("opt1", "Aceptación inmediata: hay capacidad ociosa."),
        choice("opt2", "Aceptación con ajustes: subcontrato u horas extra."),
        choice("opt3", "Rechazo: la planta está al 100%."),
      ],
    }),
    single({
      id: "N1-34",
      sourceId: "R12",
      block: "absorcion",
      indexId: "ICA",
      section: "Módulo 4",
      title: "Digitalización",
      prompt: "¿Cómo está digitalizada la operación?",
      options: [
        choice("opt1", "ERP/CRM en la nube, EDI y pagos SPEI."),
        choice("opt2", "Software en silos, desconectado de planta y de clientes."),
        choice("opt3", "Control en hojas de cálculo o papel."),
      ],
    }),
    single({
      id: "N1-35",
      sourceId: "R13",
      block: "absorcion",
      indexId: "ICA",
      section: "Módulo 4",
      title: "Talento",
      prompt: "¿Dónde está la escasez de talento?",
      options: [
        choice("opt1", "Sin problema."),
        choice("opt2", "Operadores técnicos y maquinistas."),
        choice("opt3", "Automatización y datos."),
        choice("opt4", "Ventas técnicas y comercio exterior."),
      ],
    }),
    single({
      id: "N1-36",
      sourceId: "R14",
      block: "absorcion",
      indexId: "ICA",
      section: "Módulo 4",
      title: "Barrera financiera",
      prompt: "¿Cuál es la barrera financiera para contratos mayores?",
      options: [
        choice("opt1", "Ninguna: hay flujo o líneas bancarias."),
        choice("opt2", "Falta de factoraje para plazos de 60 a 120 días."),
        choice("opt3", "Falta de garantías colaterales."),
        choice("opt4", "Tasas de interés que hacen inviable el equipo."),
      ],
    }),
    single({
      id: "N1-37",
      sourceId: "R15",
      block: "absorcion",
      indexId: "ICA",
      section: "Módulo 4",
      title: "Salto a 6 meses",
      prompt: "¿Cuál sería el proyecto de mayor salto en 6 meses?",
      options: [
        choice("opt1", "ERP/CRM modular."),
        choice("opt2", "Lean manufacturing."),
        choice("opt3", "Cerrar la auditoría de la certificación indispensable."),
        choice("opt4", "Encuentro de negocios con compradores ancla."),
      ],
    }),
    ...[
      ["N1-38", "COL1", "Compras conjuntas y fletes consolidados."],
      ["N1-39", "COL2", "Cuota para un laboratorio, centro de maquinado o sala limpia compartida."],
      ["N1-40", "COL3", "Sustituir compra de maquinaria o licencias por pago por uso."],
      ["N1-41", "COL4", "Sumar capacidad a una marca o consorcio para contratos que no puede surtir sola."],
      ["N1-42", "COL5", "Operar eso bajo fideicomiso neutral con mediación de universidades o clústeres."],
    ].map(([id, sourceId, prompt]) =>
      likert({
        id,
        sourceId,
        block: "colaboracion",
        indexId: "IPC",
        section: "Módulo 5",
        prompt,
        minLabel: "Rechazo total / desconfianza absoluta",
        maxLabel: "Totalmente dispuesto / prioridad estratégica",
        scaleTo100: null,
      }),
    ),
    ...[
      ["N1-43", "EXP1", "Tiene identificados productos más complejos fabricables en menos de 12 meses con la maquinaria actual."],
      ["N1-44", "EXP2", "Si hubiera financiamiento y laboratorios, podría reconvertirse a industrias de alta tecnología."],
      ["N1-45", "EXP3", "Tiene estrategia para vender en mercados internacionales o e-commerce transfronterizo."],
      ["N1-46", "EXP4", "Tiene estados financieros auditados y gobierno corporativo listos para capital privado o coinversión extranjera."],
    ].map(([id, sourceId, prompt]) =>
      likert({
        id,
        sourceId,
        block: "expansion",
        indexId: "IPC",
        section: "Módulo 6",
        prompt,
        minLabel: "Sin capacidad / totalmente descartado",
        maxLabel: "Totalmente preparado / estrategia diseñada",
        scaleTo100: null,
      }),
    ),
  ]
}

function field(body, name) {
  const match = body.match(new RegExp(`^- ${name}: (.*)$`, "m"))
  return match ? match[1].trim() : null
}

function listItems(body, heading) {
  const marker = `- ${heading}:`
  const start = body.indexOf(marker)
  if (start < 0) return []
  const lines = body.slice(start).split("\n").slice(1)
  const items = []
  for (const line of lines) {
    if (line.startsWith("- ") || line.startsWith("####") || line.startsWith("###")) break
    const match = line.match(/^ {2}(\d+)\. (.*)$/)
    if (match) items.push(match[2])
    else if (line.trim() && items.length > 0) items[items.length - 1] += ` ${line.trim()}`
  }
  return items
}

function parseScoreToken(token) {
  if (token === "null") return { score: null, code: null }
  const points = token.match(/^(\d+(?:\.\d+)?) pts?$/)
  if (points) return { score: Number(points[1]), code: null }
  return { score: null, code: token }
}

function parseChoice(raw, index) {
  const match = raw.match(/^`([^`]*)` — (.*)$/)
  if (!match) throw new Error(`Opción ilegible: ${raw}`)
  const parsed = parseScoreToken(match[1])
  return {
    value: parsed.code ?? `opt${index + 1}`,
    label: match[2].trim(),
    score: parsed.score,
  }
}

function parseN2(markdown) {
  const start = markdown.indexOf("## E.2 ")
  const end = markdown.indexOf("\n## F. ")
  if (start < 0 || end < 0) throw new Error("No se encontró la sección E.2")
  const section = markdown.slice(start, end)
  const chunks = section.split(/\n(?=### Sector )/).slice(1)
  const bySector = {}

  for (const chunk of chunks) {
    const header = chunk.match(/^### Sector ([a-z0-9-]+) \(`([A-Z]+)`\) — (\d+) reactivos/)
    if (!header) throw new Error(chunk.slice(0, 120))
    const sectorId = header[1]
    const expected = Number(header[3])
    const parts = chunk.split(/\n(?=#### )/)
    const questions = parts.slice(1).map((part) => parseQuestion(part, sectorId))
    if (questions.length !== expected) {
      throw new Error(`${sectorId}: se leyeron ${questions.length}, el encabezado dice ${expected}`)
    }
    if (questions.length !== EXPECTED[sectorId]) {
      throw new Error(`${sectorId}: conteo inesperado ${questions.length}`)
    }
    bySector[sectorId] = questions
  }

  const missing = Object.keys(EXPECTED).filter((id) => !bySector[id])
  if (missing.length > 0) throw new Error(`Faltan sectores: ${missing.join(", ")}`)
  return bySector
}

function parseQuestion(part, sectorId) {
  const header = part.match(/^#### (N2-[A-Z]+-\d+) · `([^`]+)`/)
  if (!header) throw new Error(part.slice(0, 80))
  const tipo = field(part, "Tipo")?.replaceAll("`", "")
  const title = field(part, "Enunciado")
  const prompt = field(part, "Pregunta") ?? title
  const section = field(part, "Sección de origen") ?? ""
  const block = field(part, "Bloque")
  if (!tipo || !title || !block) throw new Error(`Ficha incompleta ${header[1]}`)

  const base = {
    id: header[1],
    sourceId: header[2],
    level: "n2",
    sectorId,
    block: block.replaceAll("`", ""),
    indexId: null,
    section,
    title,
    prompt,
    note: null,
  }

  if (tipo.startsWith("ranking_borda")) {
    const count = Number(tipo.match(/N = (\d+)/)?.[1])
    const factors = listItems(part, "Factores o casillas").map((label, index) => ({
      id: `f${index + 1}`,
      label,
    }))
    if (factors.length !== count) {
      throw new Error(`${header[1]}: N=${count} pero hay ${factors.length} factores`)
    }
    return {
      ...base,
      type: "rank",
      sourceType: tipo,
      factorCount: count,
      rankDirection: "1_is_max_pain",
      factors,
      costCapture: { unit: "MXN", entersScore: false },
    }
  }

  const rawOptions = tipo.includes("checkbox")
    ? listItems(part, "Factores o casillas")
    : listItems(part, "Opciones")
  if (rawOptions.length < 2) throw new Error(`${header[1]} sin opciones`)
  return {
    ...base,
    type: "single_select",
    sourceType: tipo,
    options: rawOptions.map((raw, index) =>
      tipo.includes("checkbox")
        ? { value: `opt${index + 1}`, label: raw, score: null }
        : parseChoice(raw, index),
    ),
  }
}

const markdown = readFileSync(sourcePath, "utf8")
const n2 = parseN2(markdown)
const n1 = n1Questions()
if (n1.length !== 46) throw new Error(`Nivel 1 tiene ${n1.length} reactivos`)

mkdirSync(n2Dir, { recursive: true })
writeFileSync(join(outDir, "n1.json"), JSON.stringify({ questions: n1 }, null, 2))

const sectorMeta = SECTORS.map(([id, moduleCode, label]) => {
  writeFileSync(join(n2Dir, `${id}.json`), JSON.stringify({ sectorId: id, moduleCode, questions: n2[id] }, null, 2))
  return {
    id,
    moduleCode,
    label,
    questionCount: n2[id].length,
    file: `n2/${id}.json`,
  }
})

const n2Count = sectorMeta.reduce((sum, sector) => sum + sector.questionCount, 0)
writeFileSync(
  join(outDir, "index.json"),
  JSON.stringify(
    {
      instrumentVersion: "n1-web-3.0",
      region: "puebla-tlaxcala",
      generatedFrom: "docs/metodologia/ENTENDIMIENTO.md",
      applicationModel: {
        everyoneSees: "n1",
        sectorChoiceQuestionId: "N1-02",
        sectorChoiceSourceId: "F0.2",
        thenAsk: "exactlyOneN2",
        n1AndN2CombinedIndex: null,
      },
      counts: { n1: n1.length, n2: n2Count },
      sectors: sectorMeta,
    },
    null,
    2,
  ),
)

console.log(`n1=${n1.length} n2=${n2Count} sectores=${sectorMeta.length}`)
