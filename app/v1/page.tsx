import type { Metadata } from "next"
import { DiagnosticoFlow } from "@/components/diagnostico/diagnostico-flow"

export const metadata: Metadata = {
  title: "Diagnóstico sectorial, versión anterior | Puebla–Tlaxcala",
  description: "Nivel 1 para todas las empresas y el instrumento de Nivel 2 del sector elegido.",
}

export default function V1Page() {
  return <DiagnosticoFlow />
}
