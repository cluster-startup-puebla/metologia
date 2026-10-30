# Lugar en el sector — plan por sesiones

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ubicar a cada empresa dentro de las demás de su sector, con un lugar del estilo #4 de 20, a partir del promedio final de los diagnósticos cerrados.

**Architecture:** La pantalla y la hoja ya muestran el espectro con datos de muestra. El cálculo es una función pura: el promedio final de esta empresa contra los promedios del mismo `sectorId`. El almacén solo guarda promedios cerrados. La interfaz deja el placeholder cuando el grupo tiene al menos dos empresas.

**Tech Stack:** Next.js 16, React 19, TypeScript, `node --experimental-strip-types --test`, `localStorage` en el navegador.

**Decisión cerrada para este plan:** el promedio final es el score técnico de solo auditoría (`technicalAuditoria.value.score`, escala 0–100). El ISMS oficial sigue indefinido y no se usa para ordenar. Agroindustria y logística no entran al ranking mientras ese score esté bloqueado. El lugar 1 es el mayor puntaje. Si hay empate, las dos ocupan el mismo lugar (1 + cuántas tienen un puntaje estrictamente mayor).

---

## Sesión 1 — Indicador en la calificación y en la hoja

Hecha en la interfaz actual. No se vuelve a construir.

- [x] Quitar de `components/diagnostico/results-sheet.tsx` el bloque Observaciones del evaluador.
- [x] Mostrar `SectorPlace` en `components/diagnostico/result-panel.tsx` y en la hoja.
- [x] El componente lee `SECTOR_PLACE_PLACEHOLDER`: lugar 60 de 200, borde punteado, una sola marca sobre la barra (nunca un punto por empresa) y la nota «Placeholder».

Archivos: `components/diagnostico/sector-place.tsx`.

## Sesión 2 — Promedio final y lugar, sin guardar nada

**Files:**
- Create: `lib/methodology/sector-rank.ts`
- Test: `lib/methodology/sector-rank.test.ts`
- Modify: `package.json` script `test` para incluir este archivo

- [ ] **Step 1: Write the failing test**

```ts
import assert from "node:assert/strict"
import test from "node:test"
import { finalAverage, sectorPlace } from "./sector-rank.ts"
import type { EvaluationReport } from "./report.ts"

test("el lugar 1 es el mayor promedio y el empate comparte lugar", () => {
  assert.deepEqual(sectorPlace(70, [90, 80, 70, 40]), { status: "ranked", rank: 3, cohortSize: 4 })
  assert.deepEqual(sectorPlace(90, [90, 80]), { status: "ranked", rank: 1, cohortSize: 2 })
})

test("una sola empresa no alcanza para ubicarla", () => {
  assert.deepEqual(sectorPlace(80, [80]), { status: "waiting" })
})

test("el promedio final es el score técnico de auditoría", () => {
  const report = { technicalAuditoria: { status: "ok", value: { score: 43.75, obtained: 175, maximum: 400, questionCount: 4 } } } as EvaluationReport
  assert.equal(finalAverage(report), 43.75)
})

test("sin score técnico no hay promedio final", () => {
  const report = { technicalAuditoria: { status: "blocked", failures: [{ code: "no_numeric_questions" }] } } as EvaluationReport
  assert.equal(finalAverage(report), null)
})
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `node --experimental-strip-types --test lib/methodology/sector-rank.test.ts`

Expected: fail because `./sector-rank.ts` does not exist.

- [ ] **Step 3: Implement the two functions**

```ts
import type { EvaluationReport } from "./report.ts"

export type SectorPlaceResult =
  | { status: "waiting" }
  | { status: "ranked"; rank: number; cohortSize: number }

export function finalAverage(report: EvaluationReport): number | null {
  if (report.technicalAuditoria.status !== "ok") return null
  return report.technicalAuditoria.value.score
}

export function sectorPlace(score: number, cohort: number[]): SectorPlaceResult {
  if (cohort.length < 2) return { status: "waiting" }
  return {
    status: "ranked",
    rank: 1 + cohort.filter((other) => other > score).length,
    cohortSize: cohort.length,
  }
}
```

`cohort` incluye el promedio de esta empresa. No se ordena una copia aparte ni se imputan ceros.

- [ ] **Step 4: Run the test and confirm it passes**

Run: `node --experimental-strip-types --test lib/methodology/sector-rank.test.ts`

Expected: 4 passing tests.

- [ ] **Step 5: Add the file to the test script**

In `package.json`, change `test` to:

```json
"test": "node --experimental-strip-types --test lib/methodology/score.test.ts lib/methodology/sector-rank.test.ts"
```

Run: `pnpm test`

Expected: the previous score tests and these four pass.

## Sesión 3 — Guardar el promedio al cerrar el diagnóstico

**Files:**
- Create: `lib/methodology/cohort-store.ts`
- Modify: `components/diagnostico/diagnostico-flow.tsx` (`loadExample` y el paso a `results`)

Cada registro es `{ sectorId: string, finalAverage: number, savedAt: string }`. La llave es `poc-sector-cohort-v1`. Se agrega un registro solo cuando `finalAverage(report)` no es null y la pantalla pasa a resultados por un diagnóstico contestado. `loadExample` no escribe, para que el ejemplo de artes gráficas no llene el sector con un caso hipotético.

- [ ] **Step 1: Write the store**

```ts
const COHORT_KEY = "poc-sector-cohort-v1"

export interface CohortRecord {
  sectorId: string
  finalAverage: number
  savedAt: string
}

export function readCohort(sectorId: string): number[] {
  if (typeof window === "undefined") return []
  const raw = window.localStorage.getItem(COHORT_KEY)
  if (!raw) return []
  const records = JSON.parse(raw) as CohortRecord[]
  return records.filter((record) => record.sectorId === sectorId).map((record) => record.finalAverage)
}

export function appendCohort(sectorId: string, finalAverage: number): void {
  const raw = window.localStorage.getItem(COHORT_KEY)
  const records: CohortRecord[] = raw ? (JSON.parse(raw) as CohortRecord[]) : []
  records.push({ sectorId, finalAverage, savedAt: new Date().toISOString() })
  window.localStorage.setItem(COHORT_KEY, JSON.stringify(records))
}
```

- [ ] **Step 2: Call `appendCohort` once when a real session reaches results**

In `diagnostico-flow.tsx`, keep `const savedCohort = useRef(false)`. In the handler that sets `screen` to `"results"` after the last question:

```ts
const average = finalAverage(report)
if (!savedCohort.current && sectorId && average != null) {
  appendCohort(sectorId, average)
  savedCohort.current = true
}
setScreen("results")
```

`loadExample` only does `setAnswers(sample)` and `setScreen("results")`. It does not call `appendCohort`. Reloading a saved results screen does not append again, because this handler does not run on hydrate.

- [ ] **Step 3: Check in the browser**

Finish one artes gráficas path that has a technical audit score, reload, and confirm `localStorage["poc-sector-cohort-v1"]` has one record for `artes-graficas`. Open the example button and confirm it does not add a second record.

## Sesión 4 — Cambiar el placeholder por el lugar real

**Files:**
- Modify: `components/diagnostico/sector-place.tsx`
- Modify: `components/diagnostico/diagnostico-flow.tsx`
- Modify: `components/diagnostico/result-panel.tsx`
- Modify: `components/diagnostico/results-sheet.tsx`

- [ ] **Step 1: Let `SectorPlace` receive the calculated result**

Add a prop `place: SectorPlaceResult | { status: "placeholder" }`. Default stays `SECTOR_PLACE_PLACEHOLDER` only until the caller passes a result.

- `placeholder`: el espectro #4 de 20 y la nota actual.
- `waiting`: sin número de muestra. Texto: «Hace falta otra empresa de este sector para ubicarla.»
- `ranked`: el mismo espectro, con `rank` y `cohortSize` reales, sin la palabra Placeholder.

- [ ] **Step 2: Pass the result from the flow**

```ts
const average = finalAverage(report)
const peers = sectorId ? readCohort(sectorId) : []
const place =
  average == null || !sectorId
    ? { status: "waiting" as const }
    : sectorPlace(average, peers)
```

Call this after `appendCohort`, so `peers` already includes this cierre. Pass `place` into `ResultPanel` and from there into `ResultsSheet`. The example button passes `{ status: "placeholder", rank: 4, cohortSize: 20 }` because that session is not stored. A real session never passes the placeholder.

- [ ] **Step 3: Check both surfaces**

With an empty cohort, the results screen and the print preview say that another company is needed. After two closed diagnostics of the same sector, both show `#1 de 2` or `#2 de 2` according to the audit scores, and neither says Placeholder.

El ejemplo de artes gráficas sigue en placeholder, porque no se guarda.
