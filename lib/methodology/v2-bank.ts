import indexDocument from "@/content/methodology/v2/index.json"
import n1Document from "@/content/methodology/v2/n1.json"
import agencias from "@/content/methodology/v2/n2/agencias.json"
import agricola from "@/content/methodology/v2/n2/agricola-pecuaria.json"
import alimentos from "@/content/methodology/v2/n2/alimentos.json"
import artes from "@/content/methodology/v2/n2/artes-graficas.json"
import automotriz from "@/content/methodology/v2/n2/automotriz.json"
import confeccion from "@/content/methodology/v2/n2/confeccion.json"
import construccion from "@/content/methodology/v2/n2/construccion.json"
import dispositivos from "@/content/methodology/v2/n2/dispositivos.json"
import educacion from "@/content/methodology/v2/n2/educacion.json"
import gastronomia from "@/content/methodology/v2/n2/gastronomia.json"
import logistica from "@/content/methodology/v2/n2/logistica.json"
import medico from "@/content/methodology/v2/n2/medico-hospitalario.json"
import metal from "@/content/methodology/v2/n2/metalmecanica.json"
import muebles from "@/content/methodology/v2/n2/muebles.json"
import plasticos from "@/content/methodology/v2/n2/plasticos.json"
import inmobiliario from "@/content/methodology/v2/n2/inmobiliario.json"
import quimica from "@/content/methodology/v2/n2/quimica.json"
import sofom from "@/content/methodology/v2/n2/sofom.json"
import textiles from "@/content/methodology/v2/n2/textiles.json"
import tics from "@/content/methodology/v2/n2/tics.json"
import turismo from "@/content/methodology/v2/n2/turismo.json"
import type { V2LevelStep } from "./v2-score"
import type { V2Question } from "./v2-types"

const documents = {
  agencias,
  "agricola-pecuaria": agricola,
  alimentos,
  "artes-graficas": artes,
  automotriz,
  confeccion,
  construccion,
  dispositivos,
  educacion,
  gastronomia,
  logistica,
  "medico-hospitalario": medico,
  metalmecanica: metal,
  muebles,
  inmobiliario,
  plasticos,
  quimica,
  sofom,
  textiles,
  tics,
  turismo,
}

export const v2Index = indexDocument
export const v2N1Questions = n1Document.questions as V2Question[]
export const v2QuestionsBySector: Record<string, V2Question[]> = Object.fromEntries(
  Object.entries(documents).map(([sectorId, document]) => [sectorId, document.questions as V2Question[]]),
)

export function v2InstrumentLabel(sectorId: string): string {
  return v2Index.instruments.find((instrument) => instrument.id === sectorId)?.label ?? sectorId
}

export function v2Roadmap(sectorId: string): V2LevelStep[] {
  const document = documents[sectorId as keyof typeof documents] as { roadmap?: V2LevelStep[] }
  return document?.roadmap ?? []
}
