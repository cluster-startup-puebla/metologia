import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Microcopy } from "./microcopy"
import { SessionTrail, type TrailStep } from "./session-trail"
import type { SessionTheme } from "./session-theme"

interface QuestionFrameProps {
  session: SessionTheme
  progress: number
  stepLabel: string
  blockLabel: string
  title: string
  prompt: string
  note: string | null
  canContinue: boolean
  continueLabel: string
  onBack: () => void
  onContinue: () => void
  banner?: ReactNode
  titleColor?: string
  /** When set, this is the only line above the question. */
  kicker?: string
  /** Opposite end of the kicker, such as 1/6. */
  kickerMeta?: string
  trailSteps?: TrailStep[]
  children: ReactNode
}

export function QuestionFrame({
  session,
  progress,
  stepLabel,
  blockLabel,
  title,
  prompt,
  note,
  canContinue,
  continueLabel,
  onBack,
  onContinue,
  banner,
  titleColor,
  kicker,
  kickerMeta,
  trailSteps,
  children,
}: QuestionFrameProps) {
  return (
    <div className="min-h-screen bg-background">
      {banner}
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 pt-4 pb-28 sm:gap-5 sm:pt-6">
        <SessionTrail activeId={session.id} progress={progress} steps={trailSteps} />
        <div className="space-y-2">
          {kicker ? (
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm font-medium" style={{ color: titleColor }}>
                {kicker}
              </p>
              {kickerMeta ? <p className="shrink-0 text-sm tabular-nums text-muted-foreground">{kickerMeta}</p> : null}
            </div>
          ) : (
            <>
              <p className="text-xs text-muted-foreground">{stepLabel}</p>
              <p className="text-xs leading-relaxed text-muted-foreground">{blockLabel}</p>
              {prompt !== title ? (
                <p className="text-sm font-medium" style={{ color: titleColor }}>
                  {title}
                </p>
              ) : null}
            </>
          )}
          <h1 className="text-xl font-semibold leading-snug text-balance sm:text-2xl">{prompt || title}</h1>
          {note ? <Microcopy>{note}</Microcopy> : null}
        </div>
        {children}
      </main>
      <footer className="fixed inset-x-0 bottom-0 border-t bg-background/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur">
        <div className="mx-auto flex w-full max-w-2xl gap-2">
          <Button type="button" variant="outline" className="rounded-2xl" onClick={onBack}>
            Anterior
          </Button>
          <Button
            type="button"
            className="flex-1 rounded-2xl text-white disabled:opacity-40"
            style={{ backgroundColor: session.color, color: session.ink }}
            disabled={!canContinue}
            onClick={onContinue}
          >
            {continueLabel}
          </Button>
        </div>
      </footer>
    </div>
  )
}
