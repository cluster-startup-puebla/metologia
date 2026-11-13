import type { Metadata } from "next"
import { V2Flow } from "@/components/diagnostico/v2-flow"

export const metadata: Metadata = {
  title: "Diagnóstico v2 | Puebla–Tlaxcala",
  description: "Instrumento 1 común y el instrumento 2 del sector. Todavía sin calificación.",
}

export default function V2Page() {
  return <V2Flow />
}
