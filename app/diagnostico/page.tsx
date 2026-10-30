import type { Metadata } from "next"
import { DiagnosticoFlow } from "@/components/diagnostico/diagnostico-flow"

export const metadata: Metadata = {
  title: "Diagnóstico sectorial | Puebla–Tlaxcala",
  description: "Prueba del Nivel 1 y del instrumento de Nivel 2, con el cálculo que los documentos sí definen.",
}

export default function DiagnosticoPage() {
  return <DiagnosticoFlow />
}
