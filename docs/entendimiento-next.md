# Entendimiento del front Next.js (batería de madurez digital)

Informe de solo lectura sobre el código copiado al workspace POC. No se modificó el proyecto fuente, no se instalaron dependencias y no se arrancó el servidor.

La copia excluyó `node_modules`, `.next`, `.git` del origen, `.env` y `tsconfig.tsbuildinfo`. El `.git` del workspace se conservó. `.env.example` está vacío. En los archivos copiados que traían credenciales (`.mcp.json` y `.claude/settings.local.json`) los tokens se vaciaron; este informe no reproduce valores.

## Árbol relevante

```
app/
  layout.tsx                      # metadata + Vercel Analytics en producción
  page.tsx                        # /  → EvaluationApp
  globals.css
  privacidad/page.tsx             # /privacidad  aviso estático
  stash/page.tsx                  # /stash  tablero (PIN + Supabase)
  api/submit-evaluation/route.ts  # POST placeholder, no persiste
components/
  evaluation-app.tsx              # orquestador del formulario
  welcome-screen.tsx
  question-card.tsx               # single + ranking
  results-screen.tsx
  progress-bar.tsx
  section-indicator.tsx
  logos.tsx
  theme-provider.tsx              # no lo monta ninguna ruta
  ui/                             # kit shadcn; el flujo solo usa Button
hooks/
  use-mobile.ts                   # solo lo usa el kit ui
  use-toast.ts                    # solo lo usa el kit ui
lib/
  evaluation-data.ts              # preguntas, puntos, rangos, perfiles
  evaluation-calculator.ts        # puntaje local
  storage.ts                      # localStorage del respondente
  device-id.ts                    # UUID anónimo en localStorage
  supabase-responses.ts           # escrituras y lecturas a Supabase
  supabase/client.ts              # cliente browser
  supabase/server.ts              # cliente server; nadie lo importa
  utils.ts                        # cn()
```

También hay `styles/globals.css` (el layout importa `app/globals.css`), `public/` (logos e imágenes) y `package.json` (Next 16.2.4, React 19, script `dev` en el puerto 4050).

## Rutas y flujo UX

Tres rutas. No hay middleware ni sesión de usuario.

| Ruta | Archivo | Qué hace |
| --- | --- | --- |
| `/` | `app/page.tsx` → `EvaluationApp` | Formulario del respondente |
| `/privacidad` | `app/privacidad/page.tsx` | Aviso de privacidad estático. Enlace de regreso a `/` |
| `/stash` | `app/stash/page.tsx` | Tablero agregado. No forma parte del recorrido del respondente |

### Paso a paso de lo que ve quien responde

1. Entra a `/`. `HomePage` solo renderiza `EvaluationApp`.
2. Mientras carga, un spinner. En el `useEffect` inicial se llama `getOrCreateDeviceId()` y se lee `localStorage` (`lib/storage.ts`):
   - Si `loadCompleted()` es true y hay resultados guardados, salta directo a resultados.
   - Si hay respuestas a medias, reabre la pantalla de preguntas en `sectionIndex` / `questionIndex` guardados.
   - Si no hay nada, muestra bienvenida.
3. **Bienvenida** (`WelcomeScreen`): logos, título «Batería de Evaluación / Nivel de Madurez Digital», texto que anuncia 18 preguntas en 4 secciones y ~10 minutos, botón «Comenzar evaluación» y enlace a `/privacidad`. `onStart` cambia la pantalla a `questions`. No pide nombre, empresa ni correo.
4. **Una pregunta a la vez.** Cabecera con logos, `ProgressBar` (`globalQuestionIndex + 1` de `TOTAL_QUESTIONS`), `SectionIndicator` (un punto por sección) y el contador `n/18`. Debajo, `title` y `subtitle` de la sección activa, con el color de esa sección.
5. El cuerpo es `QuestionCard`:
   - Tipo `single`: cuatro botones. El clic solo marca la opción (`onAnswer(option.key)`). No avanza solo.
   - Tipo `priority` (solo la 16): cuatro causas y botones de rango 1 a 4. El texto dice «1 = mayor impacto, 4 = menor impacto». Hay botón «Limpiar».
6. Pie: «Anterior» (oculto en la primera pregunta) y «Continuar». En la última pregunta el botón dice «Ver resultados». «Continuar» permanece deshabilitado hasta que `isAnswerComplete()` sea true. En prioridad eso exige las 4 posiciones ocupadas (`Object.keys(rankings).length === 4`).
7. Al confirmar, `handleNext`:
   - Dispara `saveResponse(...)` hacia Supabase sin `await` (efecto lateral; el avance no espera).
   - Si no es la última de la sección, incrementa `questionIndex`.
   - Si es la última de la sección pero no del instrumento, pasa a la sección siguiente y `questionIndex = 0`.
   - Si es la última del instrumento, calcula, guarda y cambia a resultados.
8. **Resultados** (`ResultsScreen`): confetti, categoría integral (Bronce / Plata / Oro), `totalScore / maxScore` y porcentaje, bloque de riesgo y reto general, y una tarjeta por sección con barra, categoría, riesgo y reto. El único llamado a la acción es «Recibir análisis detallado por correo»: modal, validación simple de email y `saveEmailLead`. No hay botón de reinicio en esta pantalla. `handleRestart` existe en `EvaluationApp` pero no se pasa ni se usa, así que quien ya completó se queda en resultados hasta que se borre `localStorage`.

Orden real de las secciones, tal como están en `SECTIONS`:

1. Infraestructura y digitalización — preguntas 1 a 4 — color `#FF1493`
2. Situación del equipo productivo — 5 a 7 — `#00CED1`
3. Gestión financiera y costos — 8 a 10 — `#9B59B6`
4. Operación, paros y calidad — 11 a 18 — `#FF6B35`

## Modelo de pregunta y de respuesta

Definido en `lib/evaluation-data.ts`.

```ts
interface Question {
  id: number
  text: string
  type: 'single' | 'priority'
  options?: { key: string; label: string }[]
  priorityOptions?: { key: string; label: string }[]
}

interface Section {
  id: string
  name: string
  title: string
  subtitle: string
  color: string
  questions: Question[]
}
```

En memoria, el estado del formulario es `Answers` (`lib/evaluation-calculator.ts`):

```ts
type Answers = Record<number, string | Record<string, number>>
```

- Pregunta `single`: el valor es la clave `"a" | "b" | "c" | "d"`, no el texto de la etiqueta.
- Pregunta `priority`: objeto `{ [causeKey]: rank }` con ranks 1–4, por ejemplo `{ falta_materiales: 1, fallas_mecanicas: 2, personal: 3, set_ups_lentos: 4 }`.

Escala de las preguntas `single` (misma para las 17): `ANSWER_POINTS` asigna `a = 1`, `b = 2`, `c = 4`, `d = 6`. No es una escala Likert 1–4 lineal: `c` y `d` saltan.

La pregunta 16 no usa esa escala. `PRIORITY_SEVERITY` solo mira la causa puesta en rango 1:

| Clave | Puntos si es el rango 1 |
| --- | --- |
| `falta_materiales` | 6 |
| `fallas_mecanicas` | 4 |
| `personal` | 2 |
| `set_ups_lentos` | 1 |

Los rangos 2, 3 y 4 no suman al puntaje de madurez. Si no hay un rango 1, `scorePriorityRanking` devuelve 0. El tablero `/stash` sí agrega el ranking completo con otro peso (`5 - rank`), pero eso es analítica del tablero, no el puntaje que ve el respondente.

## Conteo exacto

**18 preguntas.** Coinciden el arreglo, la constante derivada y el copy de la bienvenida.

| Símbolo | Archivo | Qué cuenta |
| --- | --- | --- |
| `SECTIONS` | `lib/evaluation-data.ts` | Fuente única. 4 secciones, ids 1…18 |
| `TOTAL_QUESTIONS` | mismo archivo | `SECTIONS.reduce(...)` sobre `questions.length` |
| Texto «18 preguntas» / «18 Preguntas» | `components/welcome-screen.tsx` | Copy fijo, no lee `TOTAL_QUESTIONS` |

Desglose:

| Sección (`Section.id`) | Ids | Tipo | Cantidad |
| --- | --- | --- | --- |
| `infraestructura` | 1–4 | `single` | 4 |
| `equipo_productivo` | 5–7 | `single` | 3 |
| `financiera` | 8–10 | `single` | 3 |
| `operacion` | 11–15, 17–18 | `single` | 7 |
| `operacion` | 16 | `priority` | 1 |
| **Total** | | | **18** |

No salen de Supabase ni de una API. La base solo recibe las respuestas ya contestadas. Los iconos de cada opción viven aparte, hardcodeados en `OPTION_ICONS` y `PRIORITY_OPTION_ICONS` dentro de `components/question-card.tsx`, con claves `"${questionId}-${optionKey}"`.

## Cálculo de puntaje (ya existe, y es local)

`lib/evaluation-calculator.ts` calcula todo en el cliente, antes de cualquier red.

| Símbolo | Rol |
| --- | --- |
| `scoreAnswer` | Busca la clave en `ANSWER_POINTS`. Desconocido → 0 |
| `scorePriorityRanking` | Puntos de la causa con rango 1 |
| `scoreQuestion` | Si `questionId === 16` y la respuesta es objeto, usa el ranking; si es string, usa `scoreAnswer` |
| `getSectionMaxScore` | `preguntas de la sección × 6` |
| `categorizeScore` | Primer rango `[low, high]` que contenga el puntaje. Si ninguno, `"Sin categoría"` |
| `calculateSectionResult` | Puntaje, máximo, categoría, `riesgo` y `reto` de `SECTION_PROFILES` |
| `calculateIntegralResult` | Suma de secciones. `maxScore` fijo en **108**. Categoría con `INTEGRAL_RANGES` y texto de `INTEGRAL_PROFILES` |
| `getCategoryColor` / `getCategoryIcon` | Presentación Bronce / Plata / Oro |

Máximos que se desprenden de `preguntas × 6`: infraestructura 24, equipo 18, financiera 18, operación 48. Suman 108, el mismo tope que `INTEGRAL_RANGES` (`[86, 108, 'Oro']`) y que el literal `108` de `calculateIntegralResult`. `/stash` repite esos máximos en `sectionMaxScores` y también compara `total_score / 108`.

Rangos de categoría (`SECTION_RANGES` / `INTEGRAL_RANGES`):

| Ámbito | Bronce | Plata | Oro |
| --- | --- | --- | --- |
| Infraestructura | 4–10 | 11–18 | 19–24 |
| Equipo productivo | 3–7 | 8–13 | 14–18 |
| Financiera | 3–7 | 8–13 | 14–18 |
| Operación | 8–19 | 20–35 | 36–48 |
| Integral | 18–45 | 46–85 | 86–108 |

El mínimo teórico con todo contestado es 18: diecisiete `a` (1 punto) más la causa de menor severidad en el rango 1 (`set_ups_lentos` = 1). Por eso el rango Bronce integral empieza en 18.

`ResultsScreen` muestra `section.score / section.maxScore` y el porcentaje integral `totalScore / maxScore`. Los textos de riesgo y reto no se generan: se leen de `SECTION_PROFILES` (clave `` `${sectionId}-${category}` ``) e `INTEGRAL_PROFILES`.

## Qué se envía y a dónde

Al confirmar cada pregunta, `EvaluationApp.handleNext` llama `saveResponse` con:

- `device_id`: UUID de `getOrCreateDeviceId` (clave `cluster_evaluation_device_id`)
- `question_id`: `Question.id` (número)
- `section_id`: `Section.id`
- `answer_value`: string `"a"`…`"d"`, u objeto de ranking

`saveResponse` (`lib/supabase-responses.ts`) borra la fila previa del mismo `device_id` + `question_id` en `evaluation_responses` y luego inserta. No se espera el resultado; un fallo solo hace `console.error`.

Al terminar, en este orden:

1. `calculateIntegralResult(answers)` en el cliente.
2. `saveResults` + `saveCompleted(true)` en `localStorage` (claves `cluster_evaluation_*`).
3. `saveResult` hace upsert en `evaluation_results` por `device_id`, con `total_score`, `section_scores` (el arreglo `IntegralResult.sections`) y `maturity_level` (la categoría).
4. `submitResults` hace `POST /api/submit-evaluation` con `{ answers, results, timestamp }`.

Ese route (`app/api/submit-evaluation/route.ts`) valida que vengan `answers` y `results`, escribe un log y responde `{ success: true, id: "eval_..." }`. El comentario del archivo dice que guardar en base de datos es un TODO. La persistencia real del producto está en el cliente de Supabase, no en esta ruta.

El correo del modal va a `saveEmailLead` → upsert en `evaluation_leads` (`device_id`, `email`). No hay envío de correo en el código: el botón dice «te enviamos», pero la función solo guarda el lead.

`localStorage` es lo que rehidrata la sesión. Supabase es una copia lateral. Reiniciar el storage del formulario no borra el device id (`clearAllStorage` no toca `cluster_evaluation_device_id`).

Desajuste de tipos, sin efecto en runtime porque `next.config.mjs` tiene `typescript.ignoreBuildErrors: true`: `ResponseRecord.question_id` está declarado `string` y `answer_value` como `number | Record<string, number>`, pero el formulario manda un `number` y un `string`.

## Puntos de Supabase, API y “auth” a ignorar en la POC

No hay login, cookies de sesión ni uso de `lib/supabase/server.ts`. El cliente browser (`lib/supabase/client.ts`, `createBrowserClient`) lee `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

| Pieza | Archivo | Símbolos | Tabla o destino |
| --- | --- | --- | --- |
| Cliente browser | `lib/supabase/client.ts` | `createClient` | — |
| Cliente server, sin usos | `lib/supabase/server.ts` | `createClient` | — |
| Guardar respuesta | `lib/supabase-responses.ts` | `saveResponse` | `evaluation_responses` (delete + insert) |
| Guardar resultado | mismo | `saveResult` | `evaluation_results` (upsert por `device_id`) |
| Lead de correo | mismo | `saveEmailLead` | `evaluation_leads` |
| Stats del tablero | mismo | `getResponseStats` | las dos primeras tablas, `select` |
| Distribución (sin callers) | mismo | `getQuestionDistribution` | `evaluation_responses` |
| Realtime | mismo | `subscribeToResponses`, `subscribeToResults` | `postgres_changes` |
| Llamadas del formulario | `components/evaluation-app.tsx` | `saveResponse`, `saveResult`, `submitResults` | Supabase + `POST /api/submit-evaluation` |
| Llamada de resultados | `components/results-screen.tsx` | `saveEmailLead` | `evaluation_leads` |
| Tablero | `app/stash/page.tsx` | `getResponseStats`, suscripciones, `verifyPin` | lectura + realtime |
| API | `app/api/submit-evaluation/route.ts` | `POST` | no escribe en ningún lado |
| Analytics | `app/layout.tsx` | `Analytics` de `@vercel/analytics/next` | solo si `NODE_ENV === 'production'` |
| MCP local | `.mcp.json` | servidor supabase | token ya vaciado en esta copia |

Variables que el código nombra (sin valores): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_STASH_PIN`, `NEXT_PUBLIC_SITE_URL`.

`/stash` no es auth de producto. `verifyPin` compara 4 dígitos contra `process.env.NEXT_PUBLIC_STASH_PIN` y, si no existe, contra un literal en el cliente. El PIN viaja en el bundle. Fuera de la POC.

Para dejar la POC en puro front, más adelante habría que dejar de llamar (sin hacerlo en esta fase):

- `saveResponse` y `saveResult` dentro de `handleNext`
- `fetch('/api/submit-evaluation')` / `submitResults`
- `saveEmailLead` en `ResultsScreen`
- toda `app/stash/page.tsx` si el tablero no entra en la POC
- `lib/supabase-responses.ts`, `lib/supabase/client.ts`, `lib/supabase/server.ts`
- dependencia `@supabase/ssr` y `@supabase/supabase-js`

El cálculo y el recorrido no las necesitan: `calculateIntegralResult` ya corre con el objeto `answers` en memoria.

## Reutilizable frente a monolito

Conviene tratar como piezas del formulario:

- `WelcomeScreen`, `ProgressBar`, `SectionIndicator`, `QuestionCard` (`SingleQuestion` / `PriorityQuestion`), `ResultsScreen`, `logos.tsx`
- `lib/evaluation-data.ts` y `lib/evaluation-calculator.ts`
- `lib/storage.ts` si la POC quiere reanudar
- `components/ui/button.tsx` y `lib/utils.ts`

Monolitos o lastre:

- `EvaluationApp` mezcla navegación, persistencia local, Supabase y el POST. Es el único lugar que sabe el flujo, pero las llamadas de red están incrustadas en `handleNext`.
- `question-card.tsx` acopla presentación a ids concretos (`OPTION_ICONS`). Una pregunta nueva sin icono cae en `FALLBACK_ICON` (`HelpCircle`); no rompe, pero el mapa hay que mantenerlo a mano.
- `app/stash/page.tsx` (~850 líneas) repite máximos, etiquetas de la pregunta 13 y otra fórmula para la 16. No reutiliza `Question`.
- `components/ui/*` es el kit shadcn generado. El flujo real solo importa `Button`. `ThemeProvider`, `hooks/use-mobile.ts` y `hooks/use-toast.ts` no entran al recorrido.

## Qué conservar para una POC de formulario + algoritmo local

Conservar y usar tal cual como contrato:

- `SECTIONS`, `Question`, `Answers`
- `calculateIntegralResult` / `calculateSectionResult` y las tablas `ANSWER_POINTS`, `PRIORITY_SEVERITY`, `SECTION_RANGES`, `INTEGRAL_RANGES`, `SECTION_PROFILES`, `INTEGRAL_PROFILES`
- El shell visual: bienvenida → una pregunta → resultados
- `storage.ts` si se quiere cerrar el navegador y seguir

No hace falta para esa POC: Supabase, `/api/submit-evaluation`, `/stash`, device id, modal de correo, Vercel Analytics, el kit `ui` que no sea `Button`.

Si el algoritmo de la POC va a sustituir al actual, el punto de reemplazo es `calculateIntegralResult`: hoy se invoca una sola vez, al confirmar la pregunta 18, con el mapa completo de respuestas. La UI no calcula mientras se contesta.

## Riesgos

- **Preguntas hardcodeadas en tres sitios.** El texto vive en `SECTIONS`. El copy «18» de la bienvenida es un string suelto. Los iconos dependen del id numérico. Cambiar una opción obliga a tocar datos y, si se quiere icono propio, `question-card.tsx`.
- **La escala a–d se aplica también a preguntas que no son de madurez.** 11 («problema más recurrente»), 13 («mayor barrera») y 17 («cuello de botella de calidad») son categorías de problema, no un orden de peor a mejor. Aun así `scoreAnswer` les da 1 / 2 / 4 / 6. En la 17, «falta trazabilidad de rechazo» (`d`) suma 6, el máximo, igual que una respuesta de alta madurez en otras preguntas.
- **La 16 tira casi todo el ranking.** Solo cuenta la causa en posición 1. Dos respondentes con la misma causa principal y el resto invertido obtienen el mismo puntaje.
- **108 y los máximos por sección están duplicados.** `getSectionMaxScore` los deriva; `calculateIntegralResult` fija 108; `/stash` vuelve a escribir 24 / 18 / 18 / 48 y 108. Si cambia el número de preguntas, el tope integral no se actualiza solo.
- **Acoplamiento de red dentro del avance.** `handleNext` no distingue «ya puedo calcular» de «debo hablar con Supabase». Un fallo de red no bloquea la UI, pero la POC heredaría esas llamadas si no se cortan.
- **Tipos de `ResponseRecord` no coinciden con el payload** y el build los ignora (`ignoreBuildErrors`).
- **`handleRestart` está muerto.** Completar la evaluación deja a la persona en resultados. `loadCompleted()` en la siguiente visita también salta la bienvenida.
- **El tablero no es un control de acceso.** El PIN es público en el cliente (`NEXT_PUBLIC_STASH_PIN` o el literal de `verifyPin`). Las escrituras usan la anon key en el browser.
- **El route de submit es un señuelo.** Quien lea solo `submitResults` puede creer que ahí se guarda la evaluación. El insert real es `saveResponse` / `saveResult`.
- **El correo no se envía.** `saveEmailLead` solo hace upsert. La promesa de «análisis detallado por correo» no tiene transporte en este repo.
