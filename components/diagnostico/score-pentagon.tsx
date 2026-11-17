export interface PentagonAxis {
  label: string
  value: number // 0 to 100
}

const CX = 160
const CY = 168
const RADIUS = 92
const LABEL_OFFSET = 16
const ACCENT = "#C2410C"
const GRID = "#E5E7EB"
const INK = "#44403C"
const RINGS = [0.25, 0.5, 0.75, 1]

function clamp(value: number, min: number, max: number) {
  if (Number.isNaN(value)) return min
  return Math.min(max, Math.max(min, value))
}

function pointAt(index: number, radius: number) {
  const angle = ((-90 + index * 72) * Math.PI) / 180
  return { x: CX + radius * Math.cos(angle), y: CY + radius * Math.sin(angle) }
}

function toPoints(points: { x: number; y: number }[]) {
  return points.map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" ")
}

export function ScorePentagon({ axes, caption }: { axes: PentagonAxis[]; caption: string }) {
  if (axes.length !== 5) return null

  const outer = axes.map((_, i) => pointAt(i, RADIUS))
  const data = axes.map((axis, i) => pointAt(i, (clamp(axis.value, 0, 100) / 100) * RADIUS))
  const ariaLabel = `${caption}. ${axes.map((axis) => `${axis.label} ${Math.round(clamp(axis.value, 0, 100))}`).join(", ")}`

  return (
    <figure className="mx-auto w-full max-w-[320px]">
      <p className="text-center text-sm font-medium" style={{ color: ACCENT }}>
        {caption}
      </p>
      <svg viewBox="0 0 320 340" className="h-auto w-full" role="img" aria-label={ariaLabel}>
        {RINGS.map((ring) => (
          <polygon
            key={ring}
            points={toPoints(axes.map((_, i) => pointAt(i, RADIUS * ring)))}
            fill="none"
            stroke={GRID}
            strokeWidth={1}
          />
        ))}
        {outer.map((point, i) => (
          <line key={i} x1={CX} y1={CY} x2={point.x} y2={point.y} stroke={GRID} strokeWidth={1} />
        ))}
        <polygon
          points={toPoints(data)}
          fill={ACCENT}
          fillOpacity={0.18}
          stroke={ACCENT}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        {data.map((point, i) => (
          <circle key={i} cx={point.x} cy={point.y} r={4} fill={ACCENT} />
        ))}
        {RINGS.map((ring) => {
          const point = pointAt(0, RADIUS * ring)
          return (
            <text key={`scale-${ring}`} x={point.x + 6} y={point.y + 4} fontSize={10} fill="#A8A29E">
              {Math.round(ring * 100)}
            </text>
          )
        })}
        {axes.map((axis, i) => {
          const point = pointAt(i, RADIUS + LABEL_OFFSET)
          const anchor = i === 0 ? "middle" : point.x > CX ? "start" : "end"
          const dy = i === 0 ? -2 : i === 1 || i === 4 ? 4 : 10
          return (
            <text key={axis.label} x={point.x} y={point.y + dy} textAnchor={anchor} fontSize={12} fill={INK}>
              {axis.label}
            </text>
          )
        })}
      </svg>
      <figcaption className="px-2 text-center text-sm leading-relaxed text-muted-foreground">
        El borde es 100. Cada punta es una parte del entorno para operar. Si el área se encoge hacia el centro, ahí está más difícil trabajar.
      </figcaption>
    </figure>
  )
}
