import type { Metadata } from "next"
import { DiagnosticoFlow } from "@/components/diagnostico/diagnostico-flow"

export const metadata: Metadata = {
  title: "Diagnóstico sectorial | Puebla–Tlaxcala",
  description: "Nivel 1 para todas las empresas y el instrumento de Nivel 2 del sector elegido.",
}

export default function HomePage() {
  return <DiagnosticoFlow />
}
