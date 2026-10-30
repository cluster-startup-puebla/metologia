import indexDocument from "@/content/methodology/index.json"
import n1Document from "@/content/methodology/n1.json"
import rulesDocument from "@/content/methodology/rules.json"
import agroindustria from "@/content/methodology/n2/agroindustria.json"
import artesGraficas from "@/content/methodology/n2/artes-graficas.json"
import automotriz from "@/content/methodology/n2/automotriz.json"
import construccion from "@/content/methodology/n2/construccion.json"
import logistica from "@/content/methodology/n2/logistica.json"
import medico from "@/content/methodology/n2/medico-hospitalario.json"
import metalmecanica from "@/content/methodology/n2/metalmecanica.json"
import muebles from "@/content/methodology/n2/muebles.json"
import plasticos from "@/content/methodology/n2/plasticos.json"
import textil from "@/content/methodology/n2/textil.json"
import tics from "@/content/methodology/n2/tics-startups.json"
import turismo from "@/content/methodology/n2/turismo.json"
import type { MethodologyRules, Question } from "./types.ts"

const n2Documents = {
  agroindustria,
  "artes-graficas": artesGraficas,
  automotriz,
  construccion,
  logistica,
  "medico-hospitalario": medico,
  metalmecanica,
  muebles,
  plasticos,
  textil,
  "tics-startups": tics,
  turismo,
} as const

export const methodologyRules = rulesDocument as MethodologyRules
export const n1Questions = n1Document.questions as Question[]
export const sectorCatalog = indexDocument.sectors
export const questionsBySector: Record<string, Question[]> = Object.fromEntries(
  Object.entries(n2Documents).map(([sectorId, document]) => [sectorId, document.questions as Question[]]),
)

export function sectorLabel(sectorId: string | null): string {
  if (!sectorId) return "Sin sector"
  return sectorCatalog.find((sector) => sector.id === sectorId)?.label ?? sectorId
}
