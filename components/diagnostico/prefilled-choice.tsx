interface PrefilledChoiceProps {
  label: string
  source: string
  accent: string
  accentInk: string
}

export function PrefilledChoice({ label, source, accent, accentInk }: PrefilledChoiceProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">Viene de {source}. Aquí no se vuelve a elegir.</p>
      <div className="rounded-2xl px-4 py-3 text-sm leading-relaxed" style={{ backgroundColor: accent, color: accentInk }}>
        {label}
      </div>
    </div>
  )
}
