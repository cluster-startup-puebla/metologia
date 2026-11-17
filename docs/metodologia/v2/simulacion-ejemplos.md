# Simulación de los cuatro ejemplos de Roberto contra el motor y el banco real

Fuente de los números: `docs/metodologia/v2/Ejemplos.md` (copiados tal cual, sin "corregir").
Datos en código: `lib/methodology/v2-examples.ts`. Pruebas: `lib/methodology/v2-score.test.ts`.

## Resultado en una línea

- **La aritmética cuadra** en las cuatro fichas: con los puntajes que dice la ficha, `scoreV2` devuelve 59.91 / 35.19 / 72.59 / 50.10 (y las bandas plata / bronce / oro / plata).
- **El banco real no puede emitir varios de esos puntajes tal como están escritos.** Abajo, la lista de lo que no empata. No se editó ningún JSON de `content/methodology` ni ningún puntaje de opción.

## Parte A: la aritmética

| Ficha | ISMS N1 | SAT | ISMS N2 | Banda | IB |
|---|---|---|---|---|---|
| Automotriz, Troquelados | 62.68 | 57.14 | 59.91 | plata | 5.54 |
| Plásticos, Inyecciones | 40.38 | 30.00 | 35.19 | bronce | (no declarado) |
| Hospital San José | 68.03 | 77.14 | 72.59 | oro | -9.11 |
| Logística, Transportes del Valle | 51.63 | 48.57 | 50.10 | plata | (no declarado) |

El 60 de P5 en la prueba es la constante del manual (respuesta de texto), no el puntaje de una opción.

## Parte B: qué sí y qué no se puede reproducir con el banco real

### 1. Estado de Derecho (ED-01..05): sí empata

Todos los valores de las cuatro fichas están en {20, 40, 60, 80, 100} y las tarjetas reales de ED son `likert_5` con esos puntajes. Cada ítem encuentra una opción real. La prueba lo verifica ítem por ítem.

### 2. Innovación y Comercial (INO-01..04, COM-01..03): no empata por `option.score`

Hallazgo que **corrige la premisa del encargo**: en el banco real las tarjetas INO y COM son `single_select` de **4 opciones con `score: null`**, no tienen 20/40/60/80/100. Por lo tanto:

- Por `option.score`, **los 7 ítems (INO-01..04, COM-01..03) no emiten ningún puntaje**. Los 28 valores de las fichas (7 ítems x 4 fichas) quedan sin opción que los produzca. La prueba fija el conjunto exacto: si una tarjeta cambia y gana puntajes, la prueba falla.
- Los valores de las fichas incluyen 25, 50 y 75, que no existen como puntaje de tarjeta (la regla del manual es `Score = (V-1) x 25` para estas secciones, con opciones de 25/50/75/100 pts).
- Si se aplica el mapa ordinal del manual (posición de la tarjeta: 1ª=25, 2ª=50, 3ª=75, 4ª=100), **todos** los valores de INO/COM de las cuatro fichas quedan en {25, 50, 75, 100}. O sea, el desfase es de cómo está cargado el banco (puntajes nulos), no de los números de Roberto.

Ítems sin puntaje de tarjeta (todos): `INO-01`, `INO-02`, `INO-03`, `INO-04`, `COM-01`, `COM-02`, `COM-03`.

### 3. TECH-06 y TECH-07: mapa ordinal 25/50/75/100; el 85 no se puede emitir

- Los TECH-06/07 reales (AU/PL/MD/LG) son selecciones de 4 opciones con `score: null`. El mapa ordinal por posición da 25 / 50 / 75 / 100.
- Todos los valores de las fichas caen en ese mapa **salvo el TECH-06 del Hospital San José = 85**. Ninguna opción puede producir 85.
- La narrativa del hospital ("mermas < 1% e IAAS < 0.8%") cae dentro de la tercera tarjeta ("Control Avanzado": mermas 0.5%-2%, IAAS 0.5%-1.5%), que el mapa ordinal puntúa **75**, no 85.
- Consecuencia: con lo que el instrumento puede emitir, el hospital tendría TECH-06 = 75, SAT = 75.71 en lugar de 77.14. No se cambió nada para forzar el 77.14.

### 4. P1..P4 (TECH-01..04): no hay mapeo sin inventar

- **P1** en la ficha es "casillas x 20" (por ejemplo "CAD/CAM + Prensas IoT + ERP"), pero la tarjeta real es de selección única y esas frases no son etiquetas de opción.
- **P2** en la ficha es `100 - IST`; el IST es un cociente que la tarjeta no pregunta.
- **P3** y **P4** en la ficha son puntos narrativos; no corresponden a una posición en la tarjeta.
- Todas las opciones de TECH-01..04 de los cuatro sectores tienen `score: null`. No se inventó ningún mapeo de esas etiquetas a índices de opción.

## Lista corta de brechas (lo que no puede coincidir)

1. INO-01..04 y COM-01..03: tarjetas con `score: null`; los valores 25/50/75 de las fichas no son puntajes de tarjeta (solo se alcanzan con el mapa ordinal del manual).
2. TECH-06 del Hospital San José = 85: valor que el instrumento no puede emitir (máximo alcanzable en esa tarjeta: 75).
3. P1 (casillas x 20), P2 (100 - IST), P3 y P4 (puntos narrativos): no tienen representación en las tarjetas reales; no se puntúan.
4. ED-01..05: sin brecha.

## Parte C: `scoreLive` para una sesión real

`scoreLive(questions, answers)` en `lib/methodology/v2-score.ts`:

- ED, INO y COM: mismas medias que `scoreV2`. Para INO/COM, cuando `option.score` es `null` se usa el mapa ordinal del manual (índice 0..3 -> 25/50/75/100); sin esto una sesión real no podría puntuarse porque esas tarjetas no traen puntaje. **Esta decisión se aparta del texto literal del encargo ("usando option.score")** y se apoya en el manual; conviene que alguien la confirme.
- SAT: reconoce ids que terminan en `-TECH-01..07` (y `P1..P5`, `TECH-06/07` sintéticos). TECH-05 aporta 60 si está respondida. TECH-06/07 usan `option.score` o, si es `null`, el mapa ordinal (otro índice lanza error con el id).
- TECH-01..04 no se puntúan: se agregan a `missing`; `satNivel2`, `ismsNivel2`, `ib` y `band` quedan en `null`.
- Redondeo igual que `scoreV2`: medias sin redondear para ponderar nivel 1 y luego `round2`.

## Nota técnica

`lib/methodology/v2-bank.ts` usa el alias `@/` e importa JSON sin atributos, y `node --experimental-strip-types` no lo resuelve. La prueba lee los mismos archivos de `content/methodology/v2/` con `fs`.
