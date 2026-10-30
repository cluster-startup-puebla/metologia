import { SESSIONS, type SessionId } from "./session-theme"

interface SessionTrailProps {
  activeId: SessionId
  progress: number
}

export function SessionTrail({ activeId, progress }: SessionTrailProps) {
  const activeIndex = SESSIONS.findIndex((session) => session.id === activeId)
  const active = SESSIONS[activeIndex] ?? SESSIONS[0]
  const width = Math.min(100, Math.max(0, progress))

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {SESSIONS.map((session, index) => {
          const reached = index <= activeIndex
          const current = session.id === activeId
          return (
            <div key={session.id} className="flex min-w-0 items-center gap-2">
              <span
                className="flex items-center gap-1.5 text-xs font-semibold"
                style={{ color: reached ? session.color : "#9CA3AF" }}
              >
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{
                    backgroundColor: reached ? session.color : "#E5E7EB",
                    transform: current ? "scale(1.35)" : undefined,
                  }}
                />
                {session.name}
              </span>
              {index < SESSIONS.length - 1 ? <span className="h-px w-4 shrink-0 bg-border" /> : null}
            </div>
          )
        })}
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${width}%`, backgroundColor: active.color }} />
      </div>
    </div>
  )
}
