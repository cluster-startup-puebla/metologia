# Versión 2.0: documentos nuevos, cuestionario y motor

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cargar el paquete `Version02.zip`, dejar documentado en qué cambió frente a lo que ya está en pantalla, y hacer que el cuestionario califique igual que los cuatro ejemplos de Roberto.

**Architecture:** Los Word se quedan tal cual en `docs/metodologia/v2/raw`. El markdown es la lectura. El JSON de `content/methodology/v2` es lo que pinta la app. El motor es una función pura en `lib/methodology/v2-score.ts` que no toca el motor viejo de la versión anterior. Los cuatro ejemplos se convierten en respuestas fijas y el test exige los puntajes de las fichas.

**Tech Stack:** Next.js, pandoc, Python 3 para el banco, Node test runner (`node --experimental-strip-types --test`).

**Fuente:** `/Users/alvarocastillo/Downloads/Version02.zip` (17 nov 2026).

---

## Lo que ya se sabe, para no redescubrirlo

El zip trae 22 archivos:

- `01_Metodologia/Manual_Metodologia_Reportes_v10.docx` — cómo se interpreta y cómo se calcula el reporte.
- `01_Metodologia/Ejemplos.docx` — cuatro empresas llenadas, con la cuenta hecha.
- `02_Instrumento_nivel_01/instrumento-diagnostico-regional-web-v8.docx` — el general reescrito para servicios. El v6 sigue en el zip y es el que hoy está montado.
- `03_Instrumento_nivel_02/` — los 16 de siempre más `quimica-petroquimica` y `tics-software`.

El v8 sigue diciendo «16 sectores». Química y TICs no vienen como opciones. Roberto pidió agregarlas al selector.

La cuenta que usan las fichas, y contra la que hay que probar:

- Estado de derecho = promedio de ED-01 a ED-05, con el puntaje escrito en la opción (20, 40, 60, 80, 100).
- Innovación = promedio de INO-01 a INO-04.
- Comercial = promedio de COM-01 a COM-03.
- `ISMS nivel 1 = 0.40 × estado de derecho + 0.30 × innovación + 0.30 × comercial`.
- `SAT nivel 2` = promedio de los siete reactivos de la sección II: P1, P2, P3, P4, P5, TECH-06 y TECH-07.
- P5, aunque lleve texto libre, entra al promedio con **60 fijos**.
- `ISMS nivel 2 = 0.50 × ISMS nivel 1 + 0.50 × SAT`.
- `IB = ISMS nivel 1 − SAT`.
- Platino ≥ 85, oro de 70 a menos de 85, plata de 50 a menos de 70, bronce menor de 50.

Hay una frase en los ejemplos que dice Likert `(V − 1) × 25`, y eso da 0, 25, 50, 75, 100. Las fichas no usan esa escala: usan 20, 40, 60, 80, 100. El motor sigue las fichas. La frase queda anotada como conflicto, no como fórmula.

Los rankings Borda no entran a estos tres números. Sirven para el texto del reporte (qué fricción quedó en lugar 1). No se inventa un Borda dentro del ISMS.

Fichas que el test tiene que reproducir, con tolerancia de 0.01:

| Empresa | Sector | ISMS 1 | SAT | ISMS 2 | Categoría |
| --- | --- | ---: | ---: | ---: | --- |
| Troquelados y Piezas de Carrocería del Centro | automotriz | 62.68 | 57.14 | 59.91 | plata |
| Inyecciones y Empaques Poliméricos de Tlaxcala | plasticos | 40.38 | 30.00 | 35.19 | bronce |
| Hospital y Centro de Diagnóstico San José | medico-hospitalario | 68.03 | 77.14 | 72.59 | oro |
| Logística y Transportes Terrestres del Valle | logistica | 51.63 | 48.57 | 50.10 | plata |

Componentes del estado de derecho, innovación y comercial que ya están escritos en las fichas:

- Automotriz: 52.00, 56.25, 83.33.
- Plásticos: 40.00, 31.25, 50.00.
- Hospital: 56.00, 68.75, 83.33.
- Logística: 40.00, 43.75, 75.00.

Los siete sumandos del SAT, en orden P1 a TECH-07:

- Automotriz: 60, 60, 60, 60, 60, 50, 50.
- Plásticos: 20, 40, 20, 20, 60, 25, 25.
- Hospital: 80, 80, 80, 80, 60, 85, 75.
- Logística: 40, 60, 40, 40, 60, 50, 50.

## Archivos

- Crear: `docs/metodologia/v2/cambios-v6-a-v8.md`
- Crear: `docs/metodologia/v2/manual-reportes-v10.md` y `ejemplos.md` (salida de pandoc)
- Crear: `lib/methodology/v2-score.ts`
- Crear: `lib/methodology/v2-score.test.ts`
- Crear: `lib/methodology/v2-examples.ts` con las cuatro sesiones
- Modificar: `scripts/build-v2-bank.py` para aceptar el v8, química y TICs, y las dos opciones nuevas del selector
- Modificar: `lib/methodology/v2-bank.ts` y `content/methodology/v2/*`
- Modificar: `components/diagnostico/v2-flow.tsx` para que la pantalla de resultado use el motor en lugar de «Próximamente»
- No tocar: `lib/methodology/score.ts` ni el flujo de `/v1`

---

### Task 1: Soltar el zip junto a la v2

**Files:**
- Create: `docs/metodologia/v2/raw/` (reemplazar los docx viejos por los del zip)
- Create: `docs/metodologia/v2/manual-reportes-v10.md`
- Create: `docs/metodologia/v2/ejemplos.md`

- [ ] **Step 1: Copiar sin modificar los Word**

Descomprimir el zip en un temporal. Copiar cada docx a `docs/metodologia/v2/raw/` con el mismo nombre. El v6 se conserva al lado del v8. Química y TICs entran aquí. No editar los docx.

- [ ] **Step 2: Convertir a markdown**

Para cada docx nuevo o reemplazado:

```bash
pandoc --wrap=none --track-changes=accept -f docx -t markdown --markdown-headings=atx \
  -o "docs/metodologia/v2/<stem>.md" "docs/metodologia/v2/raw/<stem>.docx"
```

El manual y los ejemplos van a la raíz de `docs/metodologia/v2/`, no a `raw`.

- [ ] **Step 3: Comprobar que están los 22**

`ls docs/metodologia/v2/raw | wc -l` debe dar 20 docx de instrumentos (v6, v8 y 18 de nivel 2) más no: el raw de instrumentos son v6, v8 y 18 n2 = 20. Manual y ejemplos son 2 docx extra en raw o en una carpeta `metodologia/`. Guardarlos también en raw para no perder el original. Total de docx en raw: 22.

---

### Task 2: Comparar y escribir el cambio

**Files:**
- Create: `docs/metodologia/v2/cambios-v6-a-v8.md`
- Modify: ninguno de código

- [ ] **Step 1: Diff del general**

`diff -u` entre el markdown del v6 que ya está y el markdown nuevo del v8. El documento de cambios lista solo reactivos cuyo `prompt` o alguna `label` cambió, con el texto viejo y el nuevo. Si un reactivo no cambió, no se menciona.

- [ ] **Step 2: Diff de los 16 instrumentos de nivel 2**

Mismo criterio contra los markdown actuales. Si un archivo del zip es idéntico al que ya teníamos, el documento dice «sin cambio» en una línea.

- [ ] **Step 3: Altas**

Una sección corta: entran química, TICs, el manual v10 y los ejemplos. El selector del v8 sigue en 16. El plan de montaje agrega las opciones 17 y 18 a mano, con los nombres del título de cada instrumento nuevo.

---

### Task 3: Volver a armar el JSON

**Files:**
- Modify: `scripts/build-v2-bank.py`
- Modify: `content/methodology/v2/n1.json`, `index.json`, `n2/*.json`
- Modify: `lib/methodology/v2-bank.ts`

- [ ] **Step 1: Apuntar el script al v8 y a los dos sectores nuevos**

`FILES` gana `quimica` y `tics`. El nivel 1 se lee de `instrumento-diagnostico-regional-web-v8.md`. Después de parsear, si `MOD0-WEB-01` no trae `quimica` ni `tics`, el script inserta:

```python
{"value": "quimica", "label": "17. Química y Petroquímica", "score": None}
{"value": "tics", "label": "18. TICs y Software", "score": None}
```

El texto exacto de la etiqueta se toma del título del propio instrumento, no se inventa un nombre distinto. `GROUPS` gana un grupo de un solo instrumento para cada uno, para que en la portada se elijan sin subsector.

- [ ] **Step 2: Regenerar**

`python3 scripts/build-v2-bank.py`

Esperado: `n1` con 22 preguntas y 18 opciones en `MOD0-WEB-01`. Química y TICs con 19 preguntas, o las que el parser cuente si el Word trae otro número. Si un instrumento nuevo baja de 8 preguntas, el script debe salir con error, como ya hace.

- [ ] **Step 3: Importar los dos JSON en el banco**

En `lib/methodology/v2-bank.ts`, dos imports y dos llaves en `documents`. Sin eso la pantalla no abre el sector aunque el JSON exista.

---

### Task 4: Motor, primero con los números de las fichas

**Files:**
- Create: `lib/methodology/v2-score.ts`
- Test: `lib/methodology/v2-score.test.ts`
- Modify: `package.json` script `test` para incluir este archivo

Contrato:

```ts
export type V2Band = "platino" | "oro" | "plata" | "bronce"

export interface V2Score {
  estadoDerecho: number
  innovacion: number
  comercial: number
  ismsNivel1: number
  satNivel2: number
  ismsNivel2: number
  ib: number
  band: V2Band
}

export function scoreV2(questions: V2Question[], answers: V2Answers): V2Score
```

- [ ] **Step 1: Test que falla con los cuatro casos, armados a mano**

No hace falta todavía mapear cada opción del Word. El test construye preguntas mínimas con `score` y respuestas que producen los promedios de la tabla. Ejemplo del automotriz, estado de derecho 52:

```ts
assert.equal(round2(scoreV2(autoQuestions, autoAnswers).ismsNivel1), 62.68)
assert.equal(round2(scoreV2(autoQuestions, autoAnswers).satNivel2), 57.14)
assert.equal(round2(scoreV2(autoQuestions, autoAnswers).ismsNivel2), 59.91)
assert.equal(scoreV2(autoQuestions, autoAnswers).band, "plata")
```

Los otros tres casos van en el mismo archivo con sus números. `round2` redondea a 2 decimales como la ficha (59.91, no 59.910).

Correr:

```bash
node --experimental-strip-types --test lib/methodology/v2-score.test.ts
```

Esperado: falla porque `scoreV2` no existe.

- [ ] **Step 2: Implementar solo esa cuenta**

Promedio de los scores de las opciones elegidas en cada bloque. P5, si la opción elegida es la de texto libre, aporta 60 aunque la opción no traiga score. Banda con los cortes de arriba, inclusivo en 50, 70 y 85 por abajo del tramo siguiente. 50.10 es plata. 49.99 sería bronce.

- [ ] **Step 3: El test pasa**

Misma orden. Esperado: pass, 4 casos.

---

### Task 5: Los cuatro ejemplos reales, no el promedio inventado

**Files:**
- Create: `lib/methodology/v2-examples.ts`
- Modify: `lib/methodology/v2-score.test.ts`

- [ ] **Step 1: Transcribir la sesión de cada ficha**

Cada ejemplo del markdown `ejemplos.md` se vuelve un `V2Answers` contra los ids reales del JSON (`ED-01`, `INO-01`, `AU-TECH-01` o el id que haya quedado en el banco). La opción elegida es la que tiene el `score` que la ficha usa en ese reactivo. Si dos opciones empatan en score, se copia la etiqueta que el ejemplo cita y se deja un comentario de una línea.

- [ ] **Step 2: El mismo test, ahora con el banco real**

```ts
const report = scoreV2(questionsFor("automotriz"), troqueladosAnswers)
assert.equal(round2(report.ismsNivel2), 59.91)
assert.equal(report.band, "plata")
```

Repetir para plásticos 35.19 bronce, hospital 72.59 oro, logística 50.10 plata.

Si un id del Word no coincide con el JSON, se corrige el mapa en `v2-examples.ts`, no el número de la ficha.

- [ ] **Step 3: Correr los dos archivos de test**

```bash
node --experimental-strip-types --test lib/methodology/v2-score.test.ts lib/methodology/score.test.ts
```

El test viejo de la versión anterior tiene que seguir en verde. El motor nuevo no lo importa.

---

### Task 6: Mostrarlo al cerrar el cuestionario

**Files:**
- Modify: `components/diagnostico/v2-flow.tsx` (pantalla `done`)

- [ ] **Step 1: Quitar «Próximamente» como único contenido**

La pantalla de resultado llama `scoreV2` con las preguntas del general más las del sector elegido y las respuestas de la sesión. Muestra, en este orden: sector, ISMS nivel 1, SAT, ISMS nivel 2, la categoría en palabras (platino, oro, plata, bronce) y el IB. El confeti se queda.

- [ ] **Step 2: Probar en el navegador el camino corto**

No recorrer 40 preguntas a mano. En una prueba de desarrollo, cargar `troqueladosAnswers` con un botón «Ver el ejemplo de troquelados» solo en la portada, igual que la versión anterior tiene el de artes gráficas. Abrir `/`, entrar, pulsar ese botón y comprobar 59.91 y plata. Luego quitar el botón si estorba, o dejarlo como los ejemplos de Roberto piden para validar.

- [ ] **Step 3: Química y TICs se pueden iniciar**

En `/`, elegir cada uno, pulsar Iniciar y ver la primera pregunta del instrumento 2. No hace falta calificarlos: no hay ficha de ejemplo.

---

## Qué no entra en este plan

El texto largo del reporte (hoja de ruta, bienes de club, narrativa por reactivo) que el manual describe después de los índices. Primero los cuatro números y la categoría. El PDF ejecutivo es otro plan, cuando estos tests estén en verde.
