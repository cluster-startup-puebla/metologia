import type { Metadata } from "next"
import { V2Flow } from "@/components/diagnostico/v2-flow"

export const metadata: Metadata = {
  title: "Diagnóstico sectorial | Puebla–Tlaxcala",
  description: "Instrumento general y el instrumento específico del sector. Versión 2.0.",
}

export default function HomePage() {
  return <V2Flow />
}
