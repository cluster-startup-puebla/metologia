export type SessionId = "n1" | "n2" | "score"

export interface SessionTheme {
  id: SessionId
  name: string
  detail: string
  color: string
  ink: string
}

export const SESSIONS: SessionTheme[] = [
  { id: "n1", name: "Nivel 1", detail: "Común a todas las empresas", color: "#FF1493", ink: "#ffffff" },
  { id: "n2", name: "Nivel 2", detail: "Instrumento del sector", color: "#0E8A90", ink: "#ffffff" },
  { id: "score", name: "Nivel 3", detail: "Calificación", color: "#9B59B6", ink: "#ffffff" },
]

export function sessionById(id: SessionId): SessionTheme {
  return SESSIONS.find((session) => session.id === id) ?? SESSIONS[0]
}

export function sessionForLevel(level: "n1" | "n2"): SessionTheme {
  return sessionById(level)
}
