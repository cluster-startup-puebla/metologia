export function Microcopy({ children }: { children: string }) {
  return (
    <p className="text-sm leading-relaxed text-muted-foreground">
      <span className="font-medium text-foreground">Guía. </span>
      {children}
    </p>
  )
}
