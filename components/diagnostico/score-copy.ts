import type { ScoreResult } from "@/lib/methodology/types"

export function formatScore(value: number): string {
  return new Intl.NumberFormat("es-MX", { maximumFractionDigits: 2 }).format(value)
}

export function explainScore(result: ScoreResult<unknown>): string {
  if (result.status === "ok") return ""
  const codes = result.failures.map((failure) => failure.code)
  if (codes.includes("no_numeric_questions")) {
    return "Este conjunto no trae puntaje en las opciones. Agroindustria y logística están así en todo el instrumento."
  }
  if (codes.includes("empty_answer")) {
    const missing = codes.filter((code) => code === "empty_answer").length
    return `Faltan ${missing} respuestas. El documento no dice que se imputen ceros, así que el cálculo se detiene.`
  }
  if (codes.includes("incomplete")) return "Falta alguno de los seis reactivos del entorno."
  if (codes.includes("invalid_likert")) return "Hay una respuesta fuera de la escala 1 a 7."
  return "El cálculo se detiene con los datos que hay."
}
