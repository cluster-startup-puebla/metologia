import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { SessionTrail } from "./session-trail"
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
  children,
}: QuestionFrameProps) {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-4 pt-6 pb-28">
        <SessionTrail activeId={session.id} progress={progress} />
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide" style={{ color: session.color }}>
            {stepLabel}
          </p>
          <p className="text-sm text-muted-foreground">{blockLabel}</p>
          <h1 className="text-2xl font-semibold text-balance">{title}</h1>
          {prompt !== title ? <p className="text-sm leading-relaxed text-muted-foreground">{prompt}</p> : null}
          {note ? <p className="text-sm leading-relaxed text-muted-foreground">{note}</p> : null}
        </div>
        {children}
      </main>
      <footer className="fixed inset-x-0 bottom-0 border-t bg-background/95 px-4 py-3 backdrop-blur">
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
