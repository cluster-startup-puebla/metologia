# Entendimiento del sistema de diagnóstico Puebla–Tlaxcala

Documento de especificación para implementar después el cálculo. Sintetiza los 15 Markdown convertidos con pandoc desde los `.docx` originales. Esos originales no se modificaron. Los Markdown de cada instrumento son la transcripción fiel; este archivo es la lectura operativa.

Si un puntaje, peso o regla no aparece citado aquí, no está escrito en los documentos. No se rellena.

Fuentes:

- `01-metodologia/reporte-metodologico-consolidado.md` (en adelante, **Reporte**).
- `01-metodologia/tabulador-evaluacion-nivel-2.md` (en adelante, **Tabulador**).
- `02-instrumento-nivel1/instr-diag-regional-web-n1-n2-v2.md` (en adelante, **N1**).
- `03-instrumento-nivel2/<sector>.md` (en adelante, **N2** del sector).

---

## Lectura para implementar

El modelo que sí está en los textos es este: **toda unidad económica contesta el Nivel 1**, y dentro de ese Nivel 1 la pregunta `F0.2` elige **un solo sector de 12**. Esa respuesta abre **únicamente** el instrumento Nivel 2 de ese sector. No se llenan los otros once.

La hipótesis «al lanzar se elige un sector y ese es el formulario; además todos ven el Nivel 1» queda **confirmada en el fondo y corregida en el mecanismo**: la elección de sector no es una pantalla previa al Nivel 1. Es el reactivo `F0.2` del Módulo 0 del Nivel 1. El orden más consistente con el texto es Nivel 1 y después el Nivel 2 del sector. Queda **ambiguo** si el Nivel 2 se abre en cuanto se contesta `F0.2` o hasta enviar todo el Nivel 1. N1, encuadre y «Matriz paramétrica de enrutamiento», dice las dos cosas: «apertura inmediata» del Nivel 2 y, más abajo, cálculo de índices «una vez enviado el formulario».

Conteos de reactivos atómicos (cada fila de una matriz Likert cuenta como un reactivo):

| Capa | Reactivos |
| --- | ---: |
| Nivel 1 (formulario web v3.0) | **46** |
| Nivel 2, un sector | **14 a 20** |
| Nivel 2, suma de los 12 instrumentos | **191** |
| Lo que contesta una empresa (N1 + un N2) | **60 a 66** |

La cifra de ~18 **no coincide** con el formulario vigente. Lo más cercano es la longitud de un solo Nivel 2 (médico tiene 14, automotriz 20, el resto 15 o 16) o la encuesta ejecutiva que el Reporte describe aparte (`P00` más `P01`–`P20` = 21 reactivos) y que **no es** el cuestionario convertido.

Fórmula que el Tabulador declara para el Nivel 2, en una línea:

`ISMS = 0.60 × (Σ puntos obtenidos / Σ puntos máximos) × 100 + 0.40 × Borda_Score`

Esa línea **no es ejecutable tal cual**: `Borda_Score` es un solo número y el documento solo define el puntaje de cada factor ordenado, con una fórmula distinta a la del Reporte. El Nivel 1 **no entra** a ese ISMS. Se reporta con otros índices. Ver secciones F y H.

---

## A. Propósito y para quién es

El sistema diagnostica empresas y el entorno de la región **Puebla–Tlaxcala**. El Reporte lo nombra «Modelo Híbrido de Diagnóstico Regional-Empresarial» y «Sistema de Diagnóstico Integrado de Doble Nivel de Resolución» (Reporte, secciones 1 y 2). El N1 se presenta como «puerta de entrada digital (Nivel 1 General)» con tres funciones: caracterizar a la unidad económica, auditar precondiciones del entorno, y enrutar al Nivel 2 del sector (N1, «Encuadre regional y arquitectura de enrutamiento»).

El público del formulario no está limitado a PyME. `F0.1` clasifica micro (1–10), pequeña (11–50), mediana (51–250) y **grande (más de 250)**, con códigos `M1`–`M4`, no con puntos (N1, Módulo 0). El Reporte habla de PyMEs cuando describe bienes de club y la indivisibilidad del capital (Reporte, Fase 5 y recomendaciones). El instrumento acepta los cuatro estratos.

El resultado esperado, según los textos, es un perfil y una hoja de ruta a 6 y 12 meses: cuadrante de madurez, intervenciones y, en el marco del Reporte, bienes de club. Eso es producto de política industrial y acompañamiento, no un índice de competitividad nacional calculado dentro del formulario.

Hay dos descripciones de «Nivel 1» que no son el mismo cuestionario:

1. El archivo convertido: formulario web versión 3.0, módulos 0 a 6, 46 reactivos.
2. El Reporte, sección 4.1: «Encuesta de Opinión Ejecutiva de Nivel 1», 20 a 25 minutos, filtro `P00` y veinte preguntas `P01`–`P20` en bloques A–D. El Reporte resume los temas. **No transcribe** el enunciado ni las opciones de `P01`–`P20`. Esas 21 preguntas no se catalogan aquí como banco implementable.

La implementación debe tomar el formulario web (fuente 1). La encuesta `P00`–`P20` queda como diseño descrito, sin ítems utilizables.

---

## B. Nivel 1 y Nivel 2

### Qué es cada nivel

**Nivel 1** es el filtro general de entorno, ecosistema y capacidades de la empresa, común a todos los sectores. El Reporte lo define como «Diagnóstico institucional, ecosistema y entorno macro/meso» y lo asocia a las fases 1, 2 y 3: Estado de Derecho, complejidad regional (VCR, ICE, ICPO, densidad) y ecosistema de innovación (Reporte, arquitectura de 5 fases). El formulario web no pide capturar VCR ni ICE como números: esas métricas aparecen como marco. Lo que el usuario contesta son percepción, perfil y enrutamiento.

**Nivel 2** es la auditoría de piso de planta y cadena del sector. El Reporte la llama Fase 4: absorción tecnológica, ranking Borda, instrumento sectorial, y referencias a Aghion y a las 5 fuerzas de Porter (Reporte, Fase 4). El Tabulador la operacionaliza como Índice Sintético de Madurez Sectorial (ISMS, 0–100) y cuadrante.

La Fase 5 del Reporte cruza «Índice de Madurez Operativa» contra «Índice de Complejidad Específica» en cuatro cuadrantes. Eso es un **cruce de dos ejes**, no una suma de Nivel 1 y Nivel 2.

### Cómo se elige el sector

`F0.2` pregunta en cuál de 12 sectores se concentra la mayor proporción de la facturación bruta anual en Puebla–Tlaxcala. El microcopy dice: «Respuesta crítica de enrutamiento: determina la apertura inmediata del formulario de auditoría profunda de Nivel 2 correspondiente» (N1, Módulo 0). La tabla final del N1 repite la regla: según `F0.2` (en esa tabla el código aparece también como `[A02]`, distinto de `F0.2`) se abre un solo archivo de Nivel 2.

Códigos de módulo, en el mismo orden del N1 y del Tabulador:

| Sector en `F0.2` | Código | Archivo Markdown |
| --- | --- | --- |
| 01 Automotriz, autopartes, BIW y electrónica SDV | `MOD-AUTO-N2` | `automotriz.md` |
| 02 Agroindustria, alimentos y bebidas | `MOD-AGRO-N2` | `agroindustria.md` |
| 03 Plásticos, polímeros y envase | `MOD-PLAST-N2` | `plasticos.md` |
| 04 Metalmecánica, CNC y pailería | `MOD-METAL-N2` | `metalmecanica.md` |
| 05 Textil, confección y textiles técnicos | `MOD-TEXT-N2` | `textil.md` |
| 06 Muebles, madera e ingeniería RTA | `MOD-MUEB-N2` | `muebles.md` |
| 07 Turismo, gastronomía y hospitalidad | `MOD-TUR-N2` | `turismo.md` |
| 08 Dispositivos médicos y salud | `MOD-MED-N2` | `medico-hospitalario.md` |
| 09 Construcción, prefabricados e infraestructura | `MOD-CONST-N2` | `construccion.md` |
| 10 Logística, transporte y cadena de suministro | `MOD-LOG-N2` | `logistica.md` |
| 11 Artes gráficas, impresión y empaque | `MOD-GRAF-N2` | `artes-graficas.md` |
| 12 Startups, TICs y software | `MOD-TIC-N2` | `tics-startups.md` |

### Orden de aplicación

1. Todos entran al Nivel 1.
2. En el Módulo 0 se elige el sector (`F0.2`).
3. Se aplica el Nivel 2 de ese sector y de ningún otro.
4. El tablero de Nivel 1 (seis índices más brecha IB) y el tablero de Nivel 2 (ISMS o matriz de dos ejes del propio instrumento) se calculan por separado. Ningún documento define un índice único `f(N1, N2)`.

Queda ambiguo el momento exacto en que aparece el Nivel 2: la frase «apertura inmediata» puede leerse como salto al terminar `F0.2`, y el wizard «Paso 3 de 7» más el cálculo «al enviar» pueden leerse como Nivel 1 completo y después Nivel 2. Decisión abierta H1.

### Los «13 instrumentos» del Reporte

El Reporte, Fase 4, enumera **13** instrumentos y parte automotriz en dos: «Automotriz V1 (piso de planta y sourcing)» y «Automotriz V2 fusionada (carrocerías BIW / CAx y electrónica SDV / SMT)». El Tabulador, el N1 y la carpeta traen **12** archivos. El único `automotriz.md` cubre calidad VDA/IATF, sourcing T-MEC, corredor y electromovilidad (secciones II a IV de ese archivo). En disco, V1 y V2 están fusionados en un solo instrumento. No hay un decimotercer cuestionario que convertir.

---

## C. Sectores y qué cambia entre ellos

Los 12 sectores son los de la tabla anterior. No hay un decimotercer archivo.

**No son las mismas preguntas con ponderadores distintos.** Comparten un esqueleto y cambian enunciados, factores, opciones y, cuando existen, las escalas de puntos.

Esqueleto que se repite:

| Bloque | Contenido | ¿Mismo texto en los 12? |
| --- | --- | --- |
| Módulo 0 | Eslabón de la cadena y ubicación | No. Cambia el texto. A veces hay una tercera pregunta (ambiental o equipamiento). Automotriz tiene 2; textil, metalmecánica, plásticos, turismo, logística y construcción tienen 3. |
| Sección I | Tres rankings Borda: piso de planta, materias primas, servicios | No. Casi siempre 8 + 6 + 6 factores, con redacción del sector. Turismo nombra el de insumos `R00-TUR-SOURCING-IN`. |
| Sección II | Auditoría técnica, normalmente 4 reactivos | No. Automotriz parte esto en calidad (`QA01`–`QA05`), sourcing (`SC01`–`SC04`) y mercados (`OP01`–`OP03`). |
| Sección III | Salto de complejidad / «fruta madura» | No. En construcción y médico, dos de estos reactivos no traen puntos y usan casillas. |
| Sección IV | Bienes de club, normalmente 3 reactivos | No. |
| Cierre | Matriz de cuatro cuadrantes y acta | Narrativa distinta. Automotriz no usa los rangos ISMS; usa cuatro perfiles sin puntos de corte. |

El **60% / 40%** del Tabulador y los cortes **0–39, 40–59, 60–79, 80–100** se declaran iguales para los 12 (Tabulador, secciones 1, 2 y cierre: «aplica de manera universal»). Lo que no es universal es el puntaje escrito en cada opción. Hay instrumentos **sin ningún punto** en las opciones: agroindustria completa y logística completa. Ahí el ISMS no se puede calcular con los números del propio instrumento.

Escalas que sí están escritas, según el sector (el número es el `Score` de cada opción, en el orden del documento):

| Sector | Escala en reactivos con `Score` | Reactivos sin número |
| --- | --- | --- |
| Artes gráficas | 25, 50, 75, 100 en técnica, complejidad y club | Perfilado `AG-01`, `AG-02` y los tres Borda |
| TICs / startups | 25, 50, 75, 100 en técnica, complejidad y club | Perfilado y Borda |
| Textil | Mezcla 25/50/75/100 y 0/33/66/100 | `TX-02` (territorio) y Borda |
| Muebles | Igual que textil | `MB-02` y Borda |
| Turismo | 0/33/66/100 en varios; códigos `HOS`,`GAS`,`TOU`,`MIC` y `R1`–`R4`; etiquetas «Fruta Madura 1…4» y «Apuesta 1…4» | Borda. Esos códigos no son puntos |
| Médico | `M1`–`M4` y `R1`–`R4` en perfil; 25/50/75/100 en `MD-01`–`MD-04`; 0/33/66/100 en dos club; 0/50/100 en `COL-MED03` | Borda y `CP-MED-01`, `CP-MED-02` |
| Construcción | 1, 2, 3, 4 en la mayoría; `CN-02` es 1, 2, 3, 4, **5** | Borda y `CP-CN-01`, `CP-CN-02` |
| Metalmecánica | Eslabón 25, 22, 20, 18; territorio con códigos `ZMPT`, `CIX-TLAX`, `HUE-TEX`, `TEH`; varios 5, 12, 20, 25; complejidad `FM-01`…`FM-04` y `AP-01`…`AP-04` | Borda |
| Plásticos | Eslabón 25, 20, 18, 22; territorio `ZMPT`, `TEX-HUE`, `CIX-TLAX`, `TEH`; varios 5, 12, 20, 25; `FM-0x` y `AP-0x` | Borda |
| Automotriz | Casi todos 1 a 4. Excepciones no monótonas: `A01` = 4, 3, 2, 2; `OP01` = 3, 4, 3, 4, 2. Club en orden 4, 3, 2, 1. `COL02` y `COL03` incluyen la opción «No aplica» con **1 pt** | `A02` (corredor) y Borda |
| Agroindustria | Ninguna opción trae `Score` | Todo el instrumento |
| Logística | Ninguna opción trae `Score` | Todo el instrumento |

El mínimo de varias escalas **no es 0**. En artes gráficas la peor opción técnica vale 25, no 0. En metalmecánica y plásticos el peldaño bajo de la escala 5/12/20/25 vale 5. En automotriz el peldaño bajo vale 1. Eso cambia el piso del `Score_Tecnico` si se usa la fórmula del Tabulador sobre esas opciones.

---

## D. Dimensiones, ejes y pesos

No existe una tabla única que asigne un porcentaje a cada bloque temático del Nivel 1 y del Nivel 2. Hay tres capas de pesos, y no se combinan en una sola fórmula.

### D.1 Nivel 2 según el Tabulador (sí hay porcentaje)

Fuente: Tabulador, sección 1, recuadro «Sistema metodológico de ponderación».

| Componente | Peso en el ISMS | Regla escrita |
| --- | ---: | --- |
| Preguntas técnicas de selección única | **60%** | `Score_Tecnico = (Puntos_Obtenidos / Puntos_Maximos) × 100` |
| Rankings Borda `R00` | **40%** | `Borda_Score_i = ((N − Rango_i + 1) / N) × 100`, y luego un solo `Borda_Score_Sourcing_y_Operaciones` dentro del ISMS |

Dentro del 60% **no hay** peso por pregunta ni por sección II / III / IV. La fórmula de suma sobre máximo hace que una pregunta pese en proporción a su puntaje máximo. Si todas las incluidas tienen el mismo máximo, pesan igual. En construcción, `CN-02` tiene máximo 5 y el resto de las puntuadas tiene máximo 4: si ambas entran al numerador, `CN-02` pesa más. El Tabulador no dice si el perfilado entra al 60%.

El 40% nombra «sourcing y operaciones». Cada instrumento tiene **tres** rankings (producción, materiales, servicios). El texto no dice si el tercero entra, ni cómo se vuelven un solo número. Ver F.3 y H2.

### D.2 Ejes cualitativos dentro de cada Nivel 2 (sin porcentaje)

La sección V de casi todos los N2 ubica a la empresa en un cruce de dos índices **nombrados**, sin fórmula ni corte numérico de «bajo / medio / alto». Ejemplos:

| Sector | Eje que el propio N2 llama de madurez | Eje que el propio N2 llama de complejidad | Fuente |
| --- | --- | --- | --- |
| Agroindustria | Inocuidad `FS-01` a `FS-04` | Complejidad `CP-01` a `CP-03` | N2 agro, sección V |
| Artes gráficas | Color `AG-TECH-01` a `AG-TECH-04` | Empaque `CP-AG-01` a `CP-AG-03` | N2 artes, sección V |
| TICs | Arquitectura `TC-TECH-01` a `04` | Propiedad intelectual `CP-TC-01` a `03` | N2 tics, sección V |
| Turismo | Sanitaria y digital `TG-TECH-01` a `04` | Complejidad `CP-TG-01` a `03` | N2 turismo, sección V |
| Médico | Regulatorio `MD-01` a `MD-04` | Biomédico `CP-MED-01` a `CP-MED-02` | N2 médico, sección V |
| Construcción | Normativa `CN-TECH-01` a `04` | Sustentabilidad `CP-CN-01` a `03` | N2 construcción, sección V |
| Logística | Seguridad `LG-TECH-01` y `LG-TECH-03` | Tecnología `LG-TECH-02`, `LG-TECH-04`, `CP-LG-01`, `CP-LG-02` | N2 logística, sección V |

Logística es el único que **parte** la sección técnica entre los dos ejes. Los bienes de club no entran a ese cruce en los textos citados. Automotriz, sección VI, no usa este cruce: lista cuatro perfiles (brecha VDA, obsolescencia ICE, cuello CQI, asimetría de capital) sin rango numérico y sin decir que sean excluyentes.

Esos cruces **no son** el ISMS del Tabulador. Convivien dos dictámenes de Nivel 2 sin regla de prioridad. Decisión abierta H4.

### D.3 Nivel 1: seis índices, sin porcentaje entre ellos

Fuente: N1, «Especificación del motor de procesamiento». No hay un séptimo índice que los promedie, ni pesos 10/20/30 entre ellos.

| Índice | Reactivos | Qué dice la fórmula |
| --- | --- | --- |
| `SEN` Score de Entorno Normativo | `EN1`–`EN6` | Promedio aritmético de la escala 1–7, luego `[(Promedio − 1) / 6] × 100`. Esta es la única fórmula de Nivel 1 cerrada. |
| `SEI` Score de Ecosistema Innovador | `ECO1`–`ECO6` | «Promedio de Inputs (`ECO1`–`ECO4`) y Outputs (`ECO5`–`ECO6`) en base 100». No dice si es el promedio de los 6 ítems o el promedio de dos promedios de grupo. En el segundo caso, cada output pesa el doble que cada input. |
| `ITC` Índice de Tracción Comercial | `R01`–`R05` | «Suma ponderada». **No hay pesos ni puntos por opción.** |
| `IMN` Índice de Madurez Normativa | `R06`–`R10` | «Ponderación». **No hay pesos ni puntos por opción.** |
| `ICA` Capacidad de Absorción | `R11`–`R15` | «Evaluación». **No hay pesos ni puntos por opción.** |
| `IPC` Potencial Colaborativo | `COL1`–`COL5` y `EXP1`–`EXP4` | «Promedio». No escribe la conversión 1–7 a 0–100. Solo `SEN` trae `(promedio − 1) / 6 × 100`. |

`F0.1`–`F0.5` y `D1`–`D5` **no aparecen** en esa tabla. Se capturan. No tienen índice ni peso.

### D.4 Pesos del modelo híbrido del Reporte (otra capa)

Reporte, sección 5:

`Score Híbrido Final = w_obj × Score_Objetivo + w_per × Score_Percepción`, con `w_obj + w_per = 1`.

El mismo párrafo fija el peso de los datos objetivos en el rango **[0.64, 0.75]** y el de la percepción en **[0.25, 0.36]**, y cita la calibración IMD 64% / 36%. En la frase del rango alto el símbolo escrito es `w_per`, igual que en el rango bajo. Es una errata de notación: el primer rango corresponde a los datos objetivos, porque el texto acaba de decir «peso de los datos objetivos» y porque 0.64 + 0.36 = 1. **No elige un par único** dentro del rango. 0.64/0.36 es la referencia IMD, no una instrucción de «use exactamente 0.64».

`Score_Objetivo` y `Score_Percepción` no se definen como el ISMS ni como `SEN`. El índice de brecha usa percepción contra datos duros externos (IMCO / IMD), no contra el Nivel 2. Ver F.6.

### D.5 Fases del Reporte (marco, no ponderación del formulario)

Las cinco fases no traen pesos entre sí. La matriz de «datos duros» (Reporte, sección 3) lista variables de fuentes externas: corrupción, incidencia delictiva, VCR, ICE, ICPO, densidad, I+D/PIB, ratio de eficiencia, OEE, PPM, empleo IMSS, ROIC. Esas variables **no son campos del formulario**, salvo cuando un reactivo de Nivel 2 describe bandas en texto (por ejemplo OEE en `QA04` de automotriz, como opción, no como número tecleado).

---

## E. Catálogo de preguntas

### Regla de identificadores

Se asignan en el orden del documento, sin reordenar por tema.

- Nivel 1: `N1-01` … `N1-46`. Se conserva el código fuente (`F0.1`, `EN3`, `R07`).
- Nivel 2: `N2-{SECTOR}-{nn}` con sector `AGRO`, `GRAF`, `AUTO`, `CONST`, `LOG`, `MED`, `METAL`, `MUEB`, `PLAST`, `TEXT`, `TIC`, `TUR`. Se conserva el `sourceId`.

El mismo `sourceId` se repite entre sectores. `AG-01` es el eslabón agroindustrial y también el eslabón de artes gráficas. El identificador estable lleva el sector.

### E.0 Conteo

| Instrumento | Reactivos | De ellos, rankings Borda |
| --- | ---: | ---: |
| N1 | 46 | 0 (hay selección y Likert; no hay drag-and-drop) |
| Agroindustria | 15 | 3 |
| Artes gráficas | 15 | 3 |
| Automotriz | 20 | 3 |
| Construcción | 16 | 3 |
| Logística | 16 | 3 |
| Médico hospitalario | 14 | 3 |
| Metalmecánica | 16 | 3 |
| Muebles | 16 | 3 |
| Plásticos | 16 | 3 |
| Textil | 16 | 3 |
| TICs / startups | 15 | 3 |
| Turismo | 16 | 3 |
| **Suma N2** | **191** | **36** |

Una aplicación real suma 46 + los reactivos de un solo sector.

### E.1 Catálogo Nivel 1

Fuente única: N1. Tipos: `seleccion_unica`, `likert_7`. Ninguna opción de Nivel 1 trae puntos, salvo los códigos de estrato `M1`–`M4`, que no son puntos. La escala Likert es 1 a 7 en los cuatro bloques que la usan. El Reporte, sección 4.1, dice que las opciones cualitativas de la encuesta ejecutiva se estandarizan a 0–100 con Likert de 7 niveles (0 = máxima restricción, 100 = excelencia). Esa frase aplica a la encuesta `P01`–`P20`, no escribe la equivalencia de `D1`, `R02` u otras selecciones del formulario web.

#### Perfilado — Módulo 0 — sin índice

**N1-01 · `F0.1`** · selección única · bloque `perfilado`.  
¿En qué estrato de tamaño y personal ocupado total se clasifica su unidad económica?

1. `M1` — Microempresa: 1 a 10 colaboradores directos.
2. `M2` — Pequeña empresa: 11 a 50.
3. `M3` — Mediana empresa: 51 a 250.
4. `M4` — Grande empresa: más de 250.

**N1-02 · `F0.2`** · selección única · bloque `enrutamiento`.  
¿En cuál de los 12 sectores concentra la mayor proporción de su facturación bruta anual en Puebla–Tlaxcala?  
Opciones: los 12 sectores de la sección C, con destino `MOD-*-N2`. Sin puntos. Dispara un solo Nivel 2.

**N1-03 · `F0.3`** · selección única · bloque `perfilado`.  
¿Cuál es la actividad económica principal?

1. `MAN` — Manufactura / producción física.
2. `SER` — Servicios intensivos en conocimiento (KISA).

Lógica escrita: activa redacción industrial o de servicios en los módulos 2, 3 y 4.

**N1-04 · `F0.4`** · selección única · bloque `perfilado`.  
¿Cuál es su modelo de negocio y canal dominante?

1. `B2B` — Empresa a empresa.
2. `B2C` — Empresa a consumidor.

Lógica escrita: personaliza términos de venta en `R01`.

**N1-05 · `F0.5`** · selección única · bloque `perfilado`.  
¿Cuál es el alcance geográfico actual y meta a 24 meses?

1. `LOC` — Mercado local, regional o nacional.
2. `EXP` — Exportación / cadenas globales.

Lógica escrita: «gobierna la activación de preguntas sobre aranceles, aduanas, reglas de origen y estándares de exportación». En el formulario convertido **no hay** un bloque distinto de aranceles que se prenda o se apague. Queda sin ancla. Decisión abierta H12.

#### Fricciones — Módulo 1 — sin índice en la tabla de los seis

Escala de cada uno: selección única. No entran a `SEN`, `SEI`, `ITC`, `IMN`, `ICA` ni `IPC`.

**N1-06 · `D1`**. Principal obstáculo en los últimos 12 meses:

1. Falta de demanda, pérdida de clientes o ventas insuficientes.
2. Falta de liquidez, cobro lento (60 a 120 días) o falta de crédito.
3. Escasez de técnicos u operarios, o alta rotación.
4. Maquinaria obsoleta o falta de digitalización.
5. Costo, fallas o falta de energía eléctrica o agua.
6. Inseguridad en carreteras, robo a transporte o sobrecostos de custodia.
7. Falta de certificaciones, permisos o trabas de inspección.
8. Competencia desleal de informales o importados de bajo costo.

**N1-07 · `D2`**. Costo o pérdida por ese obstáculo, como proporción de la facturación:

1. Menos del 1% de las ventas.
2. Entre 1% y 3%.
3. Entre 3% y 5%.
4. Más del 5%.
5. Hay pérdida clara, no cuantificada contablemente.

**N1-08 · `D3`**. Plazo para resolverlo:

1. Menos de 3 meses.
2. Entre 3 y 12 meses.
3. Entre 1 y 2 años.
4. Problema crónico, sin plazo.

**N1-09 · `D4`**. Proyectos de inversión en los últimos 24 meses:

1. Se ejecutaron conforme a lo planeado.
2. Se ejecutaron a menor escala o presupuesto.
3. Están detenidos por incertidumbre o liquidez.
4. Fueron cancelados.
5. No se contempló ningún proyecto.

**N1-10 · `D5`**. Condición que activaría la siguiente inversión:

1. Contrato u orden de compra en firme.
2. Crédito o factoraje accesible.
3. Certificación técnica indispensable para cotizar.
4. Seguridad física en traslados y certidumbre en tarifas de energía.
5. Simplificación de permisos.

#### Entorno — Módulo 2 — índice `SEN`

Instrucción del módulo: Likert 7 puntos. 1 = totalmente en desacuerdo / obstáculo severo. 4 = neutral. 7 = totalmente de acuerdo / facilitador excelente. Cada afirmación es un reactivo.

| ID | Fuente | Afirmación (texto del N1) |
| --- | --- | --- |
| N1-11 | `EN1` | Las normas fiscales, ambientales, laborales y de zonificación son claras, estables y permiten planear inversiones a largo plazo. |
| N1-12 | `EN2` | El marco legal y los juzgados locales son imparciales, confiables y rápidos para hacer cumplir contratos. |
| N1-13 | `EN3` | Los costos de seguridad (guardias, cámaras, GPS, seguros) no representan un sobrecosto excesivo. |
| N1-14 | `EN4` | La empresa opera sin inspecciones discrecionales, clausuras arbitrarias ni pagos informales. |
| N1-15 | `EN5` | Los trámites estatales y municipales están digitalizados y se resuelven con agilidad. |
| N1-16 | `EN6` | El clima institucional incentiva a reinvertir utilidades aquí en lugar de mudarse. |

#### Ecosistema — Módulo 3 — índice `SEI`

Likert 7. 1 = nula o inexistente. 7 = excelente y continua. El texto marca `ECO1`–`ECO4` como inputs y `ECO5`–`ECO6` como outputs.

| ID | Fuente | Afirmación |
| --- | --- | --- |
| N1-17 | `ECO1` | Las universidades y escuelas técnicas preparan el personal que la empresa necesita y facilitan educación dual o estadías. |
| N1-18 | `ECO2` | Hay laboratorios de prueba, metrología o plantas piloto accesibles. |
| N1-19 | `ECO3` | Hay fondos, subsidios o estímulos fiscales disponibles para modernización o equipo. |
| N1-20 | `ECO4` | Cámaras o clústeres generan negocio, compras consolidadas y transferencia entre asociados. |
| N1-21 | `ECO5` | En los últimos 2 años hubo proyectos tecnológicos conjuntos con universidades o centros que mejoraron procesos o productos. |
| N1-22 | `ECO6` | La empresa puede o quiere colaborar, contratar o comprar a emprendedores o empresas de base tecnológica local. |

#### Tracción, norma y absorción — Módulo 4

`R01` está marcado «adaptativo según `F0.1` / `F0.2`» en el encabezado del componente, y las lógicas de `F0.3` y `F0.4` dicen que ellas personalizan módulos y `R01`. Esas dos instrucciones no coinciden. Decisión abierta H12.

**N1-23 · `R01`** · `ITC` · selección. Principal barrera para cerrar ventas. El documento lista cuatro textos condicionados, no cuatro opciones siempre visibles:

1. Para `MAN`: no cumplir tolerancias, pruebas de laboratorio o capacidad de planta.
2. Para `SER`: falta de ISO 27001, experiencia demostrable o tiempos de respuesta.
3. Para `B2B`: costo y burocracia de portales de homologación.
4. Para `B2C`: costo de adquisición de clientes o saturación de canales.

Una empresa es `MAN` o `SER`, y además `B2B` o `B2C`. El documento no dice si debe elegir una sola de las cuatro o ver solo las que coinciden con su perfil.

**N1-24 · `R02`** · `ITC`. Porcentaje de cotizaciones perdidas por certificación o plazo:

1. Menos del 5%.
2. Entre 6% y 15%.
3. Entre 16% y 30%.
4. Más del 30%.

**N1-25 · `R03`** · `ITC`. Tiempo hasta la primera orden en firme:

1. Menos de 1 mes.
2. De 1 a 3 meses.
3. De 4 a 6 meses.
4. Más de 6 meses.

**N1-26 · `R04`** · `ITC`. Porcentaje de ventas en los tres principales clientes:

1. Menos del 25%.
2. Entre 26% y 50%.
3. Entre 51% y 75%.
4. Más del 75%.

**N1-27 · `R05`** · `ITC`. Base de competencia:

1. Guerra de precios.
2. Diferenciación y calidad.

**N1-28 · `R06`** · `IMN`. Dominio de normas del mercado objetivo:

1. Desconocimiento total.
2. Conocimiento reactivo, solo cuando un cliente condiciona la orden.
3. Dominio proactivo, con auditorías internas.

**N1-29 · `R07`** · `IMN`. Estatus de certificaciones de tercera parte:

1. Certificaciones vigentes.
2. En proceso, avance superior al 50%.
3. Calidad empírica, sin certificado oficial.
4. Sin certificación y sin capacidad de costearla.

**N1-30 · `R08`** · `IMN`. Trazabilidad del origen de insumos:

1. Automatizada (ERP / código de barras).
2. Documental o manual.
3. Débil o nula.

**N1-31 · `R09`** · `IMN`. Dependencia de insumos importados:

1. Sin vulnerabilidad: insumos locales y proveedores diversificados.
2. Moderada: 1 o 2 insumos importados con sustituto nacional.
3. Crítica: un freno en aduana detiene la empresa.

**N1-32 · `R10`** · `IMN`. Dónde rendiría más un apoyo de cumplimiento:

1. Pruebas de laboratorio y ensayos.
2. Consultoría en planta para no conformidades y auditorías.
3. Marcas, patentes o códigos de barras en el mercado destino.
4. Capacitación en sustentabilidad, huella de carbono y ESG.

**N1-33 · `R11`** · `ICA`. Si un cliente ofrece duplicar el volumen en 90 días:

1. Aceptación inmediata: hay capacidad ociosa.
2. Aceptación con ajustes: subcontrato u horas extra.
3. Rechazo: la planta está al 100%.

**N1-34 · `R12`** · `ICA`. Digitalización:

1. ERP/CRM en la nube, EDI y pagos SPEI.
2. Software en silos, desconectado de planta y de clientes.
3. Control en hojas de cálculo o papel.

**N1-35 · `R13`** · `ICA`. Escasez de talento:

1. Sin problema.
2. Operadores técnicos y maquinistas.
3. Automatización y datos.
4. Ventas técnicas y comercio exterior.

**N1-36 · `R14`** · `ICA`. Barrera financiera para contratos mayores:

1. Ninguna: hay flujo o líneas bancarias.
2. Falta de factoraje para plazos de 60 a 120 días.
3. Falta de garantías colaterales.
4. Tasas de interés que hacen inviable el equipo.

**N1-37 · `R15`** · `ICA`. Proyecto de mayor salto en 6 meses:

1. ERP/CRM modular.
2. Lean manufacturing.
3. Cerrar la auditoría de la certificación indispensable.
4. Encuentro de negocios con compradores ancla.

#### Colaboración — Módulo 5 — índice `IPC`

Likert 7. 1 = rechazo total / desconfianza absoluta. 7 = totalmente dispuesto / prioridad estratégica.

| ID | Fuente | Afirmación |
| --- | --- | --- |
| N1-38 | `COL1` | Compras conjuntas y fletes consolidados. |
| N1-39 | `COL2` | Cuota para un laboratorio, centro de maquinado o sala limpia compartida. |
| N1-40 | `COL3` | Sustituir compra de maquinaria o licencias por pago por uso. |
| N1-41 | `COL4` | Sumar capacidad a una marca o consorcio para contratos que no puede surtir sola. |
| N1-42 | `COL5` | Operar eso bajo fideicomiso neutral con mediación de universidades o clústeres. |

#### Expansión — Módulo 6 — índice `IPC`

Likert 7. 1 = sin capacidad / totalmente descartado. 7 = totalmente preparado / estrategia diseñada.

| ID | Fuente | Afirmación |
| --- | --- | --- |
| N1-43 | `EXP1` | Tiene identificados productos más complejos fabricables en menos de 12 meses con la maquinaria actual. |
| N1-44 | `EXP2` | Si hubiera financiamiento y laboratorios, podría reconvertirse a industrias de alta tecnología. |
| N1-45 | `EXP3` | Tiene estrategia para vender en mercados internacionales o e-commerce transfronterizo. |
| N1-46 | `EXP4` | Tiene estados financieros auditados y gobierno corporativo listos para capital privado o coinversión extranjera. |

El catálogo completo de Nivel 2, con cada opción y el puntaje escrito, está en la sección E.2.

## E.2 Catálogo Nivel 2 por sector

Identificador estable: `N2-{SECTOR}-{nn}` en el orden en que el reactivo aparece en el instrumento. `sourceId` es el código original. `score: null` significa que esa opción no trae puntos en el documento.

Los reactivos de complejidad de construcción (`CP-CN-01`, `CP-CN-02`) y médico (`CP-MED-01`, `CP-MED-02`) usan casillas y no dicen «ordene». Se catalogan como selección sin puntaje. El enunciado pregunta en singular («¿hacia cuál…?»). No son Borda.


### Sector agroindustria (`AGRO`) — 15 reactivos

Fuente: `docs/metodologia/03-instrumento-nivel2/agroindustria.md`.

#### N2-AGRO-01 · `AG-01`

- Sección de origen: MÓDULO 0: PERFILADO DEL ESLABÓN Y LOCALIZACIÓN TERRITORIAL
- Bloque: `perfilado`
- Tipo: `seleccion_unica`
- Enunciado: Eslabón Dominante en la Cadena Agroalimentaria
- Opciones:
  1. `null` — Producción Primaria y Empaque Fresco en Origen: Horticultura, fruticultura o granjas tecnificadas con empaque básico y selección.
  2. `null` — Procesamiento Primario y Transformación Básica: Deshidratado convencional, molienda, pasteurización, descabezado, congelado simple o tostado.
  3. `null` — Transformación Avanzada y Alimentos Procesados de Alto Valor: Extracción de aceites esenciales, liofilización, alimentos funcionales, conservas retortables, embutidos y confitería especializada.
  4. `null` — Proveeduría de Insumos y Servicios Críticos: Almacenamiento frigorífico, formulación de empaques barrera, ingredientes activos, biofertilizantes o logística en frío.

#### N2-AGRO-02 · `AG-02`

- Sección de origen: MÓDULO 0: PERFILADO DEL ESLABÓN Y LOCALIZACIÓN TERRITORIAL
- Bloque: `perfilado`
- Tipo: `seleccion_unica`
- Enunciado: Cuenca Territorial y Micro-Región Productiva
- Opciones:
  1. `null` — Región 1: Valles Centrales y ZMPT (Puebla - Tlaxcala - Cholula - Huejotzingo): Agroindustria de alimentos procesados, panificación, bebidas, confitería y logística de distribución.
  2. `null` — Región 2: Tehuacán y Valle de Zapotitlán (ZMTH): Horticultura intensiva, huevo de ave, porcicultura, alimentos balanceados y salsas.
  3. `null` — Región 3: Sierra Norte y Nororiental (Teziutlán, Zacatlán, Cuetzalan): Café de especialidad, cítricos, manzana, berries, pimienta gorda, miel y trucha.
  4. `null` — Región 4: Altiplano Central y Valle de Serdán / Huamantla: Hortalizas a campo abierto y bajo invernadero (brócoli, zanahoria, papa, lechuga, cebolla) y cebada maltera.
  5. `null` — Región 5: Mixteca Poblana y Valle de Atlixco: Flores de corte, hortalizas, cacahuate, destilados de agave (mezcal con DO) y amaranto.

#### N2-AGRO-03 · `R00-AGRO-PROD`

- Sección de origen: SECCIÓN I: ROMPEHIELOS DE JERARQUIZACIÓN DE IMPACTO (MÉTODO DE BORDA)
- Bloque: `borda_r00`
- Tipo: `ranking_borda`; N = 8
- Enunciado: Jerarquización de Fricciones en Procesamiento y Piso de Planta (ROMPEHIELOS DE JERARQUIZACIÓN)
- Pregunta: Instrucción UI / Aplicación Web: Ordene los siguientes factores de 1 al 8 según el impacto económico y gravedad que generan en su operación (1 = Mayor impacto negativo / Máxima gravedad; 8 = Menor impacto).
- Factores o casillas:
  1. Merma post-cosecha y descomposición por fallas o roturas en la cadena de frío (almacenes o transporte).
  2. Paros no programados de línea por averías en calderas, pasteurizadores, autoclaves, llenadoras o túneles IQF.
  3. Lotes retenidos o rechazados por incumplimiento microbiológico o físico-químico (listeria, salmonella, acidez).
  4. Variabilidad extrema en el rendimiento y calidad organoléptica de la materia prima recibida de campo.
  5. Tiempos prolongados de limpieza profunda, sanitización (CIP) y cambio de lote/formato de envasado.
  6. Escasez de técnicos capacitados en inocuidad (HACCP, PCQI), microbiología y mantenimiento electromecánico.
  7. Sobrecostos y cortes intempestivos en energía eléctrica, gas LP/natural o agua de calidad purificada.
  8. Fallas en etiquetado, dosificación o defectos de sellado hermético en empaques primarios (fugas, bolsas infladas).
- Puntos por factor: no están en el instrumento sectorial. Ver fórmulas de Borda en la sección F. El monto en MXN es captura libre y no entra a ninguna fórmula escrita.

#### N2-AGRO-04 · `R00-AGRO-SOURCING`

- Sección de origen: SECCIÓN I: ROMPEHIELOS DE JERARQUIZACIÓN DE IMPACTO (MÉTODO DE BORDA)
- Bloque: `borda_r00`
- Tipo: `ranking_borda`; N = 6
- Enunciado: Jerarquización de Riesgos en Sourcing de Materias Primas Agrícolas (ROMPEHIELOS DE JERARQUIZACIÓN)
- Pregunta: Instrucción UI / Aplicación Web: Ordene los siguientes factores de 1 al 6 según el impacto económico y gravedad que generan en su operación (1 = Mayor impacto negativo / Máxima gravedad; 6 = Menor impacto).
- Factores o casillas:
  1. Dependencia de acopiadores tradicionales o 'coyotes' con márgenes opacos y sin contratos en firme.
  2. Contaminación por trazas de plaguicidas no autorizados o presencia de metales pesados en suelos/agua de riego.
  3. Falta de trazabilidad documental a nivel de parcela o unidad de producción (loteo y bitácoras de campo).
  4. Escasez crítica y estrés hídrico que reduce volúmenes de cosecha y eleva precios de materia prima.
  5. Productores sin certificación en Buenas Prácticas Agrícolas (BPA, PrimusGFS, GlobalGAP).
  6. Volatilidad especulativa en el precio de empaques grado alimenticio (hojalata, vidrio, películas laminadas).
- Puntos por factor: no están en el instrumento sectorial. Ver fórmulas de Borda en la sección F. El monto en MXN es captura libre y no entra a ninguna fórmula escrita.

#### N2-AGRO-05 · `R00-AGRO-SERV`

- Sección de origen: SECCIÓN I: ROMPEHIELOS DE JERARQUIZACIÓN DE IMPACTO (MÉTODO DE BORDA)
- Bloque: `borda_r00`
- Tipo: `ranking_borda`; N = 6
- Enunciado: Jerarquización de Fricciones en Servicios Especializados e Infraestructura (ROMPEHIELOS DE JERARQUIZACIÓN)
- Pregunta: Instrucción UI / Aplicación Web: Ordene los siguientes factores de 1 al 6 según el impacto económico y gravedad que generan en su operación (1 = Mayor impacto negativo / Máxima gravedad; 6 = Menor impacto).
- Factores o casillas:
  1. Carencia de laboratorios locales acreditados ISO/IEC 17025 para residuos de plaguicidas, micotoxinas y patógenos.
  2. Falta de bodegas frigoríficas comunitarias y transporte refrigerado con monitoreo continuo de temperatura.
  3. Altos costos y demoras burocráticas en trámites de inspección y exportación sanitaria (SENASICA / FDA).
  4. Déficit de plantas comunitarias de procesamiento avanzado (secado por aspersión, irradiación, liofilizado).
  5. Escasez de casas certificadoras locales para esquemas internacionales (FSSC 22000, BRCGS, SQF, Kosher, Halal).
  6. Sobrecostos por transporte con custodia armada ante el riesgo delictivo en carreteras regionales.
- Puntos por factor: no están en el instrumento sectorial. Ver fórmulas de Borda en la sección F. El monto en MXN es captura libre y no entra a ninguna fórmula escrita.

#### N2-AGRO-06 · `FS-01`

- Sección de origen: SECCIÓN II: INOCUIDAD, CONTROL DE PROCESO, CADENA DE FRÍO Y TRAZABILIDAD
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Madurez del Sistema de Gestión de Inocuidad Alimentaria
- Opciones:
  1. `null` — Cumplimiento Empírico Básico: Buenas Prácticas de Manufactura (BPM) y NOM-251-SSA1-2009, pero sin plan formal de inocuidad ni registros sistemáticos.
  2. `null` — Sistema HACCP Implementado: Plan de Análisis de Peligros y Puntos Críticos de Control formal con validación técnica, pero sin certificación internacional de tercera parte.
  3. `null` — Certificación GFSI Vigente: Planta certificada bajo esquemas reconocidos internacionalmente (FSSC 22000, BRCGS Food, SQF o IFS) y cumplimiento pleno de la Ley FSMA de EE.UU.
  4. `null` — Grado de Excelencia Global: Certificación GFSI con módulos avanzados de Food Defense (defensa alimentaria), Food Fraud (prevención de fraude alimentario) y auditorías no anunciadas superadas.

#### N2-AGRO-07 · `FS-02`

- Sección de origen: SECCIÓN II: INOCUIDAD, CONTROL DE PROCESO, CADENA DE FRÍO Y TRAZABILIDAD
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Control de Cadena de Frío e Infraestructura Térmica
- Opciones:
  1. `null` — Sin Cadena de Frío Controlada: Manipulación y transporte a temperatura ambiente con mermas por sobremaduración o deterioro microbiológico superiores al 15%.
  2. `null` — Cadena de Frío Parcial / Vulnerable: Cuartos fríos en planta pero transporte en cajas secas con hielo o fletes refrigerados sin registro automatizado (frecuentes picos térmicos).
  3. `null` — Cadena de Frío Continua Monitoreada: Cámaras de pre-enfriado rápido (hidroenfriado, aire forzado), almacenamiento automatizado y transporte refrigerado con dataloggers GPS en tiempo real.
  4. `null` — Infraestructura Criogénica / IQF Avanzada: Túneles de congelación rápida individual (IQF), nitrógeno líquido o liofilizado con control estricto de humedad relativa y merma < 2%.

#### N2-AGRO-08 · `FS-03`

- Sección de origen: SECCIÓN II: INOCUIDAD, CONTROL DE PROCESO, CADENA DE FRÍO Y TRAZABILIDAD
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Trazabilidad Digital Bidireccional y Recall
- Opciones:
  1. `null` — Trazabilidad Manual en Papel: Bitácoras físicas aisladas; una prueba de trazabilidad (mock recall) toma más de 24 horas y no garantiza precisión entre parcela y producto final.
  2. `null` — Trazabilidad Semiautomatizada en ERP: Registro de entrada de materia prima y salida en ERP o software contable, pero con saltos manuales en mezclado y líneas de proceso.
  3. `null` — Trazabilidad Serializada Digital (Código 2D / GS1): Sistema digital integrado con códigos QR/DataMatrix GS1 que vincula insumos agrícolas, parámetros de proceso, lote y anaquel en menos de 1 hora.
  4. `null` — Trazabilidad Blockchain / Cadena Abierta: Integración en plataformas de cadena de suministro (Blockchain / nube abierta) compartida con clientes mayoristas y cadenas de autoservicio.

#### N2-AGRO-09 · `FS-04`

- Sección de origen: SECCIÓN II: INOCUIDAD, CONTROL DE PROCESO, CADENA DE FRÍO Y TRAZABILIDAD
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Tecnología de Empaque y Preservación de Vida de Anaquel
- Opciones:
  1. `null` — Empaque Convencional Básico: Bolsas de polietileno, cajas de cartón estándar o costales sin atmósfera modificada; vida de anaquel menor a 15 días.
  2. `null` — Empaque de Barrera Estándar: Envasado al vacío simple, frascos de vidrio pasteurizados o latas con barniz sanitario; vida de anaquel de 3 a 6 meses.
  3. `null` — Atmósfera Modificada (MAP) y Bolsas Retortables: Inyección de gases protectores (CO2/N2), películas microperforadas antifog o empaques retortables multicapa de alta barrera.
  4. `null` — Empaques Activos, Inteligentes y Biodegradables: Películas con agentes antimicrobianos naturales, absorbedores de etileno/oxígeno o materiales compostables certificados para mercados premium.

#### N2-AGRO-10 · `CP-01`

- Sección de origen: SECCIÓN III: SOFISTICACIÓN PRODUCTIVA Y SALTO EN EL ESPACIO DE PRODUCTOS
- Bloque: `complejidad`
- Tipo: `seleccion_unica`
- Enunciado: Reconversión hacia la 'Fruta Madura' Agroindustrial (Alta Densidad ω_j)
- Opciones:
  1. `null` — Carencia de Proyecto: La empresa planea seguir vendiendo hortalizas a granel o productos tradicionales sin procesamiento adicional.
  2. `null` — Conservas y Preparaciones de Hortalizas/Frutas (VCR potencial alto): Líneas para conservas en vinagre/salmuera, pastas de tomate, purés asépticos y hortalizas congeladas en cubos.
  3. `null` — Azúcar para Confitería, Mermeladas y Almíbares Funcionales: Jarabes de agave, mermeladas bajas en azúcar con pectinas naturales, confitería enriquecida y pulpas pasteurizadas.
  4. `null` — Embutidos y Procesados Cárnicos Certificados TIF: Aprovechamiento de la porcicultura y avicultura de Tehuacán para jamones, salchichas y marinados con valor agregado.

#### N2-AGRO-11 · `CP-02`

- Sección de origen: SECCIÓN III: SOFISTICACIÓN PRODUCTIVA Y SALTO EN EL ESPACIO DE PRODUCTOS
- Bloque: `complejidad`
- Tipo: `seleccion_unica`
- Enunciado: Apuestas Estratégicas de Alto Valor Agregado (Complejidad ICPO)
- Opciones:
  1. `null` — Sin Visión de Alta Complejidad: Foco exclusivo en commodities alimenticios de volumen.
  2. `null` — Extractos Botánicos, Aceites Esenciales y Colorantes Naturales: Extracción de oleorresinas, colorantes a partir de cempasúchil/grana cochinilla o extractos aromáticos de hierbas de la sierra.
  3. `null` — Alimentos Funcionales, Probióticos y Nutracéuticos: Harinas de leguminosas/amaranto enriquecidas, bebidas fermentadas bioactivas (kombucha, kéfir) o proteína vegetal concentrada.
  4. `null` — Liofilizados y Secado Farmacéutico/Alimentario: Frutas, café de especialidad y alimentos deshidratados por sublimación al vacío para raciones militares, outdoor o fórmulas premium.

#### N2-AGRO-12 · `CP-03`

- Sección de origen: SECCIÓN III: SOFISTICACIÓN PRODUCTIVA Y SALTO EN EL ESPACIO DE PRODUCTOS
- Bloque: `complejidad`
- Tipo: `seleccion_unica`
- Enunciado: Valorización de Subproductos y Economía Circular
- Opciones:
  1. `null` — Disposición como Basura o Costo de Flete: Desecho no tratado en tiraderos o drenajes con riesgo de multas ambientales de CONAGUA/PROFEPA.
  2. `null` — Destino como Alimento de Ganado sin Procesar: Venta o entrega gratuita de rastrojo, bagazo o suero a productores pecuarios vecinos.
  3. `null` — Compostaje Estructurado y Biofertilizantes: Transformación aerobia controlada o biodigestores para producción de biogás y abono orgánico certificado.
  4. `null` — Biorrefinería y Extracción de Compuestos Bioactivos: Obtención de pectinas, antioxidantes, polifenoles o fibra dietética a partir de residuos agroindustriales.

#### N2-AGRO-13 · `COL-AG01`

- Sección de origen: SECCIÓN IV: SOLUCIONES COLABORATIVAS ANTE LA FALLA DE ESCALA (BIENES DE CLUB)
- Bloque: `bienes_club`
- Tipo: `seleccion_unica`
- Enunciado: Agroparque y Centro Comunitario de Empaque y Cadena de Frío
- Opciones:
  1. `null` — Desinterés o Desconfianza Absoluta: Prefiere operar exclusivamente con cuartos fríos y bodegas propias.
  2. `null` — Esquema Pay-per-Use en Frío: Interés en contratar espacio refrigerado por tarima/mes y tiempo de pre-enfriado en una instalación común regional.
  3. `null` — Coinversión en Centro de Empaque y Línea Óptica: Disposición a aportar capital o cuotas fiduciarias para cofinanciar calibradoras ópticas y túneles IQF compartidos.
  4. `null` — Gobernanza Fiduciaria Completa: Participación en una empresa integradora o fideicomiso para operar un centro logístico en frío en nodos carreteros clave (Tehuacán / Huamantla / ZMPT).

#### N2-AGRO-14 · `COL-AG02`

- Sección de origen: SECCIÓN IV: SOLUCIONES COLABORATIVAS ANTE LA FALLA DE ESCALA (BIENES DE CLUB)
- Bloque: `bienes_club`
- Tipo: `seleccion_unica`
- Enunciado: Laboratorio Regional Compartido de Análisis de Residuos e Inocuidad
- Opciones:
  1. `null` — Mantenimiento de Esquema Individual Externo: Continuar enviando muestras a laboratorios comerciales en CDMX o Querétaro asumiendo demoras de 5 a 7 días hábiles.
  2. `null` — Convenio de Descuento por Volumen: Integrar una bolsa regional de muestras para negociar tarifas preferenciales con laboratorios acreditados.
  3. `null` — Laboratorio Comunitario Cuádruple Hélice: Alianza formal (Empresas - Universidad - Gobierno del Estado) para equipar un laboratorio de inocuidad en campus universitario local (BUAP / UPAEP / UTT).
  4. `null` — Acreditación y Validación de Exportación In Situ: Aportación activa a un fondo de sostenibilidad para que el laboratorio regional emita certificados reconocidos por SENASICA y FDA.

#### N2-AGRO-15 · `COL-AG03`

- Sección de origen: SECCIÓN IV: SOLUCIONES COLABORATIVAS ANTE LA FALLA DE ESCALA (BIENES DE CLUB)
- Bloque: `bienes_club`
- Tipo: `seleccion_unica`
- Enunciado: Consorcio de Comercialización y Exportación Colectiva
- Opciones:
  1. `null` — Operación Individual Cerrada: Mantener venta a intermediarios o clientes locales pequeños de forma aislada.
  2. `null` — Consolidación de Contenedores de Exportación: Disposición a compartir espacio en contenedores refrigerados para abaratar el flete marítimo/terrestre hacia EE.UU. o Europa.
  3. `null` — Marca Colectiva / Paragua Regional: Integrar productos de alta calidad bajo un sello regional certificado (ej. 'Sabores de Puebla-Tlaxcala') con estándares unificados de calidad.
  4. `null` — Consorcio Formal con Oficina Comercial Externa: Asociación legal en un consorcio exportador que cuente con representación comercial y bodega de distribución en McAllen, Texas o Los Ángeles.


### Sector artes-graficas (`GRAF`) — 15 reactivos

Fuente: `docs/metodologia/03-instrumento-nivel2/artes-graficas.md`.

#### N2-GRAF-01 · `AG-01`

- Sección de origen: MÓDULO 0: PERFILADO DEL ESLABÓN Y LOCALIZACIÓN TERRITORIAL
- Bloque: `perfilado`
- Tipo: `seleccion_unica`
- Enunciado: Eslabón Dominante en la Cadena de Impresión y Empaque
- Pregunta: Pregunta de Evaluación / Jerarquización: ¿En cuál de los siguientes eslabones se concentra la mayor proporción de la facturación y capacidad productiva instalada de su planta?
- Opciones:
  1. `null` — Impresión Comercial y Editorial: Trípticos, folletos, revistas, libros, papelería corporativa y publicidad pliego/rotativa.
  2. `null` — Empaque Plegadizo y Cajas de Cartoncillo: Cajas impresas para industria farmacéutica, agroalimentaria, cosmética y automotriz.
  3. `null` — Cartón Corrugado y Empaque Estructural Pesado: Cajas de cartón corrugado y microcorrugado (flauta B, C, E, F) para transporte y distribución.
  4. `null` — Flexografía y Etiqueta Autoadherible / Envoltorio Flexible: Etiquetas en rollo para botellas, alimentos, químicos y mangas termocontraíbles.
  5. `null` — Impresión Digital de Gran Formato y Promocional POP: Impresión direct-to-substrate, cama plana UV, exhibidores y señalética corporativa.

#### N2-GRAF-02 · `AG-02`

- Sección de origen: MÓDULO 0: PERFILADO DEL ESLABÓN Y LOCALIZACIÓN TERRITORIAL
- Bloque: `perfilado`
- Tipo: `seleccion_unica`
- Enunciado: Cuenca Territorial y Parque Industrial de Ubicación
- Pregunta: Pregunta de Evaluación / Jerarquización: ¿En qué corredor industrial o municipio de la región Puebla - Tlaxcala se localiza la principal planta de producción de su empresa?
- Opciones:
  1. `null` — Zona Metropolitana de Puebla (ZMPT): Parques Industriales 5 de Mayo, Resurrección, Chachapa y naves urbanas en Puebla capital.
  2. `null` — Corredor Huejotzingo - San Martín Texmelucan: Parque Industrial FINSA II, Ciudad Textil y zonas limítrofes con acceso a la Autopista 150D.
  3. `null` — Corredor Industrial Tlaxcala: Ciudades Industriales Xicohténcatl (CIX I Tetla, CIX II Huamantla, CIX III Tlaxco) y Papalotla.
  4. `null` — Cuenca Tehuacán - Ajalpan: Zona Industrial Tehuacán y empresas proveedoras del clúster avícola y alimentario del sur.
  5. `null` — Corredor Amozoc - Tepeaca: Naves sobre la carretera federal Puebla-Veracruz y libramiento sur.

#### N2-GRAF-03 · `R00-GRAF-PROD`

- Sección de origen: SECCIÓN I: ROMPEHIELOS DE JERARQUIZACIÓN DE IMPACTO (MÉTODO DE BORDA)
- Bloque: `borda_r00`
- Tipo: `ranking_borda`; N = 8
- Enunciado: Jerarquización de Fricciones en Impresión y Acabados (Piso de Planta) (Rompehielos de Jerarquización)
- Pregunta: Pregunta de Evaluación / Jerarquización: Ordene del 1 al 8 los siguientes problemas operativos según el impacto económico negativo y la frecuencia con que afectan su planta de impresión
- Factores o casillas:
  1. Variaciones de tono y color entre tirajes (quejas de clientes y repeticiones de tiro).
  2. Tiempos prolongados de ajuste y arreglo en máquina (setup / mermas de arranque elevadas).
  3. Mermas de sustrato por registro defectuoso, repinte o mal secado de tintas.
  4. Cuellos de botella en áreas de acabado (troquelado, doblado, pegado de cajas o enuadernación).
  5. Escasez y rotación de prensistas, operadores CTP y especialistas en acabados.
  6. Paros no programados por fallas mecánicas/electrónicas en prensas o CTP.
  7. Variaciones en el suministro eléctrico o falta de aire comprimido seco.
  8. Descalibración de monitores, software RIP y procesadoras de placas CTP.
- Puntos por factor: no están en el instrumento sectorial. Ver fórmulas de Borda en la sección F. El monto en MXN es captura libre y no entra a ninguna fórmula escrita.

#### N2-GRAF-04 · `R00-GRAF-SOURCING-MAT`

- Sección de origen: SECCIÓN I: ROMPEHIELOS DE JERARQUIZACIÓN DE IMPACTO (MÉTODO DE BORDA)
- Bloque: `borda_r00`
- Tipo: `ranking_borda`; N = 6
- Enunciado: Jerarquización de Riesgos en Sourcing de Papel, Cartón e Insumos (Rompehielos de Jerarquización)
- Pregunta: Pregunta de Evaluación / Jerarquización: Ordene del 1 al 6 los principales cuellos de botella y riesgos en la compra de sustratos, tintas y químicos de impresión
- Factores o casillas:
  1. Volatilidad de precios y desabasto de papel, cartoncillo SBS y bobinas de cartón corrugado.
  2. Tiempos de entrega prolongados (lead times > 8 semanas) en sustratos o películas especiales importadas.
  3. Escasez o sobrecostos en tintas especializadas (grado alimenticio, tintas UV, colores Pantone específicos).
  4. Exigencia de volúmenes mínimos de compra (MOQ) elevados por parte de distribuidores o molinos de papel.
  5. Insumos químicos de solución de fuente, mantillas o placas CTP fuera de especificación.
  6. Falta de certificación FSC / PEFC en distribuidores locales de papel y cartón.
- Puntos por factor: no están en el instrumento sectorial. Ver fórmulas de Borda en la sección F. El monto en MXN es captura libre y no entra a ninguna fórmula escrita.

#### N2-GRAF-05 · `R00-GRAF-SOURCING-SERV`

- Sección de origen: SECCIÓN I: ROMPEHIELOS DE JERARQUIZACIÓN DE IMPACTO (MÉTODO DE BORDA)
- Bloque: `borda_r00`
- Tipo: `ranking_borda`; N = 6
- Enunciado: Jerarquización de Deficiencias en Servicios Especializados e Infraestructura Externa (Rompehielos de Jerarquización)
- Pregunta: Pregunta de Evaluación / Jerarquización: Ordene del 1 al 6 las mayores deficiencias de servicios externos e infraestructura que limitan la competitividad de su empresa en Puebla-Tlaxcala
- Factores o casillas:
  1. Carencia de laboratorios regionales acreditados ISO 17025 para espectrocolorimetría y pruebas Mullen/ECT/BCT.
  2. Escasez de talleres especializados en afilado de cuchillas de guillotina, troqueles rotativos y mantenimiento offset.
  3. Falta de servicios locales de grabado de cilindros anilox/flexografía y grabado láser CTP de alta resolución.
  4. Servicios de acabado externo (barniz UV registradon, hot stamping, grabado) lentos e informales.
  5. Sobrecostos de seguridad y custodia en transporte de empaque terminado por la Autopista 150D y Arco Norte.
  6. Falta de centros regionales de capacitación técnica en gestión de color y operación de prensas.
- Puntos por factor: no están en el instrumento sectorial. Ver fórmulas de Borda en la sección F. El monto en MXN es captura libre y no entra a ninguna fórmula escrita.

#### N2-GRAF-06 · `AG-TECH-01`

- Sección de origen: SECCIÓN II: AUDITORÍA TÉCNICA DE PREPRENSA CTP, GESTIÓN DE COLOR Y EMPAQUE ESTRUCTURAL
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Gestión de Color y Estandarización de Impresión (G7 / ISO 12647)
- Pregunta: Pregunta de Evaluación / Jerarquización: ¿Cuál es el nivel de estandarización en gestión de color, uso de espectrofotómetros y perfiles ICC en su proceso de preprensa e impresión?
- Opciones:
  1. `25 pts` — Ajuste Empírico a Ojo: Visto bueno de color a criterio del prensista en pie de máquina sin medición densitométrica ni espectrofotómetro.
  2. `50 pts` — Medición Densitométrica Básica: Control de densidad de tinta en tira de control, pero sin calibración de curvas de ganancia de punto ni perfiles ICC de prensa.
  3. `75 pts` — Estandarización ISO 12647 / Medición Espectral: Uso regular de espectrofotómetros (X-Rite / Techkon), calibración CTP con perfiles ICC y control de Delta E < 2.5 en tiraje.
  4. `100 pts` — Certificación G7 Master / Estandarización Automatizada: Planta certificada G7 Master o ISO 12647 plena, con espectrofotometría en línea en prensa y pruebas de color digital probadas de contrato.

#### N2-GRAF-07 · `AG-TECH-02`

- Sección de origen: SECCIÓN II: AUDITORÍA TÉCNICA DE PREPRENSA CTP, GESTIÓN DE COLOR Y EMPAQUE ESTRUCTURAL
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Tecnología de Preprensa CTP y Software de Flujo de Trabajo (RIP / Workflow)
- Pregunta: Pregunta de Evaluación / Jerarquización: ¿Qué nivel de tecnología de preprensa CTP (Computer-to-Plate) y software de flujo de trabajo utiliza su empresa para la generación de placas?
- Opciones:
  1. `25 pts` — Film / Película Convencional o CTP Obsoleto: Filmación de negativos o procesadora CTP manual de baja resolución (< 2400 dpi) con químicos agresivos.
  2. `50 pts` — CTP Térmico / UV Estándar Semiautomático: CTP térmico o UV de pliego con software RIP básico; procesadora de placas convencional con generación de residuos químicos.
  3. `75 pts` — CTP Direct-to-Plate Automático Libre de Procesamiento (Processless): CTP térmico automático alimentado por casete, placas ecológicas sin químicos y software RIP con tramado estocástico (FM).
  4. `100 pts` — Flujo de Trabajo Integrado JDF/CIP4 e Impresión Digital: Workflow automatizado (Kodak Prinergy / ESKO / Heidelberg Prinect) con generación de archivos CIP3/CIP4 para tintero de prensa y CTP robotizado.

#### N2-GRAF-08 · `AG-TECH-03`

- Sección de origen: SECCIÓN II: AUDITORÍA TÉCNICA DE PREPRENSA CTP, GESTIÓN DE COLOR Y EMPAQUE ESTRUCTURAL
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Desarrollo de Empaque Estructural (Plegadizo/Corrugado) y Pruebas Físicas
- Pregunta: Pregunta de Evaluación / Jerarquización: ¿Qué capacidad de diseño de empaque estructural CAD/CAM y laboratorio de pruebas físicas (Mullen / ECT / BCT) tiene su planta?
- Opciones:
  1. `25 pts` — Copia de Muestras Manual: Elaboración de maquetas de empaque cortadas a mano con navaja sobre muestras enviadas por el cliente; sin diseño estructural digital.
  2. `50 pts` — Diseño CAD Estructural Básico: Uso de software CAD (ArtiosCAD / Impact / AutoCAD) e impresión de planos, pero trazado de troqueles tercerizado sin mesa de muestras.
  3. `75 pts` — Centro de Diseño CAD/CAM con Mesa Plotter Muestreadora: Software CAD especializado integrado a mesa plotter de corte/hendido (Zünd / Kongsberg) para maquetas físicas y optimización de nido.
  4. `100 pts` — Laboratorio Estructural Completo y Simulación ISO/TAPPI: Diseño paramétrico 3D con simulación de carga en estiba, mesa de muestras y equipo propio para pruebas Mullen, ECT (Edge Crush Test) y BCT (Box Crush Test).

#### N2-GRAF-09 · `AG-TECH-04`

- Sección de origen: SECCIÓN II: AUDITORÍA TÉCNICA DE PREPRENSA CTP, GESTIÓN DE COLOR Y EMPAQUE ESTRUCTURAL
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Tintas Grado Alimenticio/Médico, Bajas Emisiones VOC e Inocuidad
- Pregunta: Pregunta de Evaluación / Jerarquización: ¿Cómo gestiona su planta el cumplimiento normativo de tintas de baja migración, solventes de limpieza y control de emisiones orgánicas (VOC)?
- Opciones:
  1. `25 pts` — Tintas y Solventes Estándar Sin Control de Migración: Tintas convencionales a base de aceite mineral y solventes volátiles sin ficha de inocuidad alimentaria/farmacéutica.
  2. `50 pts` — Tintas de Baja Migración Bajo Pedido: Uso de tintas vegetales o de baja migración únicamente cuando el cliente alimentario lo exige explícitamente en el contrato.
  3. `75 pts` — Línea de Tintas Vegetales / UV Curing de Bajas Emisiones: Uso generalizado de tintas base agua o vegetales de baja migración (cumplimiento Nestlé Guidance / EuPIA) y cura UV de bajo consumo.
  4. `100 pts` — Inocuidad Certificada e Impresión Residuo Cero: Tintas y barnices certificados FDA / EuPIA para contacto indirecto, solventes biodegradables y sistema de recuperación/reciclaje de solventes de limpieza.

#### N2-GRAF-10 · `CP-AG-01`

- Sección de origen: SECCIÓN III: SOFISTICACIÓN PRODUCTIVA Y SALTO EN EL ESPACIO DE PRODUCTOS (CIDE / HARVARD)
- Bloque: `complejidad`
- Tipo: `seleccion_unica`
- Enunciado: Reconversión hacia la 'Fruta Madura' de Artes Gráficas (Alta Densidad ω_j > 0.65)
- Pregunta: Pregunta de Evaluación / Jerarquización: Considerando su equipamiento actual de prensas/acabados, ¿hacia cuál de los siguientes productos de mayor margen tiene mayor viabilidad de reconversión en < 12 meses?
- Opciones:
  1. `25 pts` — Empaque Plegadizo de Alta Especifidad Farmacéutica/Cosmética: Cajas con braille embosado, barniz UV registrado, código farmacopea e insértos plegados.
  2. `50 pts` — Etiqueta Autoadherible en Rollo Flexo/Digital con Finos Acabados: Etiquetas con estampado al calor (hot stamping), relieve y laminado para licores, mezcal y alimentos gourmet.
  3. `75 pts` — Cajas de Cartón Microcorrugado Impreso de Alto Impacto (Litho-Laminado): Cajas de exhibición para electrodomésticos, juguetes y calzado con excelente rigidez e impresión fotográfica.
  4. `100 pts` — Envoltorios Flexibles de Alta Barrera para Alimentos (Doypack / Pouches): Bolsas termoformadas de material trilaminado impreso en flexo de banda ancha o rotograbado.

#### N2-GRAF-11 · `CP-AG-02`

- Sección de origen: SECCIÓN III: SOFISTICACIÓN PRODUCTIVA Y SALTO EN EL ESPACIO DE PRODUCTOS (CIDE / HARVARD)
- Bloque: `complejidad`
- Tipo: `seleccion_unica`
- Enunciado: Apuestas Estratégicas y Empaque Inteligente / Seguridad (Alto ICPO)
- Pregunta: Pregunta de Evaluación / Jerarquización: En un horizonte de 2 a 3 años con coinversión pública-privada y desarrollo tecnológico, ¿en cuál segmento de alta complejidad tiene visión de incursionar?
- Opciones:
  1. `25 pts` — Empaque Anti-Falsificación y Seguridad Avanzada: Incorporación de tintas reactivas UV/IR, microtextos, guilloches y hologramas para combatir el mercado pirata.
  2. `50 pts` — Empaque Inteligente con RFID / NFC Integrado: Cajas y etiquetas con chips RFID/NFC impresos o insertados para trazabilidad automatizada en almacén e interacción del usuario final.
  3. `75 pts` — Empaque Sustentable 100% Compostable / Barrera Base Agua: Desarrollo de recipientes y cajas de cartón con recubrimientos poliméricos biodegradables sustitutos del polietileno.
  4. `100 pts` — Electrónica Impresa y Sensores de Frescura: Impresión funcional de circuitos conductivos y sensores que cambian de color ante la ruptura de la cadena de frío.

#### N2-GRAF-12 · `CP-AG-03`

- Sección de origen: SECCIÓN III: SOFISTICACIÓN PRODUCTIVA Y SALTO EN EL ESPACIO DE PRODUCTOS (CIDE / HARVARD)
- Bloque: `complejidad`
- Tipo: `seleccion_unica`
- Enunciado: Economía Circular, Sustentabilidad FSC y Reciclaje de Mermas de Papel
- Pregunta: Pregunta de Evaluación / Jerarquización: ¿Qué destino y nivel de gestión otorga actualmente su empresa a las mermas de arranque, desperdicio de viruta/papel y solución de fuente usada?
- Opciones:
  1. `25 pts` — Mezcla de Basura y Químicos al Drenaje: Desecho no clasificado de merma de papel y vertido de aguas de lavado con tinta/solución al drenaje municipal.
  2. `50 pts` — Venta de Merma a Desperdicieros Informales: Venta de retazo de papel/cartón a empacadoras locales de desperdicio sin certificación de destrucción.
  3. `75 pts` — Segregación y Cadena de Custodia FSC / PEFC: Separación clasificada de merma de papel por grado (blanco, kraft, impreso) y envío a molinos recicladores con certificación FSC.
  4. `100 pts` — Planta de Tratamiento de Agua de Lavado y Reciclaje Interno: Tratamiento físico-químico propio para recircular el agua de lavado de tintas y prensado de pacas de papel certificado.

#### N2-GRAF-13 · `COL-AG01`

- Sección de origen: SECCIÓN IV: SOLUCIONES COLABORATIVAS ANTE LA FALLA DE ESCALA (BIENES DE CLUB)
- Bloque: `bienes_club`
- Tipo: `seleccion_unica`
- Enunciado: Centro Regional de Preprensa CTP, Grabado Láser y Pruebas G7 Compartidas
- Pregunta: Pregunta de Evaluación / Jerarquización: ¿Cuál sería la disposición de su empresa para utilizar o cofinanciar un centro regional de preprensa CTP de gran formato y grabado de anilox bajo esquema Pay-per-Use?
- Opciones:
  1. `25 pts` — Desinterés o Operación Aislada: Prefiere continuar adquiriendo placas CTP con distribuidores comerciales o con su propio equipo limitado.
  2. `50 pts` — Esquema Pay-per-Use de Placas CTP: Interés en comprar servicios de filmación CTP de alta resolución y pruebas de color digital probadas en una instalación común regional.
  3. `75 pts` — Coinversión en Centro de Preprensa y Calibración G7: Disposición a aportar cuotas para equipar un centro con tecnología CTP Processless y espectrofotometría compartida.
  4. `100 pts` — Participación Fiduciaria en Hub de Grabado y Preprensa: Integración en un fideicomiso industrial para operar un centro de servicios de preprensa, CTP y troquelado digital para el sector.

#### N2-GRAF-14 · `COL-AG02`

- Sección de origen: SECCIÓN IV: SOLUCIONES COLABORATIVAS ANTE LA FALLA DE ESCALA (BIENES DE CLUB)
- Bloque: `bienes_club`
- Tipo: `seleccion_unica`
- Enunciado: Laboratorio Regional de Ensayos de Empaque (Mullen / ECT / BCT) e Inocuidad de Tintas
- Pregunta: Pregunta de Evaluación / Jerarquización: ¿Cómo participaría su empresa en un laboratorio regional acreditado ISO 17025 para pruebas mecánicas de cartón y migración de tintas bajo alianza de Cuádruple Hélice?
- Opciones:
  1. `25 pts` — Esquema Tradicional de Laboratorio Externo: Mantener envío de muestras a laboratorios en CDMX asumiendo costos y demoras de 5 a 7 días.
  2. `50 pts` — Bolsa Regional de Muestras para Descuento por Volumen: Agrupar pedidos de pruebas mecánicas de cartón con otras empresas para negociar mejores tarifas.
  3. `75 pts` — Laboratorio Comunitario en Universidad Local: Alianza formal (Empresas - Universidad UPAEP/BUAP/UTT - Gobierno) para equipar un laboratorio de empaque y tintas.
  4. `100 pts` — Acreditación ISO 17025 y Emisión de Certificados de Exportación: Aportación activa para que el laboratorio emita certificados auditables ante FDA, TAPPI y TAPPI/ISO.

#### N2-GRAF-15 · `COL-AG03`

- Sección de origen: SECCIÓN IV: SOLUCIONES COLABORATIVAS ANTE LA FALLA DE ESCALA (BIENES DE CLUB)
- Bloque: `bienes_club`
- Tipo: `seleccion_unica`
- Enunciado: Mesa de Compra Consolidada de Papel, Cartón y Sustratos FSC
- Pregunta: Pregunta de Evaluación / Jerarquización: ¿Qué grado de apertura tiene su empresa para asociarse en un consorcio comercial que consolide la compra de papel, cartoncillo e insumos con molinos papeleros?
- Opciones:
  1. `25 pts` — Compras Individuales Independientes: Comprar papel y cartón a distribuidores locales según necesidades inmediatas de cada proyecto.
  2. `50 pts` — Compras Conjuntas Ocasionales de Papel Estándar: Unir pedidos de cartón o papel de alto consumo con 2 o 3 imprentas aliadas para obtener descuentos por volumen.
  3. `75 pts` — Mesa de Compra Consolidada y Almacén Común: Integrarse a un fideicomiso de compras para adquirir bobinas de papel/cartón directamente con molinos nacionales/internacionales.
  4. `100 pts` — Consorcio de Exportación de Empaque Impreso: Asociación legal que consolide la compra de sustratos FSC y abra oficinas comerciales para abastecer mercados de exportación.


### Sector automotriz (`AUTO`) — 20 reactivos

Fuente: `docs/metodologia/03-instrumento-nivel2/automotriz.md`.

#### N2-AUTO-01 · `A01`

- Sección de origen: Módulo 0: Perfilado del Eslabón y Localización Territorial
- Bloque: `perfilado`
- Tipo: `seleccion_unica`
- Enunciado: Posición Específica en la Cadena de Suministro Automotriz
- Opciones:
  1. `4 pts` — Tier 1 (Sistemas Integrados) --- Venta directa, entregas Just-in-Time/JIS y co-diseño con plantas armadoras (OEMs).
  2. `3 pts` — Tier 2 (Fabricante de Subensambles) --- Proveedor recurrente de partes maquinadas, troqueladas, arneses o recubrimientos para integradores Tier 1 instalados en Puebla, Tlaxcala o el Bajío.
  3. `2 pts` — Tier 3 / Maquila Especializada --- Taller de maquinado por lote, troquelado, pailería o inyección que provee a empresas Tier 2 bajo planos del cliente.
  4. `2 pts` — Servicios Críticos a Planta --- Metrología, mantenimiento de herramentales/troqueles, calibración, automatización o logística especializada para plantas automotrices.

#### N2-AUTO-02 · `A02`

- Sección de origen: Módulo 0: Perfilado del Eslabón y Localización Territorial
- Bloque: `perfilado`
- Tipo: `seleccion_unica`
- Enunciado: Corredor Industrial y Localización de Operaciones
- Opciones:
  1. `null` — Corredor Central Puebla (FINSA, Cuautlancingo, San Jerónimo Caleras, Parque Puebla 2000).
  2. `null` — Corredor Poniente / Carretero (Huejotzingo, San Martín Texmelucan, San Miguel Xoxtla).
  3. `null` — Corredor Oriental / Audi (San José Chiapa, Nopalucan, Rafael Lara Grajales, Ciudad Modelo).
  4. `null` — Corredor Tlaxcala Centro-Sur (Ciudad Industrial Xicohténcatl I en Tetla, Papalotla, Panzacola, Chiautempan).
  5. `null` — Corredor Tlaxcala Oriente (Ciudad Industrial Xicohténcatl II en Huamantla / CIX III en Tlaxco).
  6. `null` — Instalación fuera de parque industrial / Taller independiente en mancha urbana.

#### N2-AUTO-03 · `R00-PROD`

- Sección de origen: Sección I: Jerarquización de Fricciones Operativas y Sourcing (Rompehielos)
- Bloque: `borda_r00`
- Tipo: `ranking_borda`; N = 8
- Enunciado: Jerarquización de Fricciones en Proceso Productivo (Piso de Planta)
- Pregunta: Ordene del 1 al 8 los siguientes problemas según el nivel de impacto negativo en los costos y flujo de su planta en Puebla-Tlaxcala (1 = Mayor gravedad, 8 = Menor gravedad)
- Factores o casillas:
  1. Paros no programados de maquinaria crítica (prensas de estampado, inyectoras o centros CNC) por mantenimiento reactivo.
  2. Scrap interno y retrabajos (Rework) de piezas que no alcanzan tolerancias dimensionales o especificaciones superficiales.
  3. Tiempos prolongados de cambio de molde/dado (Set-up / SMED) para alternar corridas entre modelos VW/Audi.
  4. Retrasos en la entrega de acero regional, resinas automotrices o componentes importados que frenan el programa de ensamble.
  5. Cuellos de botella en liberación de calidad y metrología dimensional por saturación de máquinas de coordenadas (CMM).
  6. Incumplimiento, demoras o piezas quemadas por parte de proveedores foráneos de tratamientos térmicos y galvanoplastia.
  7. Déficit, ausentismo y rotación de técnicos calificados (matriceros, soldadores robotizados, técnicos CNC, inspectores VDA).
  8. Variaciones de voltaje eléctrico o cortes de agua de enfriamiento que detienen líneas automatizadas en el parque industrial.
- Puntos por factor: no están en el instrumento sectorial. Ver fórmulas de Borda en la sección F. El monto en MXN es captura libre y no entra a ninguna fórmula escrita.

#### N2-AUTO-04 · `R00-SOURCING-MAT`

- Sección de origen: Sección I: Jerarquización de Fricciones Operativas y Sourcing (Rompehielos)
- Bloque: `borda_r00`
- Tipo: `ranking_borda`; N = 6
- Enunciado: Jerarquización de Riesgos en Sourcing de Materias Primas
- Pregunta: Ordene del 1 al 6 las restricciones que mayor incertidumbre o sobrecosto generan en su abastecimiento de insumos
- Factores o casillas:
  1. Exigencia de acero y aluminio fundido en Norteamérica ('melted and poured') para cumplir regla de origen T-MEC.
  2. Tiempos de entrega excesivos (Lead times > 12 semanas) en resinas, aceros aleados o herramentales de importación.
  3. Volatilidad de precios en commodities y sobrecostos por fletes marítimos o aranceles a insumos no originarios.
  4. Atadura a resinas y materiales con código IMDS y fichas técnicas homologadas exclusivamente por VW/Audi (Normas TL).
  5. Volúmenes mínimos de compra (MOQ) exigidos por distribuidores de acero/resinas que exceden el capital de trabajo de la PyME.
  6. Variación de dureza, espesor o propiedades mecánicas entre lotes de metal o polímero que generan desajustes en dados/moldes.
- Puntos por factor: no están en el instrumento sectorial. Ver fórmulas de Borda en la sección F. El monto en MXN es captura libre y no entra a ninguna fórmula escrita.

#### N2-AUTO-05 · `R00-SOURCING-SERV`

- Sección de origen: Sección I: Jerarquización de Fricciones Operativas y Sourcing (Rompehielos)
- Bloque: `borda_r00`
- Tipo: `ranking_borda`; N = 6
- Enunciado: Jerarquización de Riesgos en Servicios Especializados e Infraestructura
- Pregunta: Ordene del 1 al 6 las limitaciones de proveeduría de servicios en la región Puebla-Tlaxcala que más afectan su operación
- Factores o casillas:
  1. Déficit de hornos locales certificados bajo norma AIAG CQI-9 (tratamientos térmicos de cementado, templado y revenido).
  2. Carencia regional de plantas acreditadas bajo CQI-11/CQI-12 para recubrimientos galvánicos, zincado y pintura E-coat anticorrosiva.
  3. Falta de talleres de matricería y cuartos de herramientas con centros de electroerosión (EDM) para reparar troqueles dañados en <24 hrs.
  4. Demoras de más de 48 horas en laboratorios acreditados ISO/IEC 17025 para calibración de patrones y pruebas metalográficas.
  5. Dependencia de técnicos de servicio foráneos (Alemania, Monterrey, Querétaro) para calibración de husillos y prensas complejas.
  6. Riesgos de seguridad carretera y costo de custodia armada en fletes sobre la autopista 150D (Puebla-Veracruz) y el Arco Norte.
- Puntos por factor: no están en el instrumento sectorial. Ver fórmulas de Borda en la sección F. El monto en MXN es captura libre y no entra a ninguna fórmula escrita.

#### N2-AUTO-06 · `QA01`

- Sección de origen: Sección II: Auditoría de Piso de Planta, Calidad y Cadena de Valor Interna
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Despliegue Operativo de Core Tools (IATF 16949 / VDA 6.3 / Formel Q)
- Opciones:
  1. `1 pt` — Inspección manual al final de la línea: No se calculan índices estadísticos Cp/Cpk; la calidad depende de la revisión visual del operador antes de empacar.
  2. `2 pts` — Control Estadístico (SPC) documental reactivo: Se llenan cartas de control para auditorías, pero las variaciones de proceso no detienen automáticamente la máquina ni retroalimentan el plan de control.
  3. `3 pts` — Control Estadístico activo y FMEA dinámico: Gráficos de control en pie de máquina; cálculo sistemático de Cpk ≥ 1.33 en variables críticas; plan de control vinculado a características especiales (D/TLD de VW/Audi).
  4. `4 pts` — Aseguramiento avanzado Poka-Yoke e Industria 4.0: Dispositivos mecánicos/sensores a prueba de error en 100% de estaciones críticas; Cpk ≥ 1.67; trazabilidad digital de parámetros de inyección/estampado.

#### N2-AUTO-07 · `QA02`

- Sección de origen: Sección II: Auditoría de Piso de Planta, Calidad y Cadena de Valor Interna
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Desempeño en Partes por Millón (PPM) y Costo de No Calidad
- Opciones:
  1. `1 pt` — Riesgo crítico (> 200 PPM con cliente o scrap interno > 4%): Reclamos formales frecuentes; riesgo de suspensión de órdenes de compra.
  2. `2 pts` — En contención (50 a 200 PPM): Requiere contratar empresas de inspección de tercera parte (Sorting) en los patios de VW Cuautlancingo o Audi San José Chiapa.
  3. `3 pts` — Control automotriz estándar (15 a 49 PPM): Scrap interno menor al 2%; respuesta inmediata a reportes 8D en menos de 48 horas sin paros de línea ocasionados al cliente.
  4. `4 pts` — Clase mundial (< 15 PPM o Cero Defectos sostenido): Scrap menor al 1% con trazabilidad completa y reconocimientos de calidad del OEM.

#### N2-AUTO-08 · `QA03`

- Sección de origen: Sección II: Auditoría de Piso de Planta, Calidad y Cadena de Valor Interna
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Capacidad Metrológica, Validación Dimensional (GD&T) y Ensayos
- Opciones:
  1. `1 pt` — Instrumentos manuales básicos: Calibradores Vernier, micrómetros y dispositivos pasa/no-pasa sin estudios de repetibilidad y reproducibilidad (%R&R).
  2. `2 pts` — Metrología tercerizada: Dependencia de laboratorios externos en Puebla, Cholula o CDMX para reportes dimensionales CMM, demorando la liberación de lotes de 48 a 72 horas.
  3. `3 pts` — Laboratorio de metrología CMM propio en planta: Máquinas de coordenadas por contacto o escáner óptico 3D con personal técnico certificado y estudios %R&R < 10%.
  4. `4 pts` — Metrología en línea automatizada: Sensores láser o visión artificial integrados en la célula de manufactura con reporte dimensional automático por número de serie.

#### N2-AUTO-09 · `QA04`

- Sección de origen: Sección II: Auditoría de Piso de Planta, Calidad y Cadena de Valor Interna
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Disponibilidad Operativa (OEE), Mantenimiento y Cambios de Modelo (SMED)
- Opciones:
  1. `1 pt` — OEE < 60%: Paros imprevistos frecuentes por fallas mecánicas; tiempos de cambio de herramental superiores a 3 horas; mantenimiento correctivo de emergencia.
  2. `2 pts` — OEE entre 60% y 74%: Mantenimiento preventivo programado; paros por falta de refacciones importadas; cambio de molde entre 1 y 3 horas.
  3. `3 pts` — OEE entre 75% y 84%: Programa estructurado de Mantenimiento Productivo Total (TPM); metodología SMED implementada con cambios de modelo en menos de 45 minutos.
  4. `4 pts` — OEE ≥ 85% (Clase Mundial): Mantenimiento predictivo basado en vibraciones y termografía; cambios de modelo rápidos en un solo dígito de minutos (SMED < 10 min).

#### N2-AUTO-10 · `QA05`

- Sección de origen: Sección II: Auditoría de Piso de Planta, Calidad y Cadena de Valor Interna
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Madurez del Sistema de Gestión de Calidad (IATF 16949 / VDA 6.3)
- Opciones:
  1. `1 pt` — Sin certificación automotriz formal: Opera bajo ISO 9001:2015 genérico o procesos empíricos; venta limitada a maquila menor o refacciones no críticas.
  2. `2 pts` — En proceso de certificación IATF 16949: Auditoría de brecha completada pero sin certificación formal; condicionado por clientes a certificar en < 12 meses.
  3. `3 pts` — Certificación IATF 16949:2016 vigente: Sistema auditado por casa certificadora internacional sin no-conformidades mayores abiertas.
  4. `4 pts` — Calificación de Proceso VDA 6.3 y Formel Q vigente: Planta auditada directamente por Grupo Volkswagen / Audi con dictamen de aprobación Grado A o B vigente.

#### N2-AUTO-11 · `SC01`

- Sección de origen: Sección III: Retos de Sourcing, Logística de Corredor y Asimetría Financiera
- Bloque: `sourcing_corredor`
- Tipo: `seleccion_unica`
- Enunciado: Cumplimiento de Reglas de Origen T-MEC en Acero y Aluminio
- Opciones:
  1. `1 pt` — Riesgo crítico de incumplimiento: Compra de placa, rollo o barra a distribuidores locales sin certificados de molino 'melted and poured' de Norteamérica.
  2. `2 pts` — Cumplimiento parcial con sobrecosto: Se compra material regional para clientes que lo exigen, pero se utilizan aceros asiáticos para otras líneas por diferencial de precio.
  3. `3 pts` — Trazabilidad documental completa: Todos los lotes cuentan con certificado de molino norteamericano (México, EE.UU., Canadá) validado en la cadena de custodia del Tier 1.
  4. `4 pts` — Abastecimiento directo consolidado: Contratos marco anuales con acerías norteamericanas o molinos regionales con esquemas de entrega Just-in-Time y precio pactado.

#### N2-AUTO-12 · `SC02`

- Sección de origen: Sección III: Retos de Sourcing, Logística de Corredor y Asimetría Financiera
- Bloque: `sourcing_corredor`
- Tipo: `seleccion_unica`
- Enunciado: Acceso Regional a Procesos Especiales Acreditados (Normas AIAG CQI)
- Opciones:
  1. `1 pt` — Brecha crítica: Los proveedores locales no cuentan con auditoría CQI (CQI-9 en tratamiento térmico, CQI-11 en galvano); piezas rechazadas en laboratorio.
  2. `2 pts` — Dependencia de logística foránea remota: Se envían piezas a procesar al Estado de México, Querétaro o Guanajuato (> 250 km), agregando 1 a 2 semanas al ciclo de entrega.
  3. `3 pts` — Proveeduría regional homologada: Cuenta con proveedores certificados CQI en el área metropolitana de Puebla o corredores industriales de Tlaxcala.
  4. `4 pts` — Procesos especiales verticalmente integrados en planta: Cuenta con hornos de tratamiento o líneas de recubrimiento propias auditadas y aprobadas bajo CQI.

#### N2-AUTO-13 · `SC03`

- Sección de origen: Sección III: Retos de Sourcing, Logística de Corredor y Asimetría Financiera
- Bloque: `sourcing_corredor`
- Tipo: `seleccion_unica`
- Enunciado: Logística de Corredor, Riesgos Carreteros y Ventanas de Despacho
- Opciones:
  1. `1 pt` — Impacto severo: Costos elevados de seguro de carga y contratación obligatoria de patrullas de custodia armada para transitar por la autopista 150D o Arco Norte.
  2. `2 pts` — Fricción operativa frecuente: Retrasos en entregas Just-in-Time por bloqueos, accidentes o revisiones en casetas que han generado cobros de fletes de emergencia (Hot shots).
  3. `3 pts` — Riesgo administrado con inventario de seguridad: Se mantienen almacenes avanzados cerca de las armadoras (Cuautlancingo o San José Chiapa) para amortiguar el traslado.
  4. `4 pts` — Flujo sincronizado seguro (JIT/JIS): Entregas locales directas en menos de 45 minutos desde parque industrial cercano con 100% de cumplimiento On-Time Delivery.

#### N2-AUTO-14 · `SC04`

- Sección de origen: Sección III: Retos de Sourcing, Logística de Corredor y Asimetría Financiera
- Bloque: `sourcing_corredor`
- Tipo: `seleccion_unica`
- Enunciado: Asimetría en Capital de Trabajo y Ciclo Financiero
- Opciones:
  1. `1 pt` — Estrés de liquidez crítico: Los proveedores cobran a 30 días o contado, mientras el cliente paga a 90 o 120 días; recurre a deuda cara o frena producción.
  2. `2 pts` — Factoraje financiero costoso: Se descuentan facturas con bancos comerciales asumiendo un costo financiero que reduce el margen neto de la pieza.
  3. `3 pts` — Equilibrio financiero aceptable: Cuenta con líneas de factoraje preferente operadas por la armadora (Reverse factoring) o acuerdos de pago a 45 días con proveedores.
  4. `4 pts` — Autonomía y solidez financiera: Flujo de caja propio y líneas de crédito revolventes de bajo costo que permiten amortiguar inventarios de seguridad sin estrés.

#### N2-AUTO-15 · `OP01`

- Sección de origen: Sección IV: Habilitación de Nuevos Mercados y Transición a Electromovilidad
- Bloque: `mercados_ev`
- Tipo: `seleccion_unica`
- Enunciado: Sustitución de Insumos y Partes Importadas en el Corto Plazo
- Opciones:
  1. `3 pts` — Tornillería, sujetadores y herrajes automotrices de alta resistencia bajo normas DIN / ISO.
  2. `4 pts` — Componentes maquinados en CNC de precisión para sistemas de frenos, dirección o suspensión.
  3. `3 pts` — Inyección de piezas plásticas técnicas de ingeniería (Poliamidas con fibra de vidrio) para compartimento de motor o interiores.
  4. `4 pts` — Troquelado y estampado de partes estructurales medianas de chasis y carrocería.
  5. `2 pts` — Empaques retornables especializados, charolas termoformadas antiestáticas y contenedores de ensamble.

#### N2-AUTO-16 · `OP02`

- Sección de origen: Sección IV: Habilitación de Nuevos Mercados y Transición a Electromovilidad
- Bloque: `mercados_ev`
- Tipo: `seleccion_unica`
- Enunciado: Grado de Exposición frente al Motor de Combustión Interna vs Nuevas Plataformas
- Opciones:
  1. `1 pt` — Exposición alta (> 50% de las ventas en monoblocks, pistones, múltiples de admisión, tubos de escape, bombas mecánicas): Riesgo crítico de obsolescencia.
  2. `2 pts` — Exposición moderada (20% a 50% de las ventas en componentes térmicos): Cuenta con líneas para chasis o interiores pero el motor sigue siendo el ancla del negocio.
  3. `3 pts` — Catálogo neutro o agnóstico (< 20% en motor): Fabricación de suspensión, frenos, estampados de carrocería, asientos o iluminación útiles en cualquier vehículo.
  4. `4 pts` — Portafolio activo en electromovilidad: Suministro de piezas para vehículos híbridos (PHEV) o eléctricos puros (BEV) en plataformas Audi Q5 o Volkswagen.

#### N2-AUTO-17 · `OP03`

- Sección de origen: Sección IV: Habilitación de Nuevos Mercados y Transición a Electromovilidad
- Bloque: `mercados_ev`
- Tipo: `seleccion_unica`
- Enunciado: Capacidades Técnicas para Componentes Ligeros y Electromovilidad (Lightweighting)
- Opciones:
  1. `1 pt` — Sin capacidad de aligeramiento: Solo procesa aceros al carbón comerciales y estampados tradicionales de bajo calibre.
  2. `2 pts` — En fase de experimentación: Primeras corridas piloto en aleaciones de aluminio o aceros de alta resistencia con herramentales adaptados empíricamente.
  3. `3 pts` — Procesamiento validado de aluminio y aceros avanzados: Capacidad probada para troquelar o maquinar aceros de ultra-alta resistencia (UHSS) o aluminio series 5000/6000.
  4. `4 pts` — Tecnología de frontera para vehículos eléctricos: Estampado en caliente (Hot Stamping), soldadura láser, uniones mecánicas autoperforantes (SPR) o fabricación de bandejas de batería.

#### N2-AUTO-18 · `COL01`

- Sección de origen: Sección V: Bienes de Club y Desarrollo Colaborativo Regional
- Bloque: `bienes_club`
- Tipo: `seleccion_unica`
- Enunciado: Interés en Laboratorio Comunitario de Metrología y Pruebas CMM (Coordinate Measuring Machine o Máquina de Medición por Coordenadas)
- Opciones:
  1. `4 pts` — Totalmente dispuesto: Aportaría cuota de inversión o contrataría horas mensuales de medición para evitar compras individuales de equipo costoso.
  2. `3 pts` — Interesado como usuario eventual: Utilizaría el laboratorio únicamente para validaciones anuales de herramental o auditorías de clientes.
  3. `2 pts` — Renuente: Prefiere seguir tercerizando con laboratorios privados foráneos a pesar del costo y demora.
  4. `1 pt` — Sin interés: Cuenta con laboratorio propio completo o sus piezas no requieren verificación tridimensional.

#### N2-AUTO-19 · `COL02`

- Sección de origen: Sección V: Bienes de Club y Desarrollo Colaborativo Regional
- Bloque: `bienes_club`
- Tipo: `seleccion_unica`
- Enunciado: Consorcio Regional para Planta Comunitaria de Tratamientos Especiales (CQI)
- Opciones:
  1. `4 pts` — Prioridad estratégica urgente: Se integraría activamente al consorcio empresarial para garantizar volumen de carga y reducir fletes a otros estados.
  2. `3 pts` — Interesado como cliente usuario: Enviaría sus piezas a procesar localmente siempre que los precios y certificaciones sean competitivos.
  3. `2 pts` — Escéptico sobre la viabilidad asociativa: Duda que las empresas locales puedan acordar tiempos de entrega y confidencialidad en un horno compartido.
  4. `1 pt` — No aplica: Sus procesos no requieren tratamientos térmicos ni recubrimientos superficiales.

#### N2-AUTO-20 · `COL03`

- Sección de origen: Sección V: Bienes de Club y Desarrollo Colaborativo Regional
- Bloque: `bienes_club`
- Tipo: `seleccion_unica`
- Enunciado: Mesas de Compra Consolidada de Acero y Materias Primas T-MEC
- Opciones:
  1. `4 pts` — Totalmente de acuerdo: La consolidación de compras permitiría alcanzar los volúmenes mínimos (MOQ) y negociar mejores precios y plazos de entrega.
  2. `3 pts` — Dispuesto bajo reglas estrictas: Participaría si existe un intermediario financiero neutral (fideicomiso) que gestione los pedidos y cobros.
  3. `2 pts` — Prefiere negociar en forma independiente: Considera que sus especificaciones técnicas de acero son muy particulares para compras agrupadas.
  4. `1 pt` — No aplica: Su volumen de compra es lo suficientemente grande para negociar directamente con molinos.


### Sector construccion (`CONST`) — 16 reactivos

Fuente: `docs/metodologia/03-instrumento-nivel2/construccion.md`.

#### N2-CONST-01 · `CN-01`

- Sección de origen: (sin encabezado)
- Bloque: `perfilado`
- Tipo: `seleccion_unica`
- Enunciado: Eslabón Dominante en la Cadena de Construcción e Infraestructura
- Pregunta: Pregunta de Evaluación Directa: ¿En cuál de los siguientes eslabones se concentra la mayor proporción de la facturación y actividad operativa de su empresa?
- Opciones:
  1. `1 pt` — Edificación Residencial y Comercial: Vivienda vertical/horizontal, plazas comerciales, desarrollos de uso mixto e infraestructura urbana de servicios.
  2. `2 pts` — Obra Civil e Infraestructura Pesada: Carreteras, puentes, redes de agua/drenaje, cimentaciones profundas, naves industriales y obras hidráulicas.
  3. `3 pts` — Prefabricados y Materiales de Construcción: Extracción de agregados pétreos, plantas de concreto premezclado, bloques, tubos y elementos pretensados/postensados.
  4. `4 pts` — Servicios de Ingeniería, Supervisión y BIM: Proyectos ejecutivos, gerencia de obra, modelado BIM, topografía con drones y verificación estructural DRO.

#### N2-CONST-02 · `CN-02`

- Sección de origen: (sin encabezado)
- Bloque: `perfilado`
- Tipo: `seleccion_unica`
- Enunciado: Cuenca Territorial y Micro-Región de Operación Principal
- Pregunta: Pregunta de Evaluación Directa: ¿En qué cuenca productiva o corredor de la región Puebla - Tlaxcala se localiza la principal base de operaciones o patio de maquinaria de su empresa?
- Opciones:
  1. `1 pt` — Zona Metropolitana Puebla-Tlaxcala (ZMPT): Puebla, San Andrés/San Pedro Cholula, Amozoc, Cuautlancingo, Tlaxcala Capital, San Pablo del Monte.
  2. `2 pts` — Corredor Industrial Huejotzingo - San Martín Texmelucan - Natívitas: Zona de alto desarrollo de naves industriales y logística.
  3. `3 pts` — Valle de Tehuacán (ZMTH) y Mixteca: Obras de edificación regional, infraestructura hídrica y materiales pétreos del sur.
  4. `4 pts` — Sierra Norte y Nororiental (Zacatlán, Chignahuapan, Teziutlán): Obras de contención de laderas, infraestructura vial de montaña y caminos rurales.
  5. `5 pts` — Altiplano de Tlaxcala (Huamantla, Apizaco, Tlaxco, CIX I, II, III): Desarrollo de infraestructura industrial, ferroviaria y parques logísticos.

#### N2-CONST-03 · `CN-03`

- Sección de origen: (sin encabezado)
- Bloque: `perfilado`
- Tipo: `seleccion_unica`
- Enunciado: Regulación Ambiental, Manifestación de Impacto Ambiental (MIA) y Licencias
- Pregunta: Pregunta de Evaluación Directa: ¿Cuál es la situación operativa de su empresa respecto a autorizaciones de impacto ambiental, licencias municipales y manejo de RCD?
- Opciones:
  1. `1 pt` — Cumplimiento Informal / En Tramite Inicial: Operación con licencias municipales básicas pero sin Manifestación de Impacto Ambiental (MIA) ni plan formal de RCD.
  2. `2 pts` — Licencias Vigentes con Gestión Reactiva: MIA aprobada para obras específicas y licencias de construcción en regla, pero con demoras en renovaciones.
  3. `3 pts` — Cumplimiento Normativo Pleno: MIA estatal/federal vigente, permisos CONAGUA para extracción/descarga y plan de manejo de RCD registrado en la autoridad ambiental.
  4. `4 pts` — Certificación de Sustentabilidad y Reciclaje: Obras bajo estándares de edificación sustentable (LEED / EDGE) con reutilización in situ >40% de residuos RCD.

#### N2-CONST-04 · `R00-CONST-PROD`

- Sección de origen: (sin encabezado)
- Bloque: `borda_r00`
- Tipo: `ranking_borda`; N = 8
- Enunciado: Jerarquización de Fricciones en Obra y Planta (ROMPEHIELOS DE BORDA)
- Pregunta: Pregunta de Evaluación Directa: Ordene del 1 al 8 los siguientes problemas operativos según el impacto económico negativo y la frecuencia con que afectan el avance de sus obras
- Factores o casillas:
  1. Paros de obra por condiciones climáticas, lluvias imprevistas o bloqueos sociales de acceso.
  2. Mermas excesivas y desperdicio de concreto premezclado, acero de refuerzo o cimbra.
  3. Retrabajos y costos de corrección por vicios ocultos o inconsistencias en planos ejecutivos.
  4. Atrasos en la conciliación y cobro de estimaciones con clientes públicos o privados.
  5. Escasez, alta rotación y falta de capacitación de oficiales de albañilería y operadores de maquinaria pesada.
  6. Retrasos o cuellos de botella en la entrega de reportes de laboratorio de ensayos de concreto y suelos.
  7. Trámites burocráticos y lentitud en la obtención de licencias de construcción y alineamiento municipal.
  8. Sobrecostos no contemplados por consumo de diésel e ineficiencia en el rendimiento de maquinaria pesada.
- Puntos por factor: no están en el instrumento sectorial. Ver fórmulas de Borda en la sección F. El monto en MXN es captura libre y no entra a ninguna fórmula escrita.

#### N2-CONST-05 · `R00-CONST-SOURCING-MAT`

- Sección de origen: (sin encabezado)
- Bloque: `borda_r00`
- Tipo: `ranking_borda`; N = 6
- Enunciado: Jerarquización de Riesgos en Sourcing de Materiales (ROMPEHIELOS DE BORDA)
- Pregunta: Pregunta de Evaluación Directa: Ordene del 1 al 6 los principales riesgos y cuellos de botella que enfrenta su empresa en la compra y suministro de materiales de construcción
- Factores o casillas:
  1. Volatilidad extrema de precios en acero de refuerzo (varilla, mallas), cemento y asfalto.
  2. Desabasto o falta de calidad uniforme en agregados pétreos (grava, arena) con ensayos ONNCCE.
  3. Atrasos en las entregas de aditivos químicos para fraguado y acelerantes de concreto.
  4. Escasez o tiempos largos de entrega de elementos prefabricados especiales o viguetas pretensadas.
  5. Exigencia de volúmenes mínimos de compra (MOQ) y condiciones de pago rigurosas por cemexeras/acereras.
  6. Sobrecostos de flete y transporte para el traslado de triturados y concreto desde plantas alejadas.
- Puntos por factor: no están en el instrumento sectorial. Ver fórmulas de Borda en la sección F. El monto en MXN es captura libre y no entra a ninguna fórmula escrita.

#### N2-CONST-06 · `R00-CONST-SOURCING-SERV`

- Sección de origen: (sin encabezado)
- Bloque: `borda_r00`
- Tipo: `ranking_borda`; N = 6
- Enunciado: Jerarquización de Deficiencias en Servicios Extermos (ROMPEHIELOS DE BORDA)
- Pregunta: Pregunta de Evaluación Directa: Ordene del 1 al 6 las mayores deficiencias de servicios especializados e infraestructura externa en la región Puebla-Tlaxcala
- Factores o casillas:
  1. Escasez de laboratorios locales acreditados ISO 17025 / ONNCCE para ensayos de concreto, acero y mecánica de suelos.
  2. Falta de servicios especializados de topografía con levantamiento LiDAR o fotogrametría con drones.
  3. Deficiente oferta de talleres locales para mantenimiento mayor de sistemas hidráulicos y motores de maquinaria pesada.
  4. Escasez de peritos Directores Responsables de Obra (DRO) y corresponsables de seguridad estructural calificados.
  5. Inseguridad y riesgos de robo en el traslado de maquinaria pesada y materiales en la Autopista 150D y Arco Norte.
  6. Falta de sitios autorizados de tiro y plantas de trituración/reciclaje de RCD en la zona metropolitana.
- Puntos por factor: no están en el instrumento sectorial. Ver fórmulas de Borda en la sección F. El monto en MXN es captura libre y no entra a ninguna fórmula escrita.

#### N2-CONST-07 · `CN-TECH-01`

- Sección de origen: (sin encabezado)
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Control de Calidad de Materiales y Ensayos Mecánicos ONNCCE / EMA
- Pregunta: Pregunta de Evaluación Directa: ¿Cómo valida y garantiza su empresa la resistencia a la compresión del concreto y las propiedades mecánicas del acero de refuerzo?
- Opciones:
  1. `1 pt` — Pruebas Empíricas / Sin Laboratorio: Confianza exclusiva en el certificado del proveedor sin muestreo de revenimiento ni ensamble de cilindros/probetas.
  2. `2 pts` — Pruebas Básicas de Campo: Muestreo de revenimiento y elaboración de cilindros de concreto, pero con envío a laboratorios no acreditados por la EMA/ONNCCE.
  3. `3 pts` — Control de Calidad Acreditado Externo: Muestreo sistemático e informes de laboratorio acreditado ISO 17025 / ONNCCE para compresión, tensión de acero y compactación de suelos.
  4. `4 pts` — Laboratorio de Control propio e Informes Digitales: Laboratorio de calidad propio en obra con prensa calibrada, curado normado e integración digital de reportes de resistencia a 7, 14 y 28 días.

#### N2-CONST-08 · `CN-TECH-02`

- Sección de origen: (sin encabezado)
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Digitalización, Metodología BIM y Control de Estimaciones
- Pregunta: Pregunta de Evaluación Directa: ¿Qué nivel de tecnología digital y metodología de modelado utiliza su empresa para el diseño, cuantificación y control de avance de obra?
- Opciones:
  1. `1 pt` — Dibujo 2D Convencional / Hojas de Cálculo: Manejo de planos en AutoCAD 2D estático y cuantificación manual en Excel con alto riesgo de imprecisiones.
  2. `2 pts` — Modelado 3D Básico / Control Software de Costos: Uso de modelado 3D comercial (SketchUp/Revit básico) combinado con software especializado de precios unitarios (Neodata/Opus).
  3. `3 pts` — BIM Nivel 2 / Detección de Interferencias: Modelado colaborativo BIM 3D (Revit/Navisworks) con detección automática de choque entre ingenierías antes de la ejecución.
  4. `4 pts` — Integración BIM 4D / 5D y Control ERP en Tiempo Real: Modelado 4D (tiempo/cronograma) y 5D (costos) vinculado a un ERP de obra para control en tiempo real de estimaciones e inventarios.

#### N2-CONST-09 · `CN-TECH-03`

- Sección de origen: (sin encabezado)
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Seguridad Industrial (NOM-031-STPS) y Gestión de Residuos (RCD)
- Pregunta: Pregunta de Evaluación Directa: ¿Cómo gestiona su empresa la seguridad y salud ocupacional en obra y el manejo de los residuos de la construcción y demolición (RCD)?
- Opciones:
  1. `1 pt` — Prácticas Informales / Sin Protocolo Escrito: Entrega de equipo EPP básico sin supervisión continua, plan de protección civil ni protocolo de manejo de RCD.
  2. `2 pts` — Protocolo de Seguridad Básico: Comisión de Seguridad e Higiene integrada, señalética NOM-031-STPS en obra y retiro de escombros mediante transportistas locales autorizados.
  3. `3 pts` — Sistema de Gestión de Seguridad NOM-031 y Plan RCD: Analistas de riesgo en obra, análisis de trabajo seguro (ATS) en alturas/excavaciones y separación primaria de RCD.
  4. `4 pts` — Certificación OHSAS / ISO 45001 y Reciclaje RCD in situ: Sistema de gestión de seguridad certificado, tasa de siniestralidad cero y trituración/reutilización in situ de RCD.

#### N2-CONST-10 · `CN-TECH-04`

- Sección de origen: (sin encabezado)
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Eficiencia de Maquinaria Pesada, Telemetría y Mantenimiento
- Pregunta: Pregunta de Evaluación Directa: ¿Cómo gestiona y monitorea su empresa el rendimiento, consumo de combustible y mantenimiento de su flota de maquinaria pesada?
- Opciones:
  1. `1 pt` — Mantenimiento Reactivo / Bitácora Manual: Reparaciones mecánicas al presentarse fallas y control de horómetro/diésel en notas en papel sin verificación.
  2. `2 pts` — Mantenimiento Preventivo por Horómetro: Programa de servicios mecánicos por kilometraje/horómetro y control periódico de consumo de combustible por obra.
  3. `3 pts` — Monitoreo por GPS / TPM de Flota: Sistema de rastreo GPS en unidades, control estricto de cargas de diésel con tarjeta electrónica y mantenimiento preventivo planificado.
  4. `4 pts` — Telemetría IoT en Tiempo Real y Diagnóstico Predictivo: Maquinaria equipada con telemetría telemática IoT (Caterpillar VisionLink, Komtrax, JD Link) para monitoreo de consumo, códigos de falla y eficiencia.

#### N2-CONST-11 · `CP-CN-01`

- Sección de origen: (sin encabezado)
- Bloque: `complejidad`
- Tipo: `seleccion_sin_puntaje_markup_checkbox`
- Enunciado: Reconversión hacia la 'Fruta Madura' de Construcción (Alta Densidad ω_j > 0.65)
- Pregunta: Pregunta de Evaluación Directa: Considerando su equipamiento y capacidad de planta/obra, ¿hacia cuál producto o sistema constructivo adyacente tiene mayor viabilidad de reconversión en menos de 12 meses?
- Factores o casillas:
  1. Prefabricados de concreto estructural (muros Tilt-Up, trabes AASTHO, losas alveolares pretensadas).
  2. Adoquines, bloques y adoquines ecológicos fabricados con sustitución de agregados reciclados de RCD.
  3. Morteros secos, estucos y adhesivos cerámicos premezclados de alta adherencia envasados en saco.
  4. Elementos pretensados de edificación rápida (sistemas de vigueta y bovedilla de poliestireno o alma abierta).

#### N2-CONST-12 · `CP-CN-02`

- Sección de origen: (sin encabezado)
- Bloque: `complejidad`
- Tipo: `seleccion_sin_puntaje_markup_checkbox`
- Enunciado: Apuestas Estratégicas y Edificación de Alta Complejidad (Alto ICPO)
- Pregunta: Pregunta de Evaluación Directa: En un horizonte de 2 a 3 años con apoyo de coinversión pública-privada y financiamiento verde, ¿en cuál segmento de alta sofisticación técnica tiene visión de incursionar?
- Factores o casillas:
  1. Edificación sustentable con certificación LEED / EDGE y sistemas de eficiencia energética pasiva.
  2. Sistemas constructivos industrializados 3D / Construcción Off-site modular volumétrica en taller.
  3. Concretos autorreparables, geopolímeros de bajo carbono y materiales con captura de CO2.
  4. Obras de infraestructura hídrica avanzada, plantas de tratamiento de agua y túneles de drenaje profundo.

#### N2-CONST-13 · `CP-CN-03`

- Sección de origen: (sin encabezado)
- Bloque: `complejidad`
- Tipo: `seleccion_unica`
- Enunciado: Economía Circular, Reciclaje de RCD y Concreto Ecológico
- Pregunta: Pregunta de Evaluación Directa: ¿Qué destino y nivel de aprovechamiento otorga actualmente su empresa a los escombros y residuos de construcción (RCD) generados en obra?
- Opciones:
  1. `1 pt` — Tiro Clandestino / Disposición Informal: Retiro de escombros mediante fletes particulares sin comprobante de tiro autorizado, con riesgo de sanciones.
  2. `2 pts` — Tiro Autorizado / Sin Procesamiento: Transporte de RCD a tiraderos o rellenos sanitarios autorizados por la autoridad ambiental pero sin reciclaje.
  3. `3 pts` — Reutilización Rústica en Obra: Uso de escombros seleccionados para rellenos, nivelación de terrenos o terracerías secundarias en la misma obra.
  4. `4 pts` — Trituración Clasificada y Concreto Ecológico: Trituración y cribado in situ o en planta especializada de RCD para elaboración de agregados reciclados normados.

#### N2-CONST-14 · `COL-CN01`

- Sección de origen: (sin encabezado)
- Bloque: `bienes_club`
- Tipo: `seleccion_unica`
- Enunciado: Pool Comunitario de Maquinaria Pesada e Infraestructura de Trituración RCD
- Pregunta: Pregunta de Evaluación Directa: ¿Cuál sería la disposición de su empresa para utilizar o cofinanciar un parque comunitario de maquinaria especializada y plantas móviles de trituración RCD bajo esquema Pay-per-Use?
- Opciones:
  1. `1 pt` — Operación Individual Exclusiva: Preferencia por operar únicamente con maquinaria propia o arrendamiento tradicional individual.
  2. `2 pts` — Esquema Pay-per-Use / Arrendamiento Compartido: Interés en rentar equipos especializados por hora/día desde un pool comunitario regional.
  3. `3 pts` — Co-inversión en Planta Móvil de RCD: Disposición a aportar capital o cuotas de uso para adquirir trituradoras móviles comunitarias.
  4. `4 pts` — Gobernanza Fiduciaria Completa: Participación en un fideicomiso de equipamiento de infraestructura operado por la cámara empresarial (CMIC) o parque logístico.

#### N2-CONST-15 · `COL-CN02`

- Sección de origen: (sin encabezado)
- Bloque: `bienes_club`
- Tipo: `seleccion_unica`
- Enunciado: Laboratorio Regional Acreditado ONNCCE / EMA de Ensayos Mecánicos y Suelos
- Pregunta: Pregunta de Evaluación Directa: ¿Cómo participaría su empresa en una alianza regional de Cuádruple Hélice para operar un laboratorio comunitario acreditado de concreto, acero y geotecnia?
- Opciones:
  1. `1 pt` — Continuidad de Esquema Individual: Preferencia por continuar contratando laboratorios privados de forma independiente.
  2. `2 pts` — Bolsa Regional de Muestras: Disposición a integrar un convenio de volumen para negociar tarifas preferenciales con laboratorios acreditados.
  3. `3 pts` — Alianza Universitaria (Cuádruple Hélice): Participación en la acreditación ONNCCE/EMA de laboratorios en universidades locales (BUAP / UPAEP / UTT / UPT).
  4. `4 pts` — Copropiedad y Certificación Digital in situ: Aportación activa a un fondo de equipamiento para la emisión de reportes digitales con validez oficial inmediata.

#### N2-CONST-16 · `COL-CN03`

- Sección de origen: (sin encabezado)
- Bloque: `bienes_club`
- Tipo: `seleccion_unica`
- Enunciado: Consorcio de Compras Consolidadas de Acero, Cemento y Licitaciones Colectivas
- Pregunta: Pregunta de Evaluación Directa: ¿Qué grado de apertura tiene su empresa para asociarse en un consorcio de compras de insumos básicos y participación conjunta en licitaciones de infraestructura?
- Opciones:
  1. `1 pt` — Compras Independientes Tradicionales: Preferencia por comprar materiales de forma individual a distribuidores locales.
  2. `2 pts` — Compras Agrupadas por Proyecto: Disposición a consolidar pedidos de varilla, cemento y aditivos junto con otras constructoras de la región.
  3. `3 pts` — Consorcio de Licitación Abierta: Integración de alianzas estratégicas (Joint Venture) para participar colectivamente en licitaciones de gran escala.
  4. `4 pts` — Consorcio Legal Integrado con Bodega Central: Asociación formal con bodega de acopio y red logística compartida para insumos de construcción.


### Sector logistica (`LOG`) — 16 reactivos

Fuente: `docs/metodologia/03-instrumento-nivel2/logistica.md`.

#### N2-LOG-01 · `LG-01`

- Sección de origen: MÓDULO 0: PERFILADO DEL ESLABÓN Y LOCALIZACIÓN TERRITORIAL
- Bloque: `perfilado`
- Tipo: `seleccion_unica`
- Enunciado: Eslabón Dominante en la Cadena Logística
- Pregunta: Pregunta de Evaluación: ¿En cuál de los siguientes eslabones se concentra la mayor proporción de la facturación y actividad operativa de su empresa?
- Opciones:
  1. `null` — Autotransporte de Carga General y Especializada (1PL / 2PL): Flota propia o arrendada dedicada al arrastre de carga seca, a granel, plataformas o tanques en rutas nacionales/locales.
  2. `null` — Servicios de Almacenamiento, Distribución y 3PL (Third-Party Logistics): Operación de almacenes, centros de distribución (Cedis), gestión de inventarios, kitting y maquila ligera para terceros.
  3. `null` — Operador Logístico Integrado 4PL / Control Tower / Consultoría: Orquestación integral de la cadena de suministro, gestión de fletes multi-modal, torres de control digitales y aduanas.
  4. `null` — Logística de Última Milla, E-commerce y Distribución Urbana: Paquetería, mensajería express, entregas consolidadas urbanas y rutas de distribución punto a punto en ZMPT y ciudades regionales.

#### N2-LOG-02 · `LG-02`

- Sección de origen: MÓDULO 0: PERFILADO DEL ESLABÓN Y LOCALIZACIÓN TERRITORIAL
- Bloque: `perfilado`
- Tipo: `seleccion_unica`
- Enunciado: Corredor Logístico y Nodo Regional de Operación
- Pregunta: Pregunta de Evaluación: ¿En qué corredor vial o nodo logístico de la región Puebla - Tlaxcala se localiza la principal base de flota o centro de distribución de su empresa?
- Opciones:
  1. `null` — Corredor 1: ZMPT / Autopista México-Puebla 150D (Puebla, Cuautlancingo, FINSA, Amozoc, San Martín Texmelucan): Enlace prioritario con ZMVM y Puerto de Veracruz.
  2. `null` — Corredor 2: Arco Norte y Zona Centro-Norte de Tlaxcala (Calpulalpan, Apizaco, CIX I, II, III): Conectividad transnacional evitando la ZMVM y enlace hacia el Norte/Bajío.
  3. `null` — Corredor 3: Ciudad Modelo / Audi / Huamantla (Nodo Oriental Puebla-Tlaxcala): Logística especializada automotriz, parques de proveedores y plataforma ferroviaria.
  4. `null` — Corredor 4: Valle de Tehuacán y Nodo Sur (ZMTH / Autopista Cuacnopalan-Oaxaca): Logística agroindustrial, avícola, alimentos procesados y enlace con el Istmo/Oaxaca.

#### N2-LOG-03 · `LG-03`

- Sección de origen: MÓDULO 0: PERFILADO DEL ESLABÓN Y LOCALIZACIÓN TERRITORIAL
- Bloque: `perfilado`
- Tipo: `seleccion_unica`
- Enunciado: Certificación de Seguridad e Infraestructura de Flota
- Pregunta: Pregunta de Evaluación: ¿Cuál es el nivel de cumplimiento normativo SCT y certificación formal de seguridad en transporte que ostenta su empresa?
- Opciones:
  1. `null` — Cumplimiento Básico Obligatorio / SCT: Licencias de chofer vigentes y pesos/dimensiones NOM-012-SCT, sin programas formales de certificación de seguridad ni auditorías externas.
  2. `null` — Protocolos Internos Antirrobo sin Certificación: Rastreo GPS instalado por exigencia de aseguradora y paro de motor remoto, pero sin estándar internacional C-TPAT u OEA.
  3. `null` — Certificación C-TPAT / OEA Vigente: Certificación formal aprobada por CBP (EE.UU.) y/o SAT (México) con auditorías periódicas de cadena de custodia y socios comerciales.
  4. `null` — Estándar Multicertificado (ISO 28000 / TAPA TSR / ISO 39001): Sistema de gestión de seguridad ISO 28000, estándar TAPA para carga de alto valor y seguridad vial ISO 39001 auditados.

#### N2-LOG-04 · `R00-LOG-PROD`

- Sección de origen: SECCIÓN I: ROMPEHIELOS DE JERARQUIZACIÓN DE IMPACTO (MÉTODO DE BORDA)
- Bloque: `borda_r00`
- Tipo: `ranking_borda`; N = 8
- Enunciado: Jerarquización de Fricciones en Operación de Flotas y Almacén (Rompehielos de Jerarquización 1 al 8)
- Pregunta: Pregunta de Evaluación: Ordene del 1 al 8 los siguientes problemas operativos según el impacto económico negativo y la frecuencia con que afectan su empresa (1 = Mayor impacto negativo / Máxima gravedad; 8 = Menor impacto)
- Factores o casillas:
  1. Robos de unidades y mercancía en carretera (autopista 150D, Arco Norte) e incremento en costo de pólizas de seguro.
  2. Escasez, alta rotación y falta de capacitación/certificación de conductores de autotransporte.
  3. Tiempos excesivos de espera para carga/descarga y cuellos de botella en rampas de Cedis y clientes.
  4. Paros por mantenimiento no programado, fallas mecánicas e ineficiencia en el consumo de diésel.
  5. Falta de visibilidad en tiempo real de inventarios en almacén (diferencias de stock, errores de picking/kitting).
  6. Sobrecostos y mermas por ruptura de cadena de frío en tránsito o patio de maniobras.
  7. Reclamaciones y penalizaciones de clientes por entregas tardías fuera de ventana de servicio (OTIF < 90%).
  8. Trámites aduanales lentos, revisiones de SCT/Guardia Nacional y permisos municipales de carga/descarga.
- Puntos por factor: no están en el instrumento sectorial. Ver fórmulas de Borda en la sección F. El monto en MXN es captura libre y no entra a ninguna fórmula escrita.

#### N2-LOG-05 · `R00-LOG-SOURCING-MAT`

- Sección de origen: SECCIÓN I: ROMPEHIELOS DE JERARQUIZACIÓN DE IMPACTO (MÉTODO DE BORDA)
- Bloque: `borda_r00`
- Tipo: `ranking_borda`; N = 6
- Enunciado: Jerarquización de Riesgos en Sourcing de Equipos y Refacciones (Rompehielos de Jerarquización 1 al 6)
- Pregunta: Pregunta de Evaluación: Ordene del 1 al 6 los principales riesgos y cuellos de botella que enfrenta su empresa en la compra y mantenimiento de activos de transporte
- Factores o casillas:
  1. Dificultad y retrasos de entrega en la adquisición/arrendamiento de tractocamiones, remolques y cajas secas/refrigeradas.
  2. Volatilidad de precios y desabasto de refacciones originales (frenos, transmisión, suspensión, filtros).
  3. Costos elevados y escasez de neumáticos de alta calidad y rendimiento kilométrico.
  4. Incremento continuo en precios de combustible diésel y aditivos de tratamiento de gases (DEF / Urea).
  5. Altos costos de licencias de software telemático (GPS, TMS, WMS, sensores IoT) y renovación de equipos.
  6. Escasez de refacciones especializadas para equipos de refrigeración (Thermo King / Carrier).
- Puntos por factor: no están en el instrumento sectorial. Ver fórmulas de Borda en la sección F. El monto en MXN es captura libre y no entra a ninguna fórmula escrita.

#### N2-LOG-06 · `R00-LOG-SOURCING-SERV`

- Sección de origen: SECCIÓN I: ROMPEHIELOS DE JERARQUIZACIÓN DE IMPACTO (MÉTODO DE BORDA)
- Bloque: `borda_r00`
- Tipo: `ranking_borda`; N = 6
- Enunciado: Jerarquización de Deficiencias en Infraestructura y Servicios Externos (Rompehielos de Jerarquización 1 al 6)
- Pregunta: Pregunta de Evaluación: Ordene del 1 al 6 las mayores deficiencias de infraestructura y servicios externos que limitan la logística en la región Puebla-Tlaxcala
- Factores o casillas:
  1. Carencia de paraderos seguros (TPPAR) con vigilancia y servicios para operadores en corredores 150D y Arco Norte.
  2. Déficit de talleres externos autorizados de mantenimiento pesado, alineación y rectificación CNC de chasis.
  3. Escasez de almacenes frigoríficos públicos y cámaras frías con servicio de cross-docking refrigerado.
  4. Cobertura deficiente y puntos ciegos de red celular / satelital en tramos carreteros montañosos de la región.
  5. Falta de centros regionales de capacitación y simulación de manejo defensivo / ecodriving para conductores.
  6. Sobrecostos y lentitud en servicios de grúas de arrastre y salvamento en accidentes carreteros.
- Puntos por factor: no están en el instrumento sectorial. Ver fórmulas de Borda en la sección F. El monto en MXN es captura libre y no entra a ninguna fórmula escrita.

#### N2-LOG-07 · `LG-TECH-01`

- Sección de origen: SECCIÓN II: AUDITORÍA TÉCNICA DE TELEMETRÍA, SEGURIDAD, CADENA DE FRÍO Y WMS/TMS
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Telemetría IoT, Monitoreo GPS y Gestión de Flota (FMS)
- Pregunta: Pregunta de Evaluación: ¿Cuál es el nivel de implementación tecnológica para el monitoreo en tiempo real, telemetría de motor y gestión de flotilla (FMS) en sus unidades de transporte?
- Opciones:
  1. `null` — Monitoreo GPS Básico / Instalación Posterior: Posicionamiento satelital simple por celda o GPS comercial sin telemetría de motor ni sensores de apertura de puerta.
  2. `null` — Telemetría CAN-Bus e Integración FMS: Monitoreo telemático conectado a la computadora del vehículo (CAN-Bus) para medir velocidad, frenados bruscos, consumo de diésel y horas de ralentí.
  3. `null` — Sistema de Telemetría IoT Activa Antirrobo: Sensores IoT de desenganche de quinta rueda, chapa satelital, detector de jammer (bloqueador de señal), paro de motor automático e integración con centro de monitoreo 24/7.
  4. `null` — Torre de Control Logístico / IA Predictiva: Plataforma integral FMS/TMS con algoritmos de IA para mantenimiento predictivo, ruteo dinámico y puntuación en tiempo real del comportamiento del conductor.

#### N2-LOG-08 · `LG-TECH-02`

- Sección de origen: SECCIÓN II: AUDITORÍA TÉCNICA DE TELEMETRÍA, SEGURIDAD, CADENA DE FRÍO Y WMS/TMS
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Sistemas de Gestión de Almacenes (WMS) y Cross-Docking Automatizado
- Pregunta: Pregunta de Evaluación: ¿Qué nivel de tecnología y automatización utiliza su empresa para el control de inventarios, recepción, acomodo y picking en sus almacenes o Cedis?
- Opciones:
  1. `null` — Registro Manual / Hojas de Cálculo: Control de inventarios en registros en papel o hojas de cálculo; procesos de entrada y salida sin escaneo de código de barras.
  2. `null` — Software ERP Básico / Registro de Ubicaciones: Módulo de inventarios del ERP con códigos de barras 1D/2D y terminales de radiofrecuencia (RF) para entradas y salidas.
  3. `null` — Sistema WMS Dedicado (Warehouse Management System): WMS avanzado con slotting dinámico (optimización de ubicaciones), waveless picking, trazabilidad LIFO/FIFO/FEFO automática y cross-docking programado.
  4. `null` — Almacén Automatizado / WCS / Robótica: Integración de WMS con sistemas de control de almacén (WCS), sorters automatizados, transelevadores o vehículos guiados autónomos (AGV/AMR) y Pick-to-Light / Voice Picking.

#### N2-LOG-09 · `LG-TECH-03`

- Sección de origen: SECCIÓN II: AUDITORÍA TÉCNICA DE TELEMETRÍA, SEGURIDAD, CADENA DE FRÍO Y WMS/TMS
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Certificaciones de Seguridad Internacional (C-TPAT / OEA) y Protocolos Antirrobo
- Pregunta: Pregunta de Evaluación: ¿Cuál es el nivel de certificación formal en seguridad de la cadena de suministro y prevención de delitos que ostenta su empresa?
- Opciones:
  1. `null` — Protocolo Interno Informal: Medidas de seguridad basadas en criterio operativo; sin auditorías de personal, antecedentes ni certificación de procesos.
  2. `null` — Cumplimiento de Requerimientos de Aseguradora: Instalación de dispositivos exigidos por la póliza de seguro (GPS, chapa, horario nocturno restringido) sin estándar internacional.
  3. `null` — Certificación C-TPAT y/o OEA Vigente: Certificación formal expedida por la CBP (EE.UU.) y/o el SAT (México) con procedimientos validados de seguridad física, de personal, socios comerciales y contenedores.
  4. `null` — Estándar Multicertificado (ISO 28000 / TAPA / C-TPAT / OEA): Sistema de gestión de seguridad ISO 28000 y/o TAPA TSR/FSR con auditorías no anunciadas, ciberseguridad industrial y resiliencia ante contingencias.

#### N2-LOG-10 · `LG-TECH-04`

- Sección de origen: SECCIÓN II: AUDITORÍA TÉCNICA DE TELEMETRÍA, SEGURIDAD, CADENA DE FRÍO Y WMS/TMS
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Logística de Cadena de Frío, Mantenimiento de Unidades y Monitoreo Térmico
- Pregunta: Pregunta de Evaluación: ¿Cómo garantiza su empresa el control preciso de temperatura y la humedad en el transporte de mercancías perecederas, medicamentos o químicos frágiles?
- Opciones:
  1. `null` — Sin Servicio de Frío / Transporte Seco: Operación exclusiva de carga seca; sin capacidad técnica ni unidades de refrigeración.
  2. `null` — Refrigeración Convencional sin Registro Telemático: Cajas refrigeradas con equipos Thermo King / Carrier ajustados manualmente; lectura de temperatura en termómetro de aguja sin registro continuo.
  3. `null` — Monitoreo Térmico Telemático Multi-zona: Cajas refrigeradas multi-temperatura con sensores telemáticos independientes en tiempo real, alertas de apertura de puerta y registros auditables para COFEPRIS / FDA.
  4. `null` — Cadena de Frío Ultrafina / Pharma-Grade (GDP / ISO 23412): Cumplimiento estricto de Buenas Prácticas de Distribución (GDP), calificación de cajas refrigeradas, mapeo térmico de 24 horas y túneles de pre-enfriado / cross-docking refrigerado.

#### N2-LOG-11 · `CP-LG-01`

- Sección de origen: SECCIÓN III: SOFISTICACIÓN PRODUCTIVA Y SALTO EN EL ESPACIO DE SERVICIOS (CIDE)
- Bloque: `complejidad`
- Tipo: `seleccion_unica`
- Enunciado: Reconversión hacia la 'Fruta Madura' Logística (Alta Densidad ω_j > 0.65)
- Pregunta: Pregunta de Evaluación: Considerando su infraestructura de transporte y almacén, ¿hacia cuál servicio logístico adyacente de mayor valor agregado tiene mayor viabilidad técnica de reconversión en < 12 meses?
- Opciones:
  1. `null` — Integración de Servicios 3PL: Incorporación de servicios de almacenaje dedicado, control de inventario, kitting y empaque secundario para industria automotriz/manufactura.
  2. `null` — Logística de Última Milla Urbana Inteligente: Rutas consolidadas de distribución urbana con ruteo optimizado para e-commerce, retail y consumo masivo.
  3. `null` — Operación de Cross-docking Refrigerado: Infraestructura de transferencia rápida de carga perecedera para conectarla agroindustria de Tehuacán y Sierra Norte con Cedis nacionales.
  4. `null` — Mantenimiento Especializado de Flotillas a Terceros: Apertura de taller mecánico pesado, verificación físico-mecánica NOM-068 e instalación telemática para empresas locales.

#### N2-LOG-12 · `CP-LG-02`

- Sección de origen: SECCIÓN III: SOFISTICACIÓN PRODUCTIVA Y SALTO EN EL ESPACIO DE SERVICIOS (CIDE)
- Bloque: `complejidad`
- Tipo: `seleccion_unica`
- Enunciado: Apuestas Estratégicas y Servicios Logísticos de Alta Complejidad (Alto ICPO)
- Pregunta: Pregunta de Evaluación: En un horizonte de 2 a 3 años con coinversión y vinculación estratégica, ¿en cuál segmento de alta complejidad tecnológica e internacional tiene visión de incursionar?
- Opciones:
  1. `null` — Operador 4PL / Control Tower Digital: Orquestación inteligente de cadenas globales mediante algoritmos de IA, analítica predictiva de tráfico y gestión aduanal multicliente.
  2. `null` — Logística Pharma-Grade y Cadena Ultrafina: Certificación GDP para transporte de biológicos, vacunas y reactivos a ultra-baja temperatura (-80°C) con trazabilidad auditable.
  3. `null` — Operación de Puerto Seco / Terminal Intermodal Ferroviaria: Terminal de transferencia contenedorizada ferrocarril-autotransporte con recinto fiscalizado estratégico (Ciudad Modelo / Tehuacán).
  4. `null` — Flota Cero Emisiones / Logística Verde Urbana: Operación de flotilla 100% eléctrica o alimentada por hidrógeno verde con infraestructura propia de recarga ultrarrápida.

#### N2-LOG-13 · `CP-LG-03`

- Sección de origen: SECCIÓN III: SOFISTICACIÓN PRODUCTIVA Y SALTO EN EL ESPACIO DE SERVICIOS (CIDE)
- Bloque: `complejidad`
- Tipo: `seleccion_unica`
- Enunciado: Descarbonización de Flotas, Eficiencia Energética y Logística Inversa
- Pregunta: Pregunta de Evaluación: ¿Qué nivel de avance tiene su empresa en la medición de huella de carbono, renovación de motores y gestión de logística inversa de tarimas/envases?
- Opciones:
  1. `null` — Sin Programa de Sustentabilidad: Flota con motores anteriores a EPA 04 / Euro IV, sin medición de emisiones CO2 ni programa de logística inversa.
  2. `null` — Mantenimiento para Emisiones / Motores Euro V: Mantenimiento regular para verificación vehicular y cumplimiento de normativa de humo; reemplazo progresivo por motores Euro V / EPA 07.
  3. `null` — Flota de Alta Eficiencia (Euro VI / Gas Natural) y Smart Driving: Adquisición de unidades Euro VI / EPA 10 / GNV, capacitación en conducción ecológica (Ecodriving) y medición de gCO2/ton-km.
  4. `null` — Flota Cero Emisiones / Economía Circular e ISO 14064: Integración de unidades eléctricas/híbridas en última milla, neutralidad de carbono certificada (ISO 14064) y programa de logística inversa de tarimas y envases.

#### N2-LOG-14 · `COL-LG01`

- Sección de origen: SECCIÓN IV: SOLUCIONES COLABORATIVAS ANTE LA FALLA DE ESCALA (BIENES DE CLUB)
- Bloque: `bienes_club`
- Tipo: `seleccion_unica`
- Enunciado: Centro Comunitario de Monitoreo GPS, Ciberseguridad y Conducción Segura
- Pregunta: Pregunta de Evaluación: ¿Cuál sería la disposición de su empresa para integrarse a una red compartida de monitoreo de seguridad en transporte, inteligencia de riesgos en el corredor 150D/Arco Norte y centro de simulación de manejo defensivo?
- Opciones:
  1. `null` — Desinterés o Desconfianza Absoluta: Prefiere gestionar la seguridad y capacitación de forma 100% aislada con recursos propios.
  2. `null` — Red Compartida de Alertas de Riesgo en Tiempo Real: Disposición a compartir datos anónimos de eventos de riesgo e incidentes en carretera para mapas de calor regionales.
  3. `null` — Co-financiamiento de Centro de Monitoreo Ciberseguro: Aportación de cuotas para operar un centro de monitoreo espejeado con la Guardia Nacional y simulador de manejo para choferes.
  4. `null` — Fideicomiso Logístico Integrado de Seguridad: Participación activa en un fideicomiso empresarial de seguridad patrimonial en transporte con patrullaje privado y escoltas consolidadas.

#### N2-LOG-15 · `COL-LG02`

- Sección de origen: SECCIÓN IV: SOLUCIONES COLABORATIVAS ANTE LA FALLA DE ESCALA (BIENES DE CLUB)
- Bloque: `bienes_club`
- Tipo: `seleccion_unica`
- Enunciado: Almacén Comunitario Multicliente en Frío y Cross-docking Regional
- Pregunta: Pregunta de Evaluación: ¿Cómo participaría su empresa en la operación o uso de un centro logístico multicliente con cámaras frías y rampas de cross-docking en nodos clave de Puebla-Tlaxcala bajo esquema de pago por servicio?
- Opciones:
  1. `null` — Mantenimiento de Esquema Individual: Continuar operando únicamente con bodegas propias o fletes secos sin infraestructura de frío.
  2. `null` — Usuario de Servicios Pay-per-Use en Frío: Contratación de servicios de consolidación y almacenaje refrigerado por tarima/día en un centro comunitario regional.
  3. `null` — Co-inversionista en Centro Logístico de Frío: Aportación de capital para equipar un almacén con túneles de pre-enfriado y certificación TAPA/GDP en un parque industrial local.
  4. `null` — Consorcio Operador Logístico Regional: Integración como socio fundador de una empresa integradora de servicios logísticos fríos para atender agroindustria y sector farmacéutico.

#### N2-LOG-16 · `COL-LG03`

- Sección de origen: SECCIÓN IV: SOLUCIONES COLABORATIVAS ANTE LA FALLA DE ESCALA (BIENES DE CLUB)
- Bloque: `bienes_club`
- Tipo: `seleccion_unica`
- Enunciado: Consorcio de Compras Consolidadas de Combustible, Llantas, Telemetría y Seguros
- Pregunta: Pregunta de Evaluación: ¿Qué grado de apertura tiene su empresa para asociarse en un consorcio de compras grupales que negocie tarifas corporativas en diésel, neumáticos, telemática y pólizas de seguro de carga?
- Opciones:
  1. `null` — Operación de Compras Aislada: Mantener negociaciones individuales con proveedores directos de insumos y aseguradoras.
  2. `null` — Participación en Bolsa de Compras de Diésel y Llantas: Integrar volumen de consumo de la flota para compras grupales spot de llantas, diésel y refacciones.
  3. `null` — Negociación Colectiva de Pólizas de Seguro de Carga: Sumar unidades al consorcio para licitar pólizas de seguro de flotilla con deducibles preferenciales y cobertura de robo.
  4. `null` — Consorcio Proveedor Logístico Integral: Creación de una comercializadora de insumos de autotransporte que incluya estación de autoconsumo de diésel y centro de renovado de llantas.


### Sector medico-hospitalario (`MED`) — 14 reactivos

Fuente: `docs/metodologia/03-instrumento-nivel2/medico-hospitalario.md`.

#### N2-MED-01 · `MED-01`

- Sección de origen: (sin encabezado)
- Bloque: `perfilado`
- Tipo: `seleccion_unica`
- Enunciado: Eslabón Dominante en la Cadena de Dispositivos Médicos y Salud
- Pregunta: Pregunta de Evaluación: ¿En cuál de los siguientes eslabones se concentra la mayor proporción de la facturación y actividad operativa de su establecimiento?
- Opciones:
  1. `M1 pts` — Material de Curación y Dispositivos de Consumo: Gasas, jeringas, suturas, batas estériles, cubrebocas y empaque biomédico.
  2. `M2 pts` — Equipamiento, Mobiliario e Instrumental Quirúrgico: Camas hospitalarias, lámparas de quirófano, mesas de exploración e instrumental de acero quirúrgico.
  3. `M3 pts` — Implantes, Osteosíntesis y Dispositivos de Alto Riesgo: Prótesis ortopédicas, tornillos de osteosíntesis, catéteres vasculares e implantes dentales.
  4. `M4 pts` — Reactivos IVD, Biotecnología y Software Médico (SaMD): Diagnosticadores in vitro, reactivos de laboratorio, sistemas de monitoreo y software médico.

#### N2-MED-02 · `MED-02`

- Sección de origen: (sin encabezado)
- Bloque: `perfilado`
- Tipo: `seleccion_unica`
- Enunciado: Cuenca Territorial y Micro-Región de Operación
- Pregunta: Pregunta de Evaluación: ¿En qué corredor industrial o municipio de la región Puebla - Tlaxcala se localiza la principal planta o centro de distribución de su empresa?
- Opciones:
  1. `R1 pts` — Zona Metropolitana Puebla-Cholula (ZMPT): Clúster de salud, parques industriales (FINSA, 2000) y cercanía a hospitales de alta especialidad.
  2. `R2 pts` — Corredor San Martín Texmelucan - Huejotzingo: Parques industriales de empaque, plásticos de ingeniería y textiles biomédicos.
  3. `R3 pts` — Tlaxcala (CIX I Tetla, CIX II Huamantla, CIX III Tlaxco): Fabricación de componentes plásticos, metálicos y textiles hospitalarios.
  4. `R4 pts` — Tehuacán y Atlixco: Fabricación de mobiliario, calzado clínico, uniformes quirúrgicos y distribución regional.

#### N2-MED-03 · `R00-MED-PROD`

- Sección de origen: (sin encabezado)
- Bloque: `borda_r00`
- Tipo: `ranking_borda`; N = 8
- Enunciado: Jerarquización de Fricciones en Producción Biomédica y Planta (Rompehielos de Jerarquizamiento Borda)
- Pregunta: Pregunta de Evaluación: Ordene del 1 al 8 los siguientes problemas operativos según el impacto económico negativo y gravedad que generan en su planta o taller
- Factores o casillas:
  1. Trámite y tiempos de resolución de Registro Sanitario COFEPRIS / Licencia Sanitaria de Planta.
  2. Costo de operación y mantenimiento de Cuartos Limpios (Clasificación ISO 14644 Clase 7 u 8).
  3. Cuellos de botella y costos en servicios de esterilización por contrato (Óxido de Etileno / Rayos Gamma / Vapor).
  4. Descalibración y falta de validación de sistemas metrológicos e instrumentos bajo ISO 13485.
  5. Dificultad para implementar la norma de trazabilidad y marcado único de dispositivos (UDI - Unique Device Identification).
  6. Mermas y sellado defectuoso en empaque primario estéril (Tyvek / Bolsas Grado Médico).
  7. Variaciones de energía eléctrica o falta de gases de proceso que interrumpen celdas de ensamble.
  8. Escasez y alta rotación de ingenieros biomédicos, biotecnólogos y técnicos de calidad acreditados.
- Puntos por factor: no están en el instrumento sectorial. Ver fórmulas de Borda en la sección F. El monto en MXN es captura libre y no entra a ninguna fórmula escrita.

#### N2-MED-04 · `R00-MED-SOURCING-MAT`

- Sección de origen: (sin encabezado)
- Bloque: `borda_r00`
- Tipo: `ranking_borda`; N = 6
- Enunciado: Jerarquización de Riesgos en Sourcing de Materias Primas Biomédicas (Rompehielos de Jerarquizamiento Borda)
- Pregunta: Pregunta de Evaluación: Ordene del 1 al 6 los principales riesgos y cuellos de botella en la compra e importación de insumos médicos de producción
- Factores o casillas:
  1. Dependencia de resinas plásticas grado médico certificadas (USP Clase VI / ISO 10993).
  2. Escasez y costo de acero inoxidable quirúrgico (316L / 420) y aleaciones de Titanio (Ti6Al4V).
  3. Tiempos de entrega prolongados (> 12 semanas) en componentes electrónicos y sensores biomédicos.
  4. Volatilidad de precios en papel y película de empaque estéril (Tyvek de DuPont / Pouches).
  5. Volúmenes Mínimos de Compra (MOQ) impagables en distribuidores globales de materia prima.
  6. Trámites aduanales lentos y retención de insumos biomédicos por permisos de importación.
- Puntos por factor: no están en el instrumento sectorial. Ver fórmulas de Borda en la sección F. El monto en MXN es captura libre y no entra a ninguna fórmula escrita.

#### N2-MED-05 · `R00-MED-SOURCING-SERV`

- Sección de origen: (sin encabezado)
- Bloque: `borda_r00`
- Tipo: `ranking_borda`; N = 6
- Enunciado: Jerarquización de Deficiencias en Servicios Especializados Externos (Rompehielos de Jerarquizamiento Borda)
- Pregunta: Pregunta de Evaluación: Ordene del 1 al 6 las mayores deficiencias de infraestructura y servicios externos en la región Puebla-Tlaxcala
- Factores o casillas:
  1. Carencia de laboratorios regionales acreditados ISO 17025 para pruebas de Biocompatibilidad (ISO 10993).
  2. Ausencia de plantas locales de esterilización industrial por contrato (obligación de enviar a CDMX/Estado de México).
  3. Falta de laboratorios de validación de empaque estéril y vida de anaquel (ISO 11607).
  4. Escasez de firmas de consultoría acreditadas para auditorías de preparación COFEPRIS / FDA 21 CFR 820.
  5. Deficiencias en empresas autorizadas para la recolección y tratamiento de residuos biológico-infecciosos (RPBI).
  6. Sobrecostos de fletes dedicados con temperatura y humedad controlada hacia hospitales/distribuidores.
- Puntos por factor: no están en el instrumento sectorial. Ver fórmulas de Borda en la sección F. El monto en MXN es captura libre y no entra a ninguna fórmula escrita.

#### N2-MED-06 · `MD-01`

- Sección de origen: (sin encabezado)
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Madurez del Sistema de Gestión de Calidad para Dispositivos Médicos (ISO 13485 / COFEPRIS)
- Pregunta: Pregunta de Evaluación: ¿Cuál es el estatus de certificación formal y cumplimiento regulatorio del sistema de calidad de su planta?
- Opciones:
  1. `25 pts` — Cumplimiento Sanitario Básico: Aviso de Funcionamiento COFEPRIS y Buenas Prácticas de Fabricación empíricas.
  2. `50 pts` — Licencia Sanitaria y NOM-241-SSA1 Vigente: Buenas Prácticas de Fabricación auditadas por COFEPRIS con Registro Sanitario de productos.
  3. `75 pts` — Certificación ISO 13485:2016 Vigente: Sistema de Gestión de Calidad específico para dispositivos médicos certificado por Organismo Notificado.
  4. `100 pts` — Acreditación Internacional Avanzada (FDA / CE Mark / MDSAP): Cumplimiento de FDA 21 CFR 820, Marcado CE (MDR) o MDSAP para exportación global.

#### N2-MED-07 · `MD-02`

- Sección de origen: (sin encabezado)
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Control de Áreas Limpias y Monitoreo Ambiental (ISO 14644)
- Pregunta: Pregunta de Evaluación: ¿Con qué tipo de infraestructura de control ambiental y cuartos limpios cuenta su planta para ensamble o empaque biomédico?
- Opciones:
  1. `25 pts` — Ensamble en Área Convencional: Mantenimiento de limpieza estándar sin filtración HEPA ni control de presión diferencial.
  2. `50 pts` — Área Controlada No Certificada: Inyección de aire filtrado y control de polvo básico, pero sin clasificación ISO formal.
  3. `75 pts` — Cuarto Limpio Certificado (ISO 14644 Clase 7 u 8 / Grado C-D): Filtración HEPA, flujo laminar, presión positiva y monitoreo de partículas/gérmenes.
  4. `100 pts` — Área Estéril de Alta Purificación (ISO 14644 Clase 5 / Grado A-B): Aislamiento automatizado para llenado aséptico o ensamble implantable.

#### N2-MED-08 · `MD-03`

- Sección de origen: (sin encabezado)
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Validación del Proceso de Esterilización y Empaque Primario (ISO 11607)
- Pregunta: Pregunta de Evaluación: ¿Cómo valida y garantiza la esterilidad y vida de anaquel de sus productos médicos hasta el punto de uso clínico?
- Opciones:
  1. `25 pts` — Sin Proceso de Esterilización / Empaque Básico: Venta de producto no estéril en bolsas de polietileno convencionales.
  2. `50 pts` — Esterilización Externa sin Validación de Empaque: Contratación de maquila de esterilización por vapor/EtO pero sin estudios ISO 11607 de sellado.
  3. `75 pts` — Proceso Validado con Pouch Tyvek/Papel Grado Médico: Protocolos de esterilización validados (EtO/Gamma) y empaque primario con indicador químico/biológico.
  4. `100 pts` — In-house / Validación de Envejecimiento Acelerado: Esterilización con trazabilidad en lote, pruebas de integridad de burbuja (ASTM F2096) y envejecimiento en tiempo real.

#### N2-MED-09 · `MD-04`

- Sección de origen: (sin encabezado)
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Trazabilidad Unitaria, Marcado UDI y Gestión de Tecnovigilancia
- Pregunta: Pregunta de Evaluación: ¿Con qué nivel de automatización rastrea los dispositivos médicos e informa eventos adversos a la autoridad sanitaria?
- Opciones:
  1. `25 pts` — Registros Manuales por Lote: Bitácoras en papel por lote de producción; rastreo hacia hospital toma más de 24 horas.
  2. `50 pts` — Registro Semiautomatizado en ERP: Trazabilidad de lote en software contable/ERP, pero sin código único impreso en pieza.
  3. `75 pts` — Marcado UDI Serializado (Código DataMatrix / GS1): Código DataMatrix impreso por láser o etiqueta que identifica dispositivo, lote y caducidad.
  4. `100 pts` — Tecnovigilancia Integrada e IoT: Sistema automatizado de tecnovigilancia conectado con hospitales y notificación en tiempo real a COFEPRIS/FDA.

#### N2-MED-10 · `CP-MED-01`

- Sección de origen: (sin encabezado)
- Bloque: `complejidad`
- Tipo: `seleccion_sin_puntaje_markup_checkbox`
- Enunciado: Reconversión hacia la 'Fruta Madura' Biomédica (Alta Densidad ω_j > 0.65)
- Pregunta: Pregunta de Evaluación: Considerando su capacidad actual de moldeo, maquinado o ensamble, ¿hacia cuál dispositivo de mayor margen tiene viabilidad técnica de reconversión en < 12 meses?
- Factores o casillas:
  1. Kitting y Ensamble de Bolsas / Sistemas de Drenaje / Ostomía: Ensamble de tubos de silicona, conectores y bolsas de grado médico.
  2. Material de Curación Avanzado e Hidrogeles: Apósitos con plata nanocristalina, colágeno y vendajes especializados.
  3. Mobiliario Hospitalario Inteligente y Electromecánico: Camas con control digital, grúas de transferencia y carros de paro.
  4. Instrumental Quirúrgico de Precisión: Tijeras, pinzas y separadores en acero 420/316L con recubrimiento nitruro de titanio.

#### N2-MED-11 · `CP-MED-02`

- Sección de origen: (sin encabezado)
- Bloque: `complejidad`
- Tipo: `seleccion_sin_puntaje_markup_checkbox`
- Enunciado: Apuestas Estratégicas y Dispositivos de Alta Complejidad (Alto ICPO)
- Pregunta: Pregunta de Evaluación: En un horizonte de 2 a 3 años con apoyo de coinversión y vinculación universitaria, ¿en cuál segmento de alta sofisticación tiene visión de incursionar?
- Factores o casillas:
  1. Implantes Ortopédicos y Placas de Osteosíntesis: Placas y tornillos de Titanio Ti6Al4V o PEEK impresos en 3D/CNC 5 ejes.
  2. Dispositivos de Diagnóstico In Vitro (IVD) y Biosensores: Tiras reactivas, casetes de prueba rápida microfluídicos e in vitro.
  3. Software como Dispositivo Médico (SaMD) e Inteligencia Artificial: Algoritmos de análisis de imágenes médicas (PACS/RIS) y monitoreo telemático.
  4. Equipamiento Biomédico Electrónico: Desfibriladores, oxímetros de pulso, monitores de signos vitales y bombas de infusión.

#### N2-MED-12 · `COL-MED01`

- Sección de origen: (sin encabezado)
- Bloque: `bienes_club`
- Tipo: `seleccion_unica`
- Enunciado: Planta Regional de Esterilización por Contrato (EtO / Gamma) y Cuartos Limpios Comunitarios
- Pregunta: Pregunta de Evaluación: ¿Cuál sería la disposición de su empresa para utilizar una planta común de esterilización industrial y cuartos limpios compartidos bajo esquema Pay-per-Use?
- Opciones:
  1. `0 pts` — Sin Interés: Mantiene esquemas de esterilización propia o envío tradicional a CDMX/Estado de México.
  2. `33 pts` — Contratación de Maquila de Esterilización en Región: Interés en utilizar una planta local acreditada pagando por lote/m3.
  3. `66 pts` — Arrendamiento de Espacio en Cuarto Limpio Comunitario: Uso de módulos de ensamble estéril ISO Clase 7 para corridas piloto.
  4. `100 pts` — Coinversión y Gobernanza Fiduciaria: Aportación de capital o cuotas fijas para cofinanciar un parque biomédico regional.

#### N2-MED-13 · `COL-MED02`

- Sección de origen: (sin encabezado)
- Bloque: `bienes_club`
- Tipo: `seleccion_unica`
- Enunciado: Laboratorio Regional de Biocompatibilidad y Ensayos Biomédicos (Cuádruple Hélice)
- Pregunta: Pregunta de Evaluación: ¿Cómo participaría su empresa en una alianza regional (Empresas - Universidad - Gobierno) para equipar un laboratorio acreditado ISO 17025 para ISO 10993?
- Opciones:
  1. `0 pts` — Mantenimiento de Contratación Externa Remota: Continuar enviando muestras a laboratorios extranjeros o comerciales.
  2. `33 pts` — Bolsa Regional de Muestras: Agrupar ensayos de biocompatibilidad para obtener tarifas preferenciales.
  3. `66 pts` — Alianza con Centros de Investigación Locales: Convenio con laboratorios de la BUAP, UDLAP, UPAEP o IPN para uso de equipos.
  4. `100 pts` — Acreditación de Laboratorio Comunitario in situ: Aportación activa a un fondo fiduciario para acreditar el laboratorio ante EMA y FDA.

#### N2-MED-14 · `COL-MED03`

- Sección de origen: (sin encabezado)
- Bloque: `bienes_club`
- Tipo: `seleccion_unica`
- Enunciado: Mesa de Compra Consolidada de Resinas USP VI, Acero Surgical y Tyvek
- Pregunta: Pregunta de Evaluación: ¿Qué grado de apertura tiene su empresa para asociarse en un comité de compras agrupadas de materias primas biomédicas para alcanzar los MOQ de distribuidoras globales?
- Opciones:
  1. `0 pts` — Operación Individual Aislar: Compra independiente asumiendo sobreprecio y mínimos de compra.
  2. `50 pts` — Consolidación de Pedidos de Empaque y Resinas: Agrupar volumen de compra de bolsas Tyvek, resinas USP VI y empaque.
  3. `100 pts` — Consorcio Exportador y Compras de Insumos Quirúrgicos: Consorcio formal para importación directa de acero 316L, Titanio y componentes SMT biomédicos.


### Sector metalmecanica (`METAL`) — 16 reactivos

Fuente: `docs/metodologia/03-instrumento-nivel2/metalmecanica.md`.

#### N2-METAL-01 · `MM-01`

- Sección de origen: (sin encabezado)
- Bloque: `perfilado`
- Tipo: `seleccion_unica`
- Enunciado: Eslabón Dominante en la Cadena Metalmecánica y Transformación Metálica
- Pregunta: Pregunta de Evaluación: ¿En cuál de los siguientes eslabones tecnológicos se concentra la mayor proporción de la facturación y capacidad de proceso de su taller o planta?
- Opciones:
  1. `25 pts` — Maquinado de Precisión CNC (Torneado, Fresado 3/5 Ejes, Mandrinado): Fabricación de componentes mecánicos, flechas, engranes, bujes o bloques con tolerancias estrechas en micras.
  2. `22 pts` — Troquelado, Estampado y Conformado Pesado/Ligero: Prensas mecánicas, hidráulicas o transfer para conformado de lámina, chasis, soportes metálicos o herrajes.
  3. `20 pts` — Soldadura Estructurada, Pailería y Celdas de Calderería: Fabricación de estructuras metálicas, tanques a presión, bastidores y tubos electrosoldados con procesos SMAW, GMAW/MIG, GTAW/TIG o robótico.
  4. `18 pts` — Tratamientos Térmicos, Recubrimientos Superficiales y Ensamble Mecánico: Temple, cementado, nitrurado, galvanizado, pintura electrostática, rectificado plano/cilíndrico o integración de subensambles.

#### N2-METAL-02 · `MM-02`

- Sección de origen: (sin encabezado)
- Bloque: `perfilado`
- Tipo: `seleccion_unica`
- Enunciado: Cuenca Territorial y Micro-Región Productiva
- Pregunta: Pregunta de Evaluación: ¿En qué corredor o parque industrial de la región Puebla - Tlaxcala se localiza la principal nave de manufactura de su empresa?
- Opciones:
  1. `ZMPT` — Zona Metropolitana Puebla - Valles Centrales (FINSA, Cuautlancingo, 2000, Amozoc, Resurrección): Alta densidad en proveeduría de estampado, maquinado y herramentales para el sector automotriz.
  2. `CIX-TLAX` — Corredor Industrial Tlaxcala (Apizaco, CIX I Tetla, CIX II Huamantla, CIX III Tlaxco, Calpulalpan): Especialización en estructuras metálicas, fundición, autopartes metálicas y equipo ferroviario.
  3. `HUE-TEX` — Corredor Huejotzingo - San Martín Texmelucan - San Salvador El Verde: Concentración en taller de pailería, estructuras industriales y herrajes metálicos.
  4. `TEH` — Tehuacán y Valles del Sur (ZMTH): Pailería agrícola, mantenimiento de maquinaria alimenticia/avícola y fabricación de remolques y carrocerías secas.

#### N2-METAL-03 · `MM-03`

- Sección de origen: (sin encabezado)
- Bloque: `perfilado`
- Tipo: `seleccion_unica`
- Enunciado: Equipamiento y Capacidad Tecnológica Instalada
- Pregunta: Pregunta de Evaluación: ¿Cuál es la tecnología de maquinaria-herramienta predominante en el piso de producción de su establecimiento?
- Opciones:
  1. `5 pts` — Maquinaria Convencional Básica: Tornos paralelos, fresadoras universales, taladros de columna y cortadoras mecánicas operadas manualmente sin lectores digitales (DRO).
  2. `12 pts` — Maquinaria Convencional con DRO y Tornos CNC Básicos: Fresadoras y tornos convencionales con lectores ópticos DRO y tornos CNC de 2 ejes para trabajo por lote medio.
  3. `20 pts` — Centros de Maquinado CNC de 3/4 Ejes y Prensas Mecánicas Automatizadas: Centros de mecanizado vertical CNC con cambio automático de herramienta (ATC), tornos con herramienta viva y prensas con alimentador.
  4. `25 pts` — Centros de Maquinado CNC de 5 Ejes Simultáneos / Torneado Multifunción: Celdas robóticas de maquinado/soldadura, electroerosión por hilo (EDM) y prensas transfer de alto tonelaje (>1,000 ton).

#### N2-METAL-04 · `R00-MM-PROD`

- Sección de origen: (sin encabezado)
- Bloque: `borda_r00`
- Tipo: `ranking_borda`; N = 8
- Enunciado: Jerarquización de Fricciones en Maquinado, Estampado y Pailería (Rompehielos de Jerarquización)
- Pregunta: Pregunta de Jerarquización: Ordene del 1 al 8 los siguientes problemas comunes de producción según el impacto económico negativo y la frecuencia con que afectan la rentabilidad de su taller o planta (1 = Mayor impacto / Máxima gravedad; 8 = Menor impacto)
- Factores o casillas:
  1. Desgaste prematuro o fractura de cortadores, insertos de carburo y brocas en maquinado de materiales duros.
  2. Vibraciones (chatter), marcas de herramienta o mal acabado superficial en torneado y fresado de precisión.
  3. Deformaciones térmicas y alabeo en piezas delgadas por esfuerzos de soldadura o calentamiento en corte.
  4. Tiempos de set-up excesivos en el montaje de troqueles, prensas, fijaciones (fixtures) y alineación CNC (SMED).
  5. Cuellos de botella en la liberación metrológica y calibración de instrumentos bajo tolerancias geométricas (GD&T).
  6. Paros imprevistos por fallas mecánicas en husillos CNC, juegos en husillos a bolas o fugas hidráulicas en prensas.
  7. Escasez crítica y alta rotación de maquinistas CNC, programadores CAM, matriceros y soldadores certificados AWS.
  8. Rechazo dimensional (scrap) por errores de programación CAM, desgaste de troquel o desalineación de bancada.
- Puntos por factor: no están en el instrumento sectorial. Ver fórmulas de Borda en la sección F. El monto en MXN es captura libre y no entra a ninguna fórmula escrita.

#### N2-METAL-05 · `R00-MM-SOURCING-MAT`

- Sección de origen: (sin encabezado)
- Bloque: `borda_r00`
- Tipo: `ranking_borda`; N = 6
- Enunciado: Jerarquización de Riesgos en Sourcing de Metales e Insumos de Corte (Rompehielos de Jerarquización)
- Pregunta: Pregunta de Jerarquización: Ordene del 1 al 6 los principales cuellos de botella que enfrenta su empresa en la compra de aceros especiales, aleaciones y herramental de corte (1 = Mayor impacto negativo / Máxima gravedad; 6 = Menor impacto)
- Factores o casillas:
  1. Escasez y largos tiempos de entrega en aceros especiales grado herramienta (D2, H13, 4140, 8620) forjados.
  2. Dificultad para conseguir perfiles estructurales de aluminio y placas de aleaciones especiales (series 6000/7000).
  3. Desabasto o mala calidad en soldaduras de aportación específicas (microalambre, electrodos inoxidables/aluminio).
  4. Dependencia de insertos de corte de carburo cementado y herramental especializado de marcas importadas.
  5. Alta volatilidad en precios de acero laminado, lámina galvánica y chatarra que erosiona el margen cotizado.
  6. Exigencia de volúmenes mínimos de compra (MOQ) por parte de centros de servicio siderúrgicos inalcanzables para PyME.
- Puntos por factor: no están en el instrumento sectorial. Ver fórmulas de Borda en la sección F. El monto en MXN es captura libre y no entra a ninguna fórmula escrita.

#### N2-METAL-06 · `R00-MM-SOURCING-SERV`

- Sección de origen: (sin encabezado)
- Bloque: `borda_r00`
- Tipo: `ranking_borda`; N = 6
- Enunciado: Jerarquización de Deficiencias en Servicios Especializados e Infraestructura (Rompehielos de Jerarquización)
- Pregunta: Pregunta de Jerarquización: Ordene del 1 al 6 las mayores deficiencias de servicios externos e infraestructura que limitan la competitividad de su taller en Puebla-Tlaxcala (1 = Mayor impacto negativo / Máxima gravedad; 6 = Menor impacto)
- Factores o casillas:
  1. Carencia de plantas regionales de tratamiento térmico comercial certificado (CQI-9) para temple, cementado y nitrurado.
  2. Falta de proveedores locales de galvanizado en caliente, tropicalizado y pintura electrostática acreditados (CQI-11/12).
  3. Inexistencia de laboratorios regionales acreditados ISO/IEC 17025 para ensayos mecánicos (tracción, dureza) y NDT.
  4. Falta de talleres con capacidad para rectificado plano/cilíndrico de gran formato y afilado CNC de herramientas.
  5. Ausencia de servicios regionales de recubrimiento PVD/TiN/TiAlN para aumentar vida útil de herramental de corte.
  6. Inseguridad y robos de transporte de carga pesada de acero en las autopistas México-Puebla, Veracruz y Arco Norte.
- Puntos por factor: no están en el instrumento sectorial. Ver fórmulas de Borda en la sección F. El monto en MXN es captura libre y no entra a ninguna fórmula escrita.

#### N2-METAL-07 · `MM-TECH-01`

- Sección de origen: (sin encabezado)
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Tolerancias Dimensionales y Control de Maquinado / Estampado
- Pregunta: Pregunta de Evaluación: ¿Cómo controla y garantiza su empresa las tolerancias dimensionales y geométricas (GD&T) en sus procesos de maquinado o estampado?
- Opciones:
  1. `5 pts` — Control Manual Básico: Verificación ocasional con vernier, micrómetro exterior y calibradores pasa/no-pasa a criterio del operador; sin estudios de capacidad de proceso.
  2. `12 pts` — Hojas de Inspección por Lote: Control dimensional documentado en primera pieza y liberación de lote; uso de micrómetros de interiores, comparadores ópticos y rugosímetros manuales.
  3. `20 pts` — Control Estadístico de Proceso (SPC) en Pie de Máquina: Gráficos de control X-R para características críticas de plano; cálculo de Cp/Cpk ≥ 1.33 con palpadores de medida en CNC.
  4. `25 pts` — Inspección Automatizada en Célula / Cpk ≥ 1.67: Sondas de palpado renishaw integradas en el ciclo CNC para autocorrección de offsets de herramienta y control Poka-Yoke.

#### N2-METAL-08 · `MM-TECH-02`

- Sección de origen: (sin encabezado)
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Inspección Metrológica y Ensayos No Destructivos (CND / NDT)
- Pregunta: Pregunta de Evaluación: ¿Qué infraestructura y métodos de inspección utiliza su empresa para detectar grietas internas, porosidad o discontinuidades en piezas maquinadas o soldadas?
- Opciones:
  1. `5 pts` — Inspección Visual Simple: Verificación exclusivamente visual de cordones de soldadura y superficies maquinadas sin equipos de inspección interna.
  2. `12 pts` — Inspección con Tintas Penetrantes Básica: Pruebas de tintas penetrantes o partículas magnéticas aplicadas de forma empírica ante reclamos del cliente.
  3. `20 pts` — Laboratorio Metrológico CMM y NDT Formal: Brazo metrológico articulado o máquina de coordenadas CMM propia; inspectores nivel II en tintas penetrantes y ultrasonido.
  4. `25 pts` — Acreditación Completa en CND / NDT Nivel II/III: Ultrasonido industrial por arreglo de fases (PAUT), radiografía industrial y laboratorio metrológico certificado ISO/IEC 17025.

#### N2-METAL-09 · `MM-TECH-03`

- Sección de origen: (sin encabezado)
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Procesos de Soldadura y Calificación de Procedimientos (WPS / PQR)
- Pregunta: Pregunta de Evaluación: ¿Cuál es el grado de formalización y certificación de sus procesos de soldadura y del personal de soldadores?
- Opciones:
  1. `5 pts` — Soldadura Empírica Tradicional: Soldadores prácticos sin calificación formal; aplicación de cordones sin especificación de procedimiento de soldadura (WPS).
  2. `12 pts` — Procedimientos Estándar Internos: Especificaciones de soldadura internas documentadas; prueba de soldadores mediante inspección visual y doblez guiado informal.
  3. `20 pts` — Procedimientos Calificados (WPS / PQR): Especificaciones de procedimiento (WPS) respaldadas por registros de calificación (PQR) probados en laboratorio acreditado.
  4. `25 pts` — Celdas Robóticas / Certificación AWS CWI / ASME: Celdas robóticas de soldadura MIG/TIG con monitoreo de voltaje/amperaje e inspector de soldadura certificado CWI en planta.

#### N2-METAL-10 · `MM-TECH-04`

- Sección de origen: (sin encabezado)
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Mantenimiento, Geometría de Husillos y Confiabilidad CNC
- Pregunta: Pregunta de Evaluación: ¿Cómo gestiona su taller la precisión geométrica, la nivelación de bancadas y el mantenimiento preventivo de sus máquinas-herramienta y prensas?
- Opciones:
  1. `5 pts` — Mantenimiento Reactivo por Avería: Mantenimiento ejecutado únicamente cuando la máquina se detiene o pierde precisión ostensiblemente.
  2. `12 pts` — Mantenimiento Preventivo Mecánico Básico: Cambio periódico de aceites de lubricación de guías, filtros de refrigerante y limpieza manual de viruta.
  3. `20 pts` — Verificación Geométrica Periódica: Nivelación de bancadas con niveles de precisión, prueba de barra de calibración (Ballbar test) y mantenimiento planificado TPM.
  4. `25 pts` — Gestión de Confiabilidad y Compensación Láser: Calibración interferométrica láser de ejes CNC, análisis de vibración de husillos (spindle health) y mantenimiento predictivo.

#### N2-METAL-11 · `CP-MM-01`

- Sección de origen: (sin encabezado)
- Bloque: `complejidad`
- Tipo: `seleccion_unica`
- Enunciado: Reconversión hacia la 'Fruta Madura' Metalmecánica (Alta Densidad ω_j > 0.65)
- Pregunta: Pregunta de Evaluación: Considerando su parque de tornos, fresadoras, prensas o soldadoras, ¿hacia cuál de los siguientes productos maquinados o fabricados adyacentes tiene mayor viabilidad técnica de reconversión en menos de 12 meses?
- Opciones:
  1. `FM-01` — Componentes Troquelados de Precisión para Chasis y Suspensión: Soportes, abrazaderas y refuerzos metálicos estampado en aceros de alta resistencia.
  2. `FM-02` — Carcasas y Bloques Maquinados de Fundición de Aluminio: Maquinado de precisión para cuerpos de bomba, cajas de transmisión o cárter automotriz e industrial.
  3. `FM-03` — Estructuras Electrosoldadas Certificadas para Equipo Pesado: Bastidores, marcos y aditamentos para maquinaria agrícola, construcción y sector ferroviario.
  4. `FM-04` — Herrajes y Fijaciones Especiales de Alta Resistencia: Tornillería grado 8/10.9, pernos maquinados y conectores hidráulicos de acero aleado.

#### N2-METAL-12 · `CP-MM-02`

- Sección de origen: (sin encabezado)
- Bloque: `complejidad`
- Tipo: `seleccion_unica`
- Enunciado: Apuestas Estratégicas y Productos de Alta Complejidad (Alto ICPO)
- Pregunta: Pregunta de Evaluación: En un horizonte de 2 a 3 años con apoyo de coinversión en tecnología y certificación, ¿en cuál de los siguientes segmentos de alta complejidad tiene visión de incursionar?
- Opciones:
  1. `AP-01` — Placas Disipadoras y Estructuras de Aluminio para Vehículos Eléctricos: Placas de enfriamiento (cold plates) y cajas estructurales para módulos de batería EV.
  2. `AP-02` — Componentes Maquinados para Sector Energético y Petroquímico: Válvulas de alta presión, bridas forjadas y conexiones bajo norma API / ASME.
  3. `AP-03` — Partes Maquinadas para Sector Ferroviario y Transporte Pesado: Manguetas, ejes, discos de freno y acoplamientos para vagones y locomotoras.
  4. `AP-04` — Componentes de Precisión Aeronáuticos o Médico-Quirúrgicos: Implantes de titanio, instrumental quirúrgico o herrajes aeronáuticos bajo norma AS9100.

#### N2-METAL-13 · `CP-MM-03`

- Sección de origen: (sin encabezado)
- Bloque: `complejidad`
- Tipo: `seleccion_unica`
- Enunciado: Economía Circular, Segregación de Viruta y Recuperación de Solubles
- Pregunta: Pregunta de Evaluación: ¿Qué destino y nivel de procesamiento otorga actualmente su empresa a la viruta de maquinado, despunte de lámina y fluidos de corte (refrigerantes/solubles)?
- Opciones:
  1. `5 pts` — Venta de Viruta Mezclada / Desecho sin Filtrar: Venta de viruta revuelta de acero y aluminio impregnada de soluble a recolectores de chatarra a bajo precio.
  2. `12 pts` — Segregación Básica por Tipo de Metal: Separación física de viruta de aluminio, acero al carbón e inoxidable en tambores diferenciados.
  3. `20 pts` — Centrifugado de Viruta y Filtración de Refrigerante: Decantación y centrifugado para recuperar soluble de corte y compactación básica de viruta.
  4. `25 pts` — Planta de Briquetado Automatizado y Regeneración de Refrigerante: Prensa briquetadora hidráulica que recupera 98% del fluido de corte y genera briquetes metálicos densos para fundición.

#### N2-METAL-14 · `COL-MM01`

- Sección de origen: (sin encabezado)
- Bloque: `bienes_club`
- Tipo: `seleccion_unica`
- Enunciado: Centro Comunitario de Maquinado 5 Ejes y Tratamientos Térmicos (Tooling Hub)
- Pregunta: Pregunta de Evaluación: ¿Cuál sería la disposición de su empresa para utilizar o cofinanciar un centro regional compartido equipado con mecanizado CNC 5 ejes y hornos de tratamiento térmico CQI-9 bajo esquema Pay-per-Use?
- Opciones:
  1. `5 pts` — Desinterés u Operación Aislada: Prefiere continuar rechazando trabajos de alta complejidad o tercerizándolos fuera del estado.
  2. `12 pts` — Contratación por Horas de Maquinado (Pay-per-Use): Interés en rentar horas de centro 5 ejes o servicio de horno térmico para piezas específicas.
  3. `20 pts` — Membresía y Coinversión en Infraestructura: Disposición a aportar cuotas de capital para equipar un taller comunitario administrado por el clúster metalmecánico.
  4. `25 pts` — Gobernanza Fiduciaria Completa: Participación en un fideicomiso regional (Empresas - Universidad - Gobierno) para operar el centro en un parque industrial (FINSA / Apizaco / CIX).

#### N2-METAL-15 · `COL-MM02`

- Sección de origen: (sin encabezado)
- Bloque: `bienes_club`
- Tipo: `seleccion_unica`
- Enunciado: Laboratorio Metrológico y de Ensayos Mecánicos / NDT Compartido
- Pregunta: Pregunta de Evaluación: ¿Cómo participaría su empresa en una alianza regional de Cuádruple Hélice para operar un laboratorio comunitario acreditado ISO/IEC 17025 de metrología CMM, ensayos de tracción y radiografía industrial?
- Opciones:
  1. `5 pts` — Mantenimiento de Esquema Individual: Continuar enviando probetas a ensayos fuera del estado asumiendo demoras de 5 a 8 días.
  2. `12 pts` — Bolsa Regional de Inspección Metrológica: Sumar volumen de pruebas dimensionales y NDT para negociar tarifas preferenciales.
  3. `20 pts` — Laboratorio Comunitario en Campus Universitario: Co-financiar el equipamiento metrológico en una universidad técnica regional (BUAP / UPT / UTT).
  4. `25 pts` — Acreditación ISO/IEC 17025 in Situ: Participación en el comité técnico para que el laboratorio emita reportes oficiales reconocidos internacionalmente.

#### N2-METAL-16 · `COL-MM03`

- Sección de origen: (sin encabezado)
- Bloque: `bienes_club`
- Tipo: `seleccion_unica`
- Enunciado: Mesa de Compra Consolidada de Aceros Especiales y Herramientas de Corte
- Pregunta: Pregunta de Evaluación: ¿Qué grado de apertura tiene su empresa para asociarse en un comité de compras agrupadas que consolide el volumen de acero especial (D2, H13, 4140), aluminio e insertos de carburo?
- Opciones:
  1. `5 pts` — Compras Atomizadas Aisladas: Mantener la compra individual a distribuidores locales pagando sobreprecio por bajo volumen.
  2. `12 pts` — Consolidación de Pedidos de Aceros Estándar: Disposición a sumar volumen de placas y barras comerciales para compras consolidadas mensuales.
  3. `20 pts` — Consorcio de Importación Directa de Herramental: Participar en un grupo de compra para importar insertos y cortadores directamente de fabricantes globales.
  4. `25 pts` — Fideicomiso de Compras y Almacén en Consignación: Co-financiar un stock común regional de aceros forjados y componentes de sujeción para socios.


### Sector muebles (`MUEB`) — 16 reactivos

Fuente: `docs/metodologia/03-instrumento-nivel2/muebles.md`.

#### N2-MUEB-01 · `MB-01`

- Sección de origen: (sin encabezado)
- Bloque: `perfilado`
- Tipo: `seleccion_unica`
- Enunciado: Eslabón Dominante en la Cadena Mueblera y Madera
- Pregunta: Pregunta de Evaluación: ¿En cuál de los siguientes eslabones de procesamiento o fabricación se concentra la mayor facturación de su taller o fábrica?
- Opciones:
  1. `25 pts` — Aserrado, Dimensionado y Estufado de Madera: Primera transformación de la troza en tabla/tablón estufado y tratado.
  2. `50 pts` — Fabricación de Mueble de Madera Sólida / Artesanal: Mueble rústico, torneado, ebanistería tradicional o carpintería a medida.
  3. `75 pts` — Mueble Modular de Ingeniería / RTA (MDF / Aglomerado): Mobiliario desarmable en tableros melamínicos, cocinas y closets RTA.
  4. `100 pts` — Mobiliario Institucional, Hospitalario y Contract / Hotelero: Proyectos a gran escala con especificaciones arquitectónicas y fuego/humedad.

#### N2-MUEB-02 · `MB-02`

- Sección de origen: (sin encabezado)
- Bloque: `perfilado`
- Tipo: `seleccion_unica`
- Enunciado: Cuenca Territorial y Micro-Región Mueblera
- Pregunta: Pregunta de Evaluación: ¿En qué cuenca forestal o corredor industrial de Puebla - Tlaxcala se ubica su centro de producción?
- Opciones:
  1. `null` — Región 1: Tlaxco y Altiplano Central Tlaxcalteca (Tlaxco, Apizaco, Terrenate): Aserraderos, estufado y mueble de pino.
  2. `null` — Región 2: Sierra Norte y Nororiental de Puebla (Zacatlán, Chignahuapan, Teziutlán): Abastecimiento forestal, triplay y talleres.
  3. `null` — Región 3: ZMPT y Amozoc - Cholula (Puebla, Amozoc, Calpan, San Pedro Cholula): Carpintería industrial, salas, cocinas y contract.
  4. `null` — Región 4: Corredor Chiautempan - Huamantla - Tlaxcala: Mueble clásico, torneado, salas y comercialización regional.

#### N2-MUEB-03 · `MB-03`

- Sección de origen: (sin encabezado)
- Bloque: `perfilado`
- Tipo: `seleccion_unica`
- Enunciado: Legalidad Forestal, Trazabilidad y Certificación FSC
- Pregunta: Pregunta de Evaluación: ¿Cómo verifica y documenta su empresa el origen legal de la madera en troza o dimensionada que procesa?
- Opciones:
  1. `0 pts` — Sin Verificación Documental / Compra Informal: Compra de madera a taladores o depósitos locales sin remisión forestal formal (riesgo de decomiso).
  2. `33 pts` — Verificación de Guías Forestales SEMARNAT: Compra exclusiva con remisiones o guías de transporte forestal gubernamentales vigentes.
  3. `66 pts` — Cadena de Custodia Legalizada ERP: Trazabilidad digital que vincula el lote de madera comprada con el volumen de muebles fabricados.
  4. `100 pts` — Certificación de Cadena de Custodia FSC / PEFC: Maderas y tableros provenientes 100% de bosques gestionados de forma sustentable certificados FSC.

#### N2-MUEB-04 · `R00-MUEB-PROD`

- Sección de origen: (sin encabezado)
- Bloque: `borda_r00`
- Tipo: `ranking_borda`; N = 8
- Enunciado: Jerarquización de Fricciones en Aserrado, Maquinado y Acabado (Rompehielos de Jerarquización - Método de Borda)
- Pregunta: Pregunta de Jerarquización: Ordene del 1 al 8 los siguientes problemas productivos según el impacto económico negativo y frecuencia en su planta (1 = Mayor impacto; 8 = Menor impacto)
- Factores o casillas:
  1. Rajaduras, torceduras o pandeo en muebles por madera verde o mal estufada (humedad >12%).
  2. Marcas de maquinado, astillado en tableros melamínicos y tiempos excesivos de lijado manual.
  3. Desalineación y errores dimensionales en perforaciones para taquetes, pernos y herrajes.
  4. Tiempos prolongados de ajuste y programación en ruteadores CNC, seccionadoras o tupís (SMED lento).
  5. Cuellos de botella en la cabina de aplicación de barniz o sellador con secado lento.
  6. Desprendimiento de enchapado de canto en melamina por mala calidad del pegamento térmico (EVA).
  7. Falta de ebanistas calificados o proyectistas capacitados en software CAD/CAM mueblero.
  8. Paros no programados por variaciones de voltaje eléctrico o fallas en el sistema de aspiración de aserrín.
- Puntos por factor: no están en el instrumento sectorial. Ver fórmulas de Borda en la sección F. El monto en MXN es captura libre y no entra a ninguna fórmula escrita.

#### N2-MUEB-05 · `R00-MUEB-SOURCING-MAT`

- Sección de origen: (sin encabezado)
- Bloque: `borda_r00`
- Tipo: `ranking_borda`; N = 6
- Enunciado: Jerarquización de Riesgos en Sourcing de Madera, Tableros y Herrajes (Rompehielos de Jerarquización - Método de Borda)
- Pregunta: Pregunta de Jerarquización: Ordene del 1 al 6 los principales riesgos y cuellos de botella en la compra de insumos para su taller o fábrica
- Factores o casillas:
  1. Escasez y sobrecosto de madera sólida estufada de primera calidad (Pino, Encino, Banak, Estufado FAS).
  2. Variaciones de densidad, espesor y calidad superficial en tableros aglomerados y MDF.
  3. Falta de disponibilidad local de herrajes técnicos de ingeniería (correderas ocultas, bisagras de cierre suave).
  4. Escasez de adhesivos técnicos de alta resistencia a la humedad (Poliuretano PUR / D3 / D4).
  5. Altos precios y baja durabilidad en abrasivos, lijas y bandas de lijado industrial.
  6. Volatilidad en precios de barnices, tintas y poliuretanos derivados del petróleo.
- Puntos por factor: no están en el instrumento sectorial. Ver fórmulas de Borda en la sección F. El monto en MXN es captura libre y no entra a ninguna fórmula escrita.

#### N2-MUEB-06 · `R00-MUEB-SOURCING-SERV`

- Sección de origen: (sin encabezado)
- Bloque: `borda_r00`
- Tipo: `ranking_borda`; N = 6
- Enunciado: Jerarquización de Deficiencias en Servicios Especializados Externos (Rompehielos de Jerarquización - Método de Borda)
- Pregunta: Pregunta de Jerarquización: Ordene del 1 al 6 las mayores deficiencias de servicios e infraestructura externa en Puebla - Tlaxcala
- Factores o casillas:
  1. Carencia de estufas/estufaderos comunitarios con capacidad disponible para secado técnico de madera a maquila.
  2. Falta de talleres especializados en afilado de sierras principales, discos e insertos de diamante (PCD) para CNC.
  3. Déficit de despachos de diseño industrial 3D, parametrización RTA y renderizado hiperrealista.
  4. Falta de laboratorios acreditados para pruebas de resistencia de uniones, adherencia de pintura e impacto ASTM.
  5. Escasez de plantas o maquiladoras con tecnología de acabado UV ecológico base agua.
  6. Inseguridad y sobrecostos por fletes terrestres para el transporte de muebles terminados a centros de consumo.
- Puntos por factor: no están en el instrumento sectorial. Ver fórmulas de Borda en la sección F. El monto en MXN es captura libre y no entra a ninguna fórmula escrita.

#### N2-MUEB-07 · `MB-TECH-01`

- Sección de origen: (sin encabezado)
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Control de Humedad de Madera y Tecnología de Estufado
- Pregunta: Pregunta de Evaluación: ¿Cómo mide y controla su empresa el porcentaje de humedad en la madera sólida antes de entrar a la línea de corte y ensamble?
- Opciones:
  1. `0 pts` — Sin Medición / Secado al Aire Libre: Secado natural al sol sin xilómetro; humedad variable (15% a 25%) con alto riesgo de rajadura.
  2. `33 pts` — Medición Manual con Xilómetro de Puntas: Verificación visual con medidor de humedad de agujas en caras externas antes de cortar.
  3. `66 pts` — Estufado Propio o Maquilado Controlado (8% - 10%): Proceso en estufa de vapor/condensación con curvas de secado e higrómetro capacitivo.
  4. `100 pts` — Estufado Automatizado por Computadora y Tratamiento Térmico HT: Estufa automatizada con sensores de madera internos, desinfección HT (NIMF-15) e historial.

#### N2-MUEB-08 · `MB-TECH-02`

- Sección de origen: (sin encabezado)
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Maquinado CNC Nesting, Seccionado y Enchapado de Canto PUR
- Pregunta: Pregunta de Evaluación: ¿Qué tecnología de corte, ruteado y pegado de canto utiliza su empresa para la fabricación de piezas y modulares?
- Opciones:
  1. `0 pts` — Maquinado Manual / Sierra Escuadradora Convencional: Corte con sierra de mano o escuadradora manual; enchapado de canto con plancha o pistola.
  2. `33 pts` — Seccionadora Automática y Enchapadora EVA: Corte en seccionadora CNC e pegado de canto automático con cola termofusible EVA.
  3. `66 pts` — Ruteador CNC Nesting y Enchapadora PUR: Centro de maquinado CNC ruteador de 3/4 ejes con software de optimización e pegado PUR impermeable.
  4. `100 pts` — Célula Flexible Nesting 4.0 / Láser Edgebanding: Carga/descarga automática en CNC ruteador, enchapado de canto por aire caliente/láser sin junta visible.

#### N2-MUEB-09 · `MB-TECH-03`

- Sección de origen: (sin encabezado)
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Tecnología de Aplicación de Acabados y Emisiones VOC
- Pregunta: Pregunta de Evaluación: ¿Cómo aplica los selladores, tintas y barnices en sus muebles y qué tecnología utiliza para controlar las emisiones de solventes?
- Opciones:
  1. `0 pts` — Aplicación al Abierto con Pistola Convencional: Pintado en área abierta con barniz de nitrocelulosa o poliuretano con alta emisión de solventes.
  2. `33 pts` — Cabina de Pintura Seca con Filtros de Cartón: Cabina con extractores y filtros de papel, utilizando pistolas de alta eficiencia HVLP.
  3. `66 pts` — Cabina de Cortina de Agua y Barniz Poliuretano Alto Sólidos: Recirculación de agua para atrapamiento de overspray y uso de recubrimientos de baja emisión.
  4. `100 pts` — Línea Automatizada de Acabado UV Base Agua / Barnizado Robótico: Aplicación con robot o cortina automatizada, curado instantáneo por lámpara UV y cero VOCs.

#### N2-MUEB-10 · `MB-TECH-04`

- Sección de origen: (sin encabezado)
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Diseño Paramétrico RTA / Flat-Pack y Herrajes de Ingeniería (Sistema 32 mm)
- Pregunta: Pregunta de Evaluación: ¿Qué nivel de estandarización paramétrica y diseño listo para armar (RTA / Desarmable) tienen sus productos muebles?
- Opciones:
  1. `0 pts` — Mueble Armado Fijo Fijo (Clavado/Pegado): Mueble soldado o pegado de forma permanente, sin posibilidad de desarmado para transporte.
  2. `33 pts` — Ensamble Mixto con Herrajes Visibles: Mueble parcialmente desarmable utilizando tornillos o escuadras metálicas expuestas.
  3. `66 pts` — Diseño Paramétrico RTA / Sistema 32 mm (Cabinet Vision / Promob): Mueble 100% desarmable con perforaciones ocultas para minifix, rafix y taquetes.
  4. `100 pts` — Ecosistema Modular Inteligente / Configurador 3D Web: Diseño optimizado para empaque Flat-Pack en caja plana, instructivo 3D QR y empaque automatizado.

#### N2-MUEB-11 · `CP-MB-01`

- Sección de origen: (sin encabezado)
- Bloque: `complejidad`
- Tipo: `seleccion_unica`
- Enunciado: Reconversión hacia la 'Fruta Madura' Mueblera (Alta Densidad ω_j > 0.65)
- Pregunta: Pregunta de Evaluación: Considerando la maquinaria de su taller o fábrica, ¿hacia cuál de los siguientes productos de mayor margen tiene viabilidad de reconvertirse en <12 meses?
- Opciones:
  1. `25 pts` — Mobiliario Escolar y de Oficina Modular Ergonómico: Escritorios, mamparas y sillas ajustables con estructura metálica y cubiertas melamínicas.
  2. `50 pts` — Cocinas Integrales y Closets RTA en Caja Plana: Módulos estandarizados de cocina con herrajes de cierre suave para tiendas de autoservicio.
  3. `75 pts` — Puertas Técnicas de Tambor y MDF Termoformadas: Fabricación de puertas de interior acústicas y térmicas con bastidor estufado.
  4. `100 pts` — Mobiliario Comercial y Exhibidores Retail (P.O.P.): Fabricación de islas, exhibidores y mobiliario especializado para tiendas departamentales.

#### N2-MUEB-12 · `CP-MB-02`

- Sección de origen: (sin encabezado)
- Bloque: `complejidad`
- Tipo: `seleccion_unica`
- Enunciado: Apuestas Estratégicas y Mobiliario de Alta Complejidad (Alto ICPO)
- Pregunta: Pregunta de Evaluación: En un horizonte de 2 a 3 años con apoyo de coinversión y tecnología, ¿en cuál segmento de alta complejidad tiene visión estratégica de incursionar?
- Opciones:
  1. `25 pts` — Proyectos Contract Hoteleros y Residenciales a Medida: Equipamiento integral de habitaciones de hotel con estándares internacionales de fuego.
  2. `50 pts` — Mobiliario Hospitalario y Laboratorio Especializado: Muebles con cubiertas de resina epóxica antibacteriana y resistencia química.
  3. `75 pts` — Paneles Acústicos Perforados y Muros De Madera Arquitectónicos: Revestimientos de madera CNC para auditorios y corporativos.
  4. `100 pts` — Mueble de Exterior en Madera Tratada Térmicamente (TMT / Thermowood): Muebles de terraza sin químicos altamente resistentes a intemperie.

#### N2-MUEB-13 · `CP-MB-03`

- Sección de origen: (sin encabezado)
- Bloque: `complejidad`
- Tipo: `seleccion_unica`
- Enunciado: Valorización de Viruta, Aserrín y Economía Circular Mueblera
- Pregunta: Pregunta de Evaluación: ¿Qué destino y nivel de procesamiento otorga actualmente su empresa a la viruta, aserrín y retazos de tablero generados en su planta?
- Opciones:
  1. `0 pts` — Tiradero en Abierto / Quema / Regalo: Acumulación de aserrín con riesgo de incendio o regala a granjas pecuarias sin beneficio económico.
  2. `33 pts` — Venta de Aserrín a Granel para Cama de Galpón: Venta de viruta suelta a granjas avícolas o porcinas a precio marginal.
  3. `66 pts` — Briquetado Mecánico de Viruta Seca: Prensado de aserrín seco en briquetas densas para venta como combustible limpio en panaderías o calderas.
  4. `100 pts` — Planta de Pelletizado Certificado FSC: Transformación automatizada de residuo leñoso en pellets de alta densidad para exportación o biomasa.

#### N2-MUEB-14 · `COL-MB01`

- Sección de origen: (sin encabezado)
- Bloque: `bienes_club`
- Tipo: `seleccion_unica`
- Enunciado: Centro Comunitario de Estufado de Madera y Maquinado CNC Nesting
- Pregunta: Pregunta de Evaluación: ¿Cuál sería la disposición de su empresa para utilizar un centro común de secado técnico de madera y corte CNC Nesting bajo esquema Pay-per-Use?
- Opciones:
  1. `0 pts` — Sin Interés / Operación Tradicional: Prefiere seguir trabajando exclusivamente con madera secada al sol y corte manual.
  2. `33 pts` — Maquila por Horas / Metros de Estufado: Disposición a contratar servicio de estufado y ruteado CNC por pedido en un centro comunitario.
  3. `66 pts` — Coinversión en Estufadero Regional: Disposición a aportar cuotas fiduciarias para cofinanciar estufas automatizadas de vapor comunes.
  4. `100 pts` — Gobernanza Fiduciaria de Parque Mueblero: Participación en el fideicomiso integrador de un parque mueblero con centro logístico y CNC en Tlaxco/Amozoc.

#### N2-MUEB-15 · `COL-MB02`

- Sección de origen: (sin encabezado)
- Bloque: `bienes_club`
- Tipo: `seleccion_unica`
- Enunciado: Centro Regional de Diseño Paramétrico 3D y Afilado de Diamante PCD
- Pregunta: Pregunta de Evaluación: ¿Cómo participaría su empresa en una alianza regional con universidades para contar con un centro de parametrización 3D y afilado de herramientas CNC?
- Opciones:
  1. `0 pts` — Mantenimiento de Afilado Convencional: Continuar afilando sierras en talleres informales locales sin rectificado CNC.
  2. `33 pts` — Servicio por Evento de Afilado Diamante: Contratar afilado por computadora para brocas y sierras CNC en un centro regional.
  3. `66 pts` — Centro Universitario de Diseño y Prototipado 3D: Aportar cuotas para equipar un laboratorio de diseño paramétrico RTA en campus universitario (BUAP/UTT).
  4. `100 pts` — Certificación de Diseño y Ensayos ASTM: Coinversión en laboratorio de pruebas estructurales de muebles para licitaciones internacionales.

#### N2-MUEB-16 · `COL-MB03`

- Sección de origen: (sin encabezado)
- Bloque: `bienes_club`
- Tipo: `seleccion_unica`
- Enunciado: Consorcio de Compras Consolidadas de Herrajes y Comercialización Colectiva
- Pregunta: Pregunta de Evaluación: ¿Qué grado de apertura tiene su empresa para asociarse en un consorcio de compras para adquirir tableros MDF/FSC y herrajes a precio mayorista?
- Opciones:
  1. `0 pts` — Operación Aislada Tradicional: Prefiere comprar tableros y herrajes por pieza a distribuidores minoristas locales.
  2. `33 pts` — Consolidación de Pedidos de Materia Prima: Participar en compras agrupadas de tableros melamínicos y herrajes por contenedor.
  3. `66 pts` — Marca Colectiva / Catálogo Mueblero Regional: Incorporar sus productos bajo un catálogo unificado de muebles RTA (ej. 'Mueble Diseñado en Puebla-Tlaxcala').
  4. `100 pts` — Consorcio Exportador / Showroom Comercial Compartido: Participación en una empresa integradora con showroom común en CDMX o exportación a EE.UU.


### Sector plasticos (`PLAST`) — 16 reactivos

Fuente: `docs/metodologia/03-instrumento-nivel2/plasticos.md`.

#### N2-PLAST-01 · `PL-01`

- Sección de origen: (sin encabezado)
- Bloque: `perfilado`
- Tipo: `seleccion_unica`
- Enunciado: Eslabón Dominante en la Cadena del Plástico y Polímeros
- Pregunta: Pregunta de Evaluación: ¿En cuál de los siguientes eslabones tecnológicos se concentra la mayor proporción de la facturación y capacidad instalada de su planta?
- Opciones:
  1. `25 pts` — Inyección de Termoplásticos Técnicos y de Ingeniería: Componentes bajo cofre, interiores automotrices, carcasas electrónicas, conectores, artículos médicos o de consumo rígido con estrechas tolerancias dimensionales.
  2. `20 pts` — Extrusión y Soplado (Película, Tubería, Envases y Perfiles): Película agrícola, empaque flexible multicapa, botellas PET/HDPE, tubería de conducción hídrica o perfiles estructurales.
  3. `18 pts` — Termoformado, Espumado y Compuestos de Ingeniería: Bandejas industriales, empaques retornables ESD, componentes de poliuretano, poliestireno expandido (EPS) o fibra de vidrio.
  4. `22 pts` — Reciclaje Técnico, Peletizado y Compounding/Masterbatch: Recuperación de merma post-industrial (PIR) o post-consumo (PCR), lavadero, peletizado, formulación de masterbatch y cargas minerales.

#### N2-PLAST-02 · `PL-02`

- Sección de origen: (sin encabezado)
- Bloque: `perfilado`
- Tipo: `seleccion_unica`
- Enunciado: Cuenca Territorial y Micro-Región Productiva
- Pregunta: Pregunta de Evaluación: ¿En qué corredor o parque industrial de la región Puebla - Tlaxcala se localiza la principal planta de procesamiento de su empresa?
- Opciones:
  1. `ZMPT` — Zona Metropolitana Puebla - Valles Centrales (FINSA, Cuautlancingo, 2000, Resurrección, Amozoc): Alta concentración en proveeduría automotriz Tier 1/Tier 2 e industria de consumo urbano.
  2. `TEX-HUE` — Corredor Industrial Texmelucan - Huejotzingo - San Martín: Especialización en empaque flexible, bolsas, películas agrícolas y tubos de PVC/HDPE.
  3. `CIX-TLAX` — Parques Industriales Xicohténcatl Tlaxcala (CIX I Tetla, CIX II Huamantla, CIX III Tlaxco, San Pablo del Monte): Proveeduría mixta automotriz, electrodomésticos y envases plásticos.
  4. `TEH` — Tehuacán y Valles del Sur (ZMTH): Empaque plástico grado alimenticio, empaques retornables para avicultura/porcicultura y película para agricultura protegida.

#### N2-PLAST-03 · `PL-03`

- Sección de origen: (sin encabezado)
- Bloque: `perfilado`
- Tipo: `seleccion_unica`
- Enunciado: Régimen Energético y Eficiencia de Moldeo
- Pregunta: Pregunta de Evaluación: ¿Cuál es la situación operativa de su planta respecto a la calidad del suministro eléctrico, factor de potencia y eficiencia energética en equipos de calentamiento y enfriamiento?
- Opciones:
  1. `5 pts` — Alta Vulnerabilidad Energética: Tarifa de media tensión sin planta de emergencia; variaciones de voltaje frecuentes que desprograman pirómetros e inyectoras, provocando paros y purgas continuas de resina.
  2. `12 pts` — Suministro Estándar con Micro-Cortes: Subestación propia pero sin bancos de capacitores ni monitoreo de consumo por kg procesado; uso de chillers y compresores convencionales de alto consumo.
  3. `20 pts` — Monitoreo Energético y Chillers Inverter: Subestación con supresores de picos, monitoreo del consumo kWh/kg por máquina, chillers con variador de frecuencia y aislamiento térmico en cañones de inyección.
  4. `25 pts` — Gestión Energética Certificada / ISO 5001: Integración de servomotores híbridos/100% eléctricos en inyectoras, generación fotovoltaica en techos y recuperación de calor de proceso para agua de molde.

#### N2-PLAST-04 · `R00-PLAST-PROD`

- Sección de origen: (sin encabezado)
- Bloque: `borda_r00`
- Tipo: `ranking_borda`; N = 8
- Enunciado: Jerarquización de Fricciones en Procesamiento y Piso de Planta (Rompehielos de Jerarquización)
- Pregunta: Pregunta de Jerarquización: Ordene del 1 al 8 los siguientes problemas comunes de producción según el impacto económico negativo y la frecuencia con que afectan la rentabilidad de su planta (1 = Mayor impacto / Máxima gravedad; 8 = Menor impacto)
- Factores o casillas:
  1. Tiempos de enfriamiento prolongados e ineficiencia en ciclos de moldeo (Cooling time excesivo).
  2. Mermas elevadas de resina por purgas, arranque de máquina, rebaba (flash) o sobreinyección.
  3. Defectos estéticos y estructurales recurrentes (rechupes, ráfagas, tiros cortos, alabeo o burbujas).
  4. Fallas o picos de temperatura en chillers, atemperadores de molde y torres de enfriamiento.
  5. Tiempos prolongados de cambio de molde, purga de cañón y ajuste de parámetros (Set-up / SMED).
  6. Desgaste prematuro de husillos, válvulas antirretorno y cavidades por resinas con fibra de vidrio o cargas.
  7. Paros no programados por variaciones de voltaje, parpadeos eléctricos o picos de presión hidráulica.
  8. Escasez y rotación de operadores técnicos de inyección/extrusión y ajustadores de molde calificados.
- Puntos por factor: no están en el instrumento sectorial. Ver fórmulas de Borda en la sección F. El monto en MXN es captura libre y no entra a ninguna fórmula escrita.

#### N2-PLAST-05 · `R00-PLAST-SOURCING-MAT`

- Sección de origen: (sin encabezado)
- Bloque: `borda_r00`
- Tipo: `ranking_borda`; N = 6
- Enunciado: Jerarquización de Riesgos en Abastecimiento de Resinas e Insumos (Rompehielos de Jerarquización)
- Pregunta: Pregunta de Jerarquización: Ordene del 1 al 6 los principales cuellos de botella que enfrenta su empresa en la compra y recepción de materias primas plásticas y aditivos (1 = Mayor impacto negativo / Máxima gravedad; 6 = Menor impacto)
- Factores o casillas:
  1. Dependencia de resina virgen de ingeniería importada (PA66, ABS, PC, POM) con lead times > 12 semanas.
  2. Incapacidad de sustituir resina virgen por resinas recicladas (PCR/PIR) por falta de homologación y estabilidad.
  3. Variaciones lote a lote en la concentración de masterbatch, pigmentos, dispersión de cargas o aditivos UV.
  4. Alta volatilidad de precios en commodities petroquímicos (PP, PE, PET, PVC) que erosiona el margen congelado.
  5. Exigencia de volúmenes mínimos de compra (MOQ) de distribuidoras globales inalcanzables para el flujo PyME.
  6. Demoras en desaduanamiento y fletes marítimos/terrestres en puerto de Veracruz o aduanas de frontera.
- Puntos por factor: no están en el instrumento sectorial. Ver fórmulas de Borda en la sección F. El monto en MXN es captura libre y no entra a ninguna fórmula escrita.

#### N2-PLAST-06 · `R00-PLAST-SOURCING-SERV`

- Sección de origen: (sin encabezado)
- Bloque: `borda_r00`
- Tipo: `ranking_borda`; N = 6
- Enunciado: Jerarquización de Deficiencias en Servicios Especializados e Infraestructura (Rompehielos de Jerarquización)
- Pregunta: Pregunta de Jerarquización: Ordene del 1 al 6 las mayores deficiencias de servicios externos e infraestructura que limitan la competitividad de su planta en Puebla-Tlaxcala (1 = Mayor impacto negativo / Máxima gravedad; 6 = Menor impacto)
- Factores o casillas:
  1. Falta de talleres locales especializados en pulido óptico, texturizado Mold-Tech y reparación de cavidades.
  2. Inexistencia de servicios regionales de rectificado, nitrurado líquido/gaseoso y metalizado de husillos y cañones.
  3. Carencia de laboratorios regionales acreditados ISO/IEC 17025 para caracterización de polímeros (MFI, DSC, FTIR).
  4. Descalibración o falta de laboratorios de calibración local para pirómetros, termocuplas y transductores de presión.
  5. Sobrecostos y trámites burocráticos para la gestión ambiental de purgas, aceites usados y residuos peligrosos.
  6. Inseguridad y robos de transporte de carga en los corredores carreteros Arco Norte y Autopista 150D México-Puebla.
- Puntos por factor: no están en el instrumento sectorial. Ver fórmulas de Borda en la sección F. El monto en MXN es captura libre y no entra a ninguna fórmula escrita.

#### N2-PLAST-07 · `PL-TECH-01`

- Sección de origen: (sin encabezado)
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Control de Proceso y Moldeo Científico (Scientific Molding)
- Pregunta: Pregunta de Evaluación: ¿Cuál es el grado de parametrización y control científico del proceso de inyección o extrusión en su planta?
- Opciones:
  1. `5 pts` — Ajuste Empírico por Prueba y Error: Parámetros modificados libremente por operadores según su criterio visual; sin hojas de proceso estandarizadas ni registro de curvas de inyección.
  2. `12 pts` — Hojas de Proceso Estándar Fijas: Parámetros documentados en papel a pie de máquina; control por tiempo y presión de congelación de entrada (gate freeze) verificado manualmente.
  3. `20 pts` — Moldeo Científico Decoupled Molding (Etapas I, II y III): Desacoplamiento de llenado y compactación; cálculo de reología en máquina, estudio de viscosidad y hoja de proceso congelada con límites de control.
  4. `25 pts` — Monitoreo de Presión en Cavidad en Tiempo Real (RJG / Kistler): Sensores piezoeléctricos en cavidad que transfieren automáticamente la máquina de llenado a empaque y rechazan piezas fuera de ventana.

#### N2-PLAST-08 · `PL-TECH-02`

- Sección de origen: (sin encabezado)
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Calidad, Tolerancias y Ensayos Fisicoquímicos
- Pregunta: Pregunta de Evaluación: ¿Cómo valida su empresa las propiedades fisicoquímicas de las resinas entrantes y las tolerancias dimensionales de las piezas terminadas?
- Opciones:
  1. `5 pts` — Sin Inspección de Materia Prima: Aceptación de resina únicamente con certificado de calidad del proveedor; verificación dimensional con vernier manual sin estudios de repetibilidad (%R&R).
  2. `12 pts` — Pruebas Básicas de Taller: Plastómetro interno para Índice de Fluidez (MFI) y estufa de secado; reporte dimensional en brazo CMM o proyectores de perfiles tercerizado.
  3. `20 pts` — Laboratorio Interno de Calidad / CMM Propia: Medición MFI, humedad relativa por Karl Fischer, densidad y laboratorio metrológico CMM propio con estudios %R&R < 10% y GD&T.
  4. `25 pts` — Caracterización Térmica y Espectrocópica Completa: DSC (Calorimetría Diferencial de Barrido), TGA, FTIR y pruebas mecánicas de tracción/impacto Izod; cumplimiento pleno de FDA / VDA 6.3 / IATF.

#### N2-PLAST-09 · `PL-TECH-03`

- Sección de origen: (sin encabezado)
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Homologación de Resinas Recicladas (PCR/PIR) y Sustentabilidad
- Pregunta: Pregunta de Evaluación: ¿En qué medida su planta ha incorporado resinas recicladas post-consumo (PCR) o post-industriales (PIR) en sus líneas garantizando estabilidad de proceso?
- Opciones:
  1. `5 pts` — Procesamiento Exclusivo de Resina Virgen: Rechazo de resinas recicladas por variaciones extremas de viscosidad, olor o contaminación que tapan boquillas y dañan moldes.
  2. `12 pts` — Mezcla Rústica A pie de Máquina (PIR Interno): Molienda de coladas y piezas defectuosas mezcladas manualmente con resina virgen en proporciones menores al 15% sin filtrado.
  3. `20 pts` — Peletizado y Compounding Homologado (PCR/PIR): Uso de molinos con despolvado, extrusoras de peletizado con desgasificación al vacío y cambiadores de malla hidráulicos de doble placa.
  4. `25 pts` — Formulación de Compuestos Circulares Avanzados: Aditivación con compatibilizadores, alargadores de cadena y nano-cargas que permiten incorporar > 30% PCR cumpliendo normas alimentarias o automotrices.

#### N2-PLAST-10 · `PL-TECH-04`

- Sección de origen: (sin encabezado)
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Mantenimiento, Gestión de Moldes y Colada Caliente (Hot Runner)
- Pregunta: Pregunta de Evaluación: ¿Cómo administra su empresa el ciclo de vida, mantenimiento preventivo y reparación de los moldes y sistemas de colada caliente?
- Opciones:
  1. `5 pts` — Mantenimiento Reactivo Mínimo: Limpieza del molde únicamente cuando presenta rebaba excesiva o tiros cortos; sin registro de disparos ni taller interno.
  2. `12 pts` — Limpieza y Conservación Básica: Bitácora física de disparos por molde, limpieza manual de cavidades al desmontar y almacenamiento en rack con agente anticorrosivo.
  3. `20 pts` — Programa de Mantenimiento Preventivo por Disparos: Lavado ultrasónico de cavidades, revisión de canales de enfriamiento, mantenimiento a controladores de colada caliente y taller interno de moldes.
  4. `25 pts` — Gestión Integral de Herramental (Tool Management System): Monitoreo de sensores de temperatura en molde, mantenimiento interno con soldadura láser, micro-mecanizado y prueba de estanqueidad.

#### N2-PLAST-11 · `CP-PL-01`

- Sección de origen: (sin encabezado)
- Bloque: `complejidad`
- Tipo: `seleccion_unica`
- Enunciado: Reconversión hacia la 'Fruta Madura' de Polímeros (Alta Densidad ω_j > 0.65)
- Pregunta: Pregunta de Evaluación: Considerando su parque de inyectoras o extrusoras, ¿hacia cuál de los siguientes productos procesados adyacentes tiene mayor viabilidad técnica de reconversión en menos de 12 meses?
- Opciones:
  1. `FM-01` — Inyección Co-moldeada o Bimaterial (2K / Overmolding): Piezas rígido-flexible (PP+TPE, PA+TPU) para sellos integrados automotrices o mangos ergonómicos.
  2. `FM-02` — Envases Grado Alimenticio Multicapa con Barrera (MAP / EVOH): Botellas o bandejas de polipropileno/PET con capas de EVOH para extender vida de anaquel sin conservadores.
  3. `FM-03` — Tubería y Perfiles Estructurales de Alta Densidad (HDPE / PP-R): Sistemas de conducción de fluidos a presión para construcción e infraestructura industrial.
  4. `FM-04` — Contenedores Plásticos Agrícolas e Industriales Colapsables: Cajas retornables para cosecha y logística industrial que reemplazan empaques de madera.

#### N2-PLAST-12 · `CP-PL-02`

- Sección de origen: (sin encabezado)
- Bloque: `complejidad`
- Tipo: `seleccion_unica`
- Enunciado: Apuestas Estratégicas y Productos de Alta Complejidad (Alto ICPO)
- Pregunta: Pregunta de Evaluación: En un horizonte de 2 a 3 años con apoyo de coinversión técnica y desarrollo de proveedores, ¿en cuál de los siguientes segmentos de alta sofisticación tiene visión estratégica de incursionar?
- Opciones:
  1. `AP-01` — Polímeros Bio-basados y Compostables Certificados (PLA / PHA / PBAT): Envases y empaques compostables que cumplen leyes de prohibición de plásticos de un solo uso.
  2. `AP-02` — Plásticos de Ingeniería para Electromovilidad y Baterías: Componentes de PA66-GF30 o PBT retardantes a la flama (UL94 V-0) para cajas de batería y conectores EV.
  3. `AP-03` — Dispositivos Médicos e Insumos de Grado Farmacéutico: Jeringas, sistemas de infusión y tubos médicos inyectados en cuartos limpios ISO Clase 7/8.
  4. `AP-04` — Compuestos Conductivos y Disipadores Electrostáticos (ESD): Polímeros aditivados con nanotubos de carbono o grafeno para empaque de microelectrónica.

#### N2-PLAST-13 · `CP-PL-03`

- Sección de origen: (sin encabezado)
- Bloque: `complejidad`
- Tipo: `seleccion_unica`
- Enunciado: Valorización de Subproductos y Compounding Avanzado
- Pregunta: Pregunta de Evaluación: ¿Qué destino y nivel de procesamiento otorga actualmente su planta a los residuos, purgas, coladas y recortes de lámina plástica?
- Opciones:
  1. `5 pts` — Venta a Mermeros / Tiradero: Venta de mermas y purgas a recolectores informales a precios rematados de chatarra plástica.
  2. `12 pts` — Molienda Interna para Reutilización Directa: Trituración en molinos de pie de máquina para reincorporar coladas inmediatamente al proceso.
  3. `20 pts` — Peletizado y Compounding con Cargas Minerales: Lavado, triturado, extrusión con desgasificación y adición de talco o carbonato de calcio para peletizado homogéneo.
  4. `25 pts` — Biorrefinería de Polímeros / Reciclaje Químico o Mecánico de Precisión: Formulación de masterbatch técnico comercializable con ficha técnica garantizada para terceros.

#### N2-PLAST-14 · `COL-PL01`

- Sección de origen: (sin encabezado)
- Bloque: `bienes_club`
- Tipo: `seleccion_unica`
- Enunciado: Centro Comunitario de Mantenimiento y Modificación de Moldes (Tooling Hub)
- Pregunta: Pregunta de Evaluación: ¿Cuál sería la disposición de su empresa para utilizar o cofinanciar un centro regional compartido de pulido, texturizado, soldadura láser y modificación de moldes bajo esquema Pay-per-Use?
- Opciones:
  1. `5 pts` — Desinterés o Operación Aislada: Prefiere continuar enviando moldes a reparar con talleres informales externos o importando refacciones.
  2. `12 pts` — Uso de Servicios por Evento (Pay-per-Use): Interés en contratar horas de soldadura láser, grabado o rectificado en una instalación común regional cuando surja una emergencia.
  3. `20 pts` — Coinversión y Membresía Técnica: Disposición a aportar cuotas para equipar un taller comunitario de moldes administrado por el clúster del plástico.
  4. `25 pts` — Gobernanza Fiduciaria Completa: Participación en un fideicomiso regional (Empresas - Gobierno - Universidad) para operar un Tooling Hub en un parque industrial clave (FINSA / CIX).

#### N2-PLAST-15 · `COL-PL02`

- Sección de origen: (sin encabezado)
- Bloque: `bienes_club`
- Tipo: `seleccion_unica`
- Enunciado: Laboratorio Regional Compartido de Caracterización de Polímeros y Reología
- Pregunta: Pregunta de Evaluación: ¿Cómo participaría su empresa en una alianza regional de Cuádruple Hélice para operar un laboratorio comunitario acreditado de ensayos reológicos y térmicos (DSC, MFI, TGA, FTIR)?
- Opciones:
  1. `5 pts` — Mantenimiento de Esquema Individual: Continuar enviando muestras a laboratorios comerciales fuera del estado asumiendo costos y demoras.
  2. `12 pts` — Bolsa Regional de Ensayos con Tarifa Preferencial: Integrar un grupo de compra de servicios analíticos para negociar tarifas volurimétricas.
  3. `20 pts` — Laboratorio Comunitario en Campus Universitario: Co-financiar el equipamiento de un laboratorio de polímeros en una universidad regional (BUAP / UPAEP / UTT).
  4. `25 pts` — Acreditación ISO/IEC 17025 in Situ: Participación en el comité técnico para que el laboratorio regional emita certificados oficiales validados por la EMA.

#### N2-PLAST-16 · `COL-PL03`

- Sección de origen: (sin encabezado)
- Bloque: `bienes_club`
- Tipo: `seleccion_unica`
- Enunciado: Mesa de Compra Consolidada de Resinas y Masterbatch para PyMEs
- Pregunta: Pregunta de Evaluación: ¿Qué grado de apertura tiene su empresa para asociarse en un comité de compras agrupadas que consolide el volumen de resina (PP, PE, PET) y aditivos frente a petroquímicas y distribuidoras?
- Opciones:
  1. `5 pts` — Compras Aisladas Individuales: Mantener la compra atomizada a distribuidores locales asumiendo sobreprecio por bajo volumen.
  2. `12 pts` — Consolidación de Pedidos de Commodities: Disposición a sumar volumen de resina estándar (PP/PE) para negociar compras por carro de ferrocarril o pipa.
  3. `20 pts` — Consorcio de Importación Directa: Participar en un vehículo legal que importe resina directamente desde molinos petroquímicos de EE.UU. o Asia.
  4. `25 pts` — Fideicomiso de Compras y Almacén en Consignación (VMI): Co-financiar un centro logístico de distribución de resina con inventario en consignación para socios.


### Sector textil (`TEXT`) — 16 reactivos

Fuente: `docs/metodologia/03-instrumento-nivel2/textil.md`.

#### N2-TEXT-01 · `TX-01`

- Sección de origen: (sin encabezado)
- Bloque: `perfilado`
- Tipo: `seleccion_unica`
- Enunciado: Eslabón Dominante en la Cadena Textil - Confección
- Pregunta: Pregunta de Evaluación: ¿En cuál de los siguientes eslabones tecnológicos se concentra la mayor proporción de la facturación y capacidad productiva de su establecimiento?
- Opciones:
  1. `25 pts` — Hilatura y Tejeduría (Plana o Punto): Transformación de pacas de fibra sintética/algodón en hilo y tejeduría en tela cruda.
  2. `50 pts` — Acabados, Teñido, Estampado y Estampería: Procesamiento químico-húmedo, teñido de hilo/pieza, estampado textil y acabados funcionales.
  3. `75 pts` — Confección y Lavandería de Mezclilla / Prendas: Patronaje, corte, ensamble de prendas de vestir, lavado láser/ozono y empaque.
  4. `100 pts` — Textiles Técnicos e Industriales: Fabricación de no-tejidos, telas para interiores automotrices, geotextiles, filtros o ropa de protección.

#### N2-TEXT-02 · `TX-02`

- Sección de origen: (sin encabezado)
- Bloque: `perfilado`
- Tipo: `seleccion_unica`
- Enunciado: Cuenca Territorial y Micro-Región Productiva Textil
- Pregunta: Pregunta de Evaluación: ¿En qué cuenca o corredor industrial de la región Puebla - Tlaxcala se localiza la principal planta o taller de su empresa?
- Opciones:
  1. `null` — Región 1: Valle de Tlaxcala (Chiautempan, Contla, Apetatitlán, Tlaxcala): Hilatura tradicional, cobertores, cobijas, tejeduría de punto y acabados.
  2. `null` — Región 2: Teziutlán y Sierra Nororiental (Teziutlán, Tlatlauquitepec, Xiutetelco): Polo de confección masiva, prendas de vestir y exportación.
  3. `null` — Región 3: Tehuacán y Valle de Ajalpan (Tehuacán, Ajalpan, Tepanco): Cluster de mezclilla (Jeans), lavanderías industriales y confección.
  4. `null` — Región 4: ZMPT y Corredor San Martín - Huejotzingo (Puebla, Huejotzingo, Texmelucan): Textiles técnicos automotrices, estampación y acabado industrial.

#### N2-TEXT-03 · `TX-03`

- Sección de origen: (sin encabezado)
- Bloque: `perfilado`
- Tipo: `seleccion_unica`
- Enunciado: Régimen Ambiental e Hídrico en Teñido y Acabado (NOM-001-SEMARNAT-2021)
- Pregunta: Pregunta de Evaluación: ¿Cuál es la situación operativa de su empresa respecto al uso de agua de teñido/lavado y el tratamiento de aguas residuales en la cuenca del Atoyac / Zahuapan?
- Opciones:
  1. `0 pts` — Sin Planta de Tratamiento / Descarga a Drenaje: Descarga de efluentes coloreados sin tratamiento secundario con riesgo de clausura.
  2. `33 pts` — Planta PTAR Básica Fisicoquímica: Tratamiento primario/secundario básico pero con dificultades para cumplir parámetros NOM-001 de color y DBO.
  3. `66 pts` — Planta PTAR Avanzada con Reuso (>30%): Tratamiento biológico y terciario con recuperación y recirculación parcial de agua en teñido.
  4. `100 pts` — Cero Descargas Líquidas (ZDL) / Lavandería Ecológica: Tecnología de lavado por ozono/láser sin agua y filtración MBR/Osmosis Inversa con reuso >80%.

#### N2-TEXT-04 · `R00-TEX-PROD`

- Sección de origen: (sin encabezado)
- Bloque: `borda_r00`
- Tipo: `ranking_borda`; N = 8
- Enunciado: Jerarquización de Fricciones en Tejeduría, Teñido y Confección (Rompehielos de Jerarquización - Método de Borda)
- Pregunta: Pregunta de Jerarquización: Ordene del 1 al 8 los siguientes problemas operativos según el impacto económico negativo y frecuencia con que afectan su planta (1 = Mayor impacto; 8 = Menor impacto)
- Factores o casillas:
  1. Variaciones de tono y color entre lotes (Metamerismo / Delta E fuera de tolerancia) que generan rechazos.
  2. Desperdicio y merma elevada de tela en el proceso de trazo y corte manual.
  3. Tirones, reventones de hilo y fallas de tensión en telares o máquinas de tejer que detienen la producción.
  4. Cuellos de botella y largas horas de proceso en tina de teñido o fijado de color.
  5. Falta de mecánicos de mantenimiento especializados en telares CNC o máquinas de coser automáticas.
  6. Tiempos prolongados de cambio de modelo o cambio de color en tinas/máquinas (SMED lento).
  7. Paros imprevistos por mala calidad o dureza del agua de proceso o variaciones de voltaje eléctrico.
  8. Retrasos y cuellos de botella en el área de planchado, empaque y habilitación final.
- Puntos por factor: no están en el instrumento sectorial. Ver fórmulas de Borda en la sección F. El monto en MXN es captura libre y no entra a ninguna fórmula escrita.

#### N2-TEXT-05 · `R00-TEX-SOURCING-MAT`

- Sección de origen: (sin encabezado)
- Bloque: `borda_r00`
- Tipo: `ranking_borda`; N = 6
- Enunciado: Jerarquización de Riesgos en Sourcing de Fibras, Hilos y Avíos (Rompehielos de Jerarquización - Método de Borda)
- Pregunta: Pregunta de Jerarquización: Ordene del 1 al 6 los principales riesgos y cuellos de botella en la compra de materias primas e insumos para su producción
- Factores o casillas:
  1. Dependencia de hilados sintéticos o telas importadas de Asia sujetas a demoras aduanales.
  2. Volatilidad de precios en pacas de algodón e hilo de poliéster virgen.
  3. Falta de proveeduría local de hilados reciclados o certificados bajo normas GOTS / OEKO-TEX.
  4. Altos volúmenes mínimos de compra (MOQ) exigidos por tejedurías o hilanderías grandes.
  5. Escasez o mala calidad de avíos técnicos (cierres reforzados, hilos de alta tenacidad, botones, etiquetas).
  6. Entradas de prendas/telas de subvaluación y contrabando que distorsionan el precio de mercado.
- Puntos por factor: no están en el instrumento sectorial. Ver fórmulas de Borda en la sección F. El monto en MXN es captura libre y no entra a ninguna fórmula escrita.

#### N2-TEXT-06 · `R00-TEX-SOURCING-SERV`

- Sección de origen: (sin encabezado)
- Bloque: `borda_r00`
- Tipo: `ranking_borda`; N = 6
- Enunciado: Jerarquización de Deficiencias en Servicios Especializados Externos (Rompehielos de Jerarquización - Método de Borda)
- Pregunta: Pregunta de Jerarquización: Ordene del 1 al 6 las mayores deficiencias de servicios e infraestructura externa en la región Puebla - Tlaxcala
- Factores o casillas:
  1. Carencia de laboratorios regionales acreditados ISO 17025 para pruebas de solidez de color, tracción y pilling.
  2. Falta de tintorerías y plantas de acabado industrial externas con capacidad disponible para maquila.
  3. Déficit de lavanderías ecológicas avanzadas (tecnología láser, ozono y microburbujas para jeans).
  4. Falta de despacho o centro de patronaje digital 3D y escalado asistido por computadora (CAD/CAM).
  5. Lentos procesos y altos costos para obtener certificaciones sociales/ambientales internacionales (WRAP, SMETA, OEKO-TEX).
  6. Inseguridad y sobrecostos por custodia en el transporte de carga en la autopista 150D México-Puebla y Arco Norte.
- Puntos por factor: no están en el instrumento sectorial. Ver fórmulas de Borda en la sección F. El monto en MXN es captura libre y no entra a ninguna fórmula escrita.

#### N2-TEXT-07 · `TX-TECH-01`

- Sección de origen: (sin encabezado)
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Control de Color, Espectrocolorimetría y Solidez (Delta E)
- Pregunta: Pregunta de Evaluación: ¿Cómo controla y garantiza su empresa la fidelidad del color y la solidez del teñido entre diferentes lotes de producción?
- Opciones:
  1. `0 pts` — Evaluación Visual Ocular: Control de color a ojo humano bajo luz natural sin caja de luz ni espectrofotómetro.
  2. `33 pts` — Caja de Luz Normada (Cabinet Light): Evaluación visual en cabina de luz estandarizada (D65, TL84, CWF) con escala de grises.
  3. `66 pts` — Espectrofotómetro de Esfera y Formulación Digital: Medición espectral de color con curva de tolerancia Delta E < 1.0 y laboratorio de formulación.
  4. `100 pts` — Control Integrado en Tintorería / Dispensa Automática: Dosificación automatizada de colorantes por computadora, espectrofotómetro en línea y solidez AATCC/ISO.

#### N2-TEXT-08 · `TX-TECH-02`

- Sección de origen: (sin encabezado)
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Automatización de Trazo, Nido y Corte Digital CAD/CAM
- Pregunta: Pregunta de Evaluación: ¿Qué tecnología utiliza su empresa para el proceso de patronaje, escalado de tallas y corte de tela en su planta?
- Opciones:
  1. `0 pts` — Patronaje Físico en Cartón y Corte Manual: Trazos a mano con cartón y corte con cortadora vertical o de disco manual.
  2. `33 pts` — Patronaje Digital CAD y Cortadora Manual: Sistema CAD (Lectra/Gerber/Audaces) para trazo e impresión de papel, pero corte manual.
  3. `66 pts` — Mesa de Corte Automatizada CNC / Láser: Sistema CAD/CAM integrado con cortadora automática multi-capa o corte láser de alta precisión.
  4. `100 pts` — Nido Óptico Inteligente e Industria 4.0: Software de tizado automático por inteligencia artificial (aprovechamiento >90%), corte sin fin y visión 3D para estampados.

#### N2-TEXT-09 · `TX-TECH-03`

- Sección de origen: (sin encabezado)
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Certificaciones de Inocuidad Textil, Químicos y Sustentabilidad
- Pregunta: Pregunta de Evaluación: ¿Qué nivel de certificación internacional de inocuidad textil, gestión de sustancias peligrosas y responsabilidad social ostenta su planta?
- Opciones:
  1. `0 pts` — Sin Certificaciones Internacionales: Cumplimiento básico de regulaciones laborales locales pero sin auditorías formales de clientes.
  2. `33 pts` — En Proceso de Certificación / Auditoría de Cliente: Cumplimiento de código de conducta específico del cliente pero sin certificado GFSI/OEKO-TEX.
  3. `66 pts` — Certificación OEKO-TEX Standard 100 / WRAP Vigente: Garantía de telas libres de sustancias nocivas y auditoría social aprobada.
  4. `100 pts` — Grado de Excelencia Global (GOTS / ZDHC Level 3 / HIGG Index): Certificación orgánica GOTS, sustitución total de químicos peligrosos ZDHC y reporte de sustentabilidad.

#### N2-TEXT-10 · `TX-TECH-04`

- Sección de origen: (sin encabezado)
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Eficiencia de Maquinaria de Confección/Tejido y Mantenimiento TPM
- Pregunta: Pregunta de Evaluación: ¿Cómo administra su planta el mantenimiento preventivo y la eficiencia OEE de sus telares, máquinas de coser o lavadoras?
- Opciones:
  1. `0 pts` — Mantenimiento Reactivo por Avería: Se repara la máquina cuando se rompe la aguja, el gancho o se amarra el motor; sin historial de mantenimiento.
  2. `33 pts` — Mantenimiento Preventivo Calendario: Mantenimiento mecánico básico de lubricación y cambio de agujas por semanas de uso.
  3. `66 pts` — Programa TPM Estructurado en Pie de Máquina: Mantenimiento Productivo Total con poka-yokes (detectores de rotura de hilo, ajustadores neumáticos).
  4. `100 pts` — Línea de Confección Automatizada / Sensores IoT: Maquinaria con motores Servo direct-drive, corte de hilo automático, monitoreo IoT de puntadas por minuto y OEE >85%.

#### N2-TEXT-11 · `CP-TX-01`

- Sección de origen: (sin encabezado)
- Bloque: `complejidad`
- Tipo: `seleccion_unica`
- Enunciado: Reconversión hacia la 'Fruta Madura' Textil (Alta Densidad ω_j > 0.65)
- Pregunta: Pregunta de Evaluación: Considerando el parque de telares, tintorería o máquinas de confección de su planta, ¿hacia cuál de los siguientes productos de mayor margen tiene viabilidad de reconvertirse en <12 meses?
- Opciones:
  1. `25 pts` — Ropa de Trabajo Industrial Certificada y Gabardinas: Confección de prendas de alta durabilidad, antiestáticas y repelentes al agua/aceite.
  2. `50 pts` — Uniformes Médicos, Quirúrgicos y Antiviral/Antimicrobiano: Confección con telas tratadas con acabado nano-plata o barrera fluida.
  3. `75 pts` — Textiles Hogar y Decorativos de Alta Gama: Cobertores, jacquards y tapicería fina con diseño registrado y acabados suavizados.
  4. `100 pts` — Prendas Deportivas de Alto Rendimiento y Compresión: Confección sin costuras (Seamless), telas de secado rápido (Dry-fit) y elasticidad 4-ways.

#### N2-TEXT-12 · `CP-TX-02`

- Sección de origen: (sin encabezado)
- Bloque: `complejidad`
- Tipo: `seleccion_unica`
- Enunciado: Apuestas Estratégicas y Textiles Técnicos de Alta Complejidad (Alto ICPO)
- Pregunta: Pregunta de Evaluación: En un horizonte de 2 a 3 años con apoyo de coinversión y vinculación tecnológica, ¿en cuál segmento de alta complejidad tiene visión estratégica de incursionar?
- Opciones:
  1. `25 pts` — Textiles Automotrices para Interiores (VW / Audi): Telas no-tejidas y laminadas para vestiduras de asientos, cabezales, techos y alfombras.
  2. `50 pts` — Telas Ignífugas Certificadas (NFPA 2112 / Arco Eléctrico): Tejidos con fibras aramidas (Kevlar/Nomex) para bomberos e industria petrolera.
  3. `75 pts` — Geotextiles y Geomembranas para Infraestructura: Tejidos de polipropileno de alta tenacidad para estabilización de suelos y carreteras.
  4. `100 pts` — Textiles Inteligentes / Smart Clothing (E-Textiles): Prendas con hilo conductor, sensores biométricos impresos y electrónica lavable integrados.

#### N2-TEXT-13 · `CP-TX-03`

- Sección de origen: (sin encabezado)
- Bloque: `complejidad`
- Tipo: `seleccion_unica`
- Enunciado: Economía Circular, Reciclaje de Retazo y Hilaza Post-Industrial
- Pregunta: Pregunta de Evaluación: ¿Qué destino y nivel de procesamiento otorga actualmente su empresa a las mermas de corte, retazos de tela o desperdicio de hilo?
- Opciones:
  1. `0 pts` — Venta a Basureros / Quema / Costo de Flete: Tiradero o quema clandestina de retazo con multas ambientales y contaminación.
  2. `33 pts` — Venta a Traperos / Jergas en Abierto: Venta a bajo costo de retazo a recolectores para limpieza industrial sin procesar.
  3. `66 pts` — Desfibrado / Triturado Mecánico Interno (Garnetting): Procesamiento mecánico de retazo para producir borra y relleno acústico/térmico.
  4. `100 pts` — Hilaza Reciclada Post-Industrial Certificada: Re-hilado de fibras recuperadas para tejido de nuevas prendas con certificación GRS (Global Recycled Standard).

#### N2-TEXT-14 · `COL-TX01`

- Sección de origen: (sin encabezado)
- Bloque: `bienes_club`
- Tipo: `seleccion_unica`
- Enunciado: Centro Comunitario de Teñido Ecológico y Planta PTAR Compartida
- Pregunta: Pregunta de Evaluación: ¿Cuál sería la disposición de su empresa para utilizar una planta común de teñido industrial y tratamiento terciario de agua operada bajo esquema Pay-per-Use?
- Opciones:
  1. `0 pts` — Sin Interés / Operación Individual: Prefiere seguir operando exclusivamente con su infraestructura de teñido o lavandería actual.
  2. `33 pts` — Uso por Contrato Pay-per-Use: Disposición a maquilar teñido y acabado en una instalación ecológica común pagando por kilo/metro.
  3. `66 pts` — Coinversión en Centro de Acabados Comunitario: Disposición a aportar capital fiduciario para equipar tinas de teñido ecológico compartidas.
  4. `100 pts` — Gobernanza Fiduciaria Integrada: Participación en el fideicomiso de administración de un parque textil ecológico en Chiautempan/Tehuacán.

#### N2-TEXT-15 · `COL-TX02`

- Sección de origen: (sin encabezado)
- Bloque: `bienes_club`
- Tipo: `seleccion_unica`
- Enunciado: Laboratorio Regional de Pruebas Textiles y Color ISO 17025 (Cuádruple Hélice)
- Pregunta: Pregunta de Evaluación: ¿Cómo participaría su empresa en una alianza regional con universidades (BUAP, UPTx, UTT) para equipar un laboratorio acreditado de pruebas textiles?
- Opciones:
  1. `0 pts` — Mantenimiento de Envío Externo: Seguir enviando muestras de tela a laboratorios comerciales privados fuera del estado.
  2. `33 pts` — Bolsa Regional de Muestras: Integrar un grupo de empresas para negociar tarifas preferenciales por volumen de pruebas.
  3. `66 pts` — Laboratorio Universitario Acreditado: Aportar muestras y cuotas de servicio para acreditar laboratorios textiles en campus regionales.
  4. `100 pts` — Emisión de Certificados de Exportación In Situ: Coinversión en equipos de tracción, pilling y espectrocolorimetría reconocidos por marcas globales.

#### N2-TEXT-16 · `COL-TX03`

- Sección de origen: (sin encabezado)
- Bloque: `bienes_club`
- Tipo: `seleccion_unica`
- Enunciado: Consorcio de Comercialización, Marca Colectiva y E-Commerce D2C
- Pregunta: Pregunta de Evaluación: ¿Qué grado de apertura tiene su empresa para asociarse en un consorcio comercial que integre oferta y lance una plataforma digital de venta directa?
- Opciones:
  1. `0 pts` — Operación Aislada Tradicional: Prefiere vender exclusivamente a maquiladores, comisionistas o intermediarios locales.
  2. `33 pts` — Consolidación de Oferta para Licitaciones: Compartir catálogo para cotizar pedidos grandes de uniformes o ropa de trabajo.
  3. `66 pts` — Marca Colectiva / Sello de Calidad Regional: Incorporar sus prendas bajo un sello de calidad unificado (ej. 'Textil Orgullo Puebla-Tlaxcala').
  4. `100 pts` — Plataforma E-Commerce B2B/D2C Compartida: Integración en un consorcio exportador con marketplace digital y centro de distribución conjunto.


### Sector tics-startups (`TIC`) — 15 reactivos

Fuente: `docs/metodologia/03-instrumento-nivel2/tics-startups.md`.

#### N2-TIC-01 · `TC-01`

- Sección de origen: MÓDULO 0: PERFILADO DEL MODELO TECNOLÓGICO Y UBICACIÓN
- Bloque: `perfilado`
- Tipo: `seleccion_unica`
- Enunciado: Modelo Principal de Negocio y Entrega de Tecnología
- Pregunta: Pregunta de Evaluación / Jerarquización: ¿En cuál de las siguientes modalidades de producto o servicio tecnológico se concentra la mayor proporción de sus ingresos?
- Opciones:
  1. `null` — Desarrollo de Software a la Medida / Software Factory: Proyectos bajo demanda (time & materials o precio cerrado) para clientes corporativos o gobierno.
  2. `null` — Producto Software como Servicio (SaaS B2B / B2C): Plataforma propietaria en la nube con cobro recurrente por suscripción o uso.
  3. `null` — Servicios Administrados de TI e Infraestructura (IT MSP / Ciberseguridad): Administración de servidores, soporte cloud, redes y servicios gestionados de seguridad (SOC).
  4. `null` — Startup Deep Tech / IA Aplicada / Biotech / IoT: Empresa basada en investigación científica avanzada, algoritmos propietarios de IA, visión artificial o sensores IoT.
  5. `null` — Consultoría Tecnológica e Integración de Sistemas (KISA): Implementación de ERPs corporativos (SAP, Oracle), CRM, Business Intelligence y transformación digital.

#### N2-TIC-02 · `TC-02`

- Sección de origen: MÓDULO 0: PERFILADO DEL MODELO TECNOLÓGICO Y UBICACIÓN
- Bloque: `perfilado`
- Tipo: `seleccion_unica`
- Enunciado: Ubicación del Hub de Operaciones y Mapeo de Talento
- Pregunta: Pregunta de Evaluación / Jerarquización: ¿En qué nodo urbano o parque tecnológico de la región Puebla - Tlaxcala se localiza la sede operativa o centro de ingeniería de su empresa?
- Opciones:
  1. `null` — Corredor Universitario Cholula - San Andrés / UDLAP: Ecosistema de startups, agencias digitales y espacio de coworking en la zona metropolitana.
  2. `null` — Distrito de Innovación Puebla Capital (Angelópolis / Centro Histórico / BUAP): Oficinas corporativas, centros de I+D y desarrollo de software urbano.
  3. `null` — Parques Tecnológicos e Industriales (Cuautlancingo / Huejotzingo / FINSA): Desarrollo de software embebido e integración de sistemas para sector automotriz/industrial.
  4. `null` — Nodo Tlaxcala (Capital / Apizaco / CIX Huamantla): Empresas de desarrollo de software, automatización e integración industrial en Tlaxcala.
  5. `null` — Operación 100% Remota / Distribución Geográfica: Empresa nativa digital sin oficina física fija, con equipo distribuido en la región.

#### N2-TIC-03 · `R00-TIC-PROD`

- Sección de origen: SECCIÓN I: ROMPEHIELOS DE JERARQUIZACIÓN DE IMPACTO (MÉTODO DE BORDA)
- Bloque: `borda_r00`
- Tipo: `ranking_borda`; N = 8
- Enunciado: Jerarquización de Fricciones en Desarrollo y Operación (DevOps / Producto) (Rompehielos de Jerarquización)
- Pregunta: Pregunta de Evaluación / Jerarquización: Ordene del 1 al 8 los siguientes problemas operativos según el impacto negativo que generan en el crecimiento de su empresa de software/TI
- Factores o casillas:
  1. Rotación constante y fuga de desarrolladores sénior atraídos por ofertas remotas en USD.
  2. Atrasos en entregas de sprints y despliegues con errores de código a producción.
  3. Deuda técnica acumulada por código monolítico difícil de escalar o refactorizar.
  4. Vulnerabilidades de ciberseguridad e incidentes de fuga o ataque a datos de clientes.
  5. Altos costos operativos en infraestructura cloud (AWS / Azure) sin optimización (FinOps).
  6. Falta de validación de encaje producto-mercado (Product-Market Fit) y ciclos de venta B2B muy largos.
  7. Dificultad para formalizar la propiedad intelectual (registro de software / patentes).
  8. Desconocimiento de instrumentos legales para levantar capital de riesgo (SAFE / ESOP).
- Puntos por factor: no están en el instrumento sectorial. Ver fórmulas de Borda en la sección F. El monto en MXN es captura libre y no entra a ninguna fórmula escrita.

#### N2-TIC-04 · `R00-TIC-SOURCING-MAT`

- Sección de origen: SECCIÓN I: ROMPEHIELOS DE JERARQUIZACIÓN DE IMPACTO (MÉTODO DE BORDA)
- Bloque: `borda_r00`
- Tipo: `ranking_borda`; N = 6
- Enunciado: Jerarquización de Riesgos en Sourcing de Infraestructura y Licencias (Rompehielos de Jerarquización)
- Pregunta: Pregunta de Evaluación / Jerarquización: Ordene del 1 al 6 los principales riesgos y sobrecostos en la adquisición de infraestructura digital y herramientas de desarrollo
- Factores o casillas:
  1. Carga financiera por licencias de software de desarrollo, monitoreo y APIs especializadas.
  2. Facturación en dólares de proveedores cloud (AWS/GCP/Azure) expuesta a volatilidad cambiaria.
  3. Escasez o sobrecosto de servidores dedicados y GPUs para entrenamiento de modelos de IA.
  4. Dependencia de APIs de terceros (OpenAI, Stripe, Twilio) con cambios de tarifas sin previo aviso.
  5. Falta de infraestructura local de Data Centers certificados TIER III/IV en la región.
  6. Costos elevados de herramientas avanzadas de ciberseguridad (SAST/DAST/SIEM).
- Puntos por factor: no están en el instrumento sectorial. Ver fórmulas de Borda en la sección F. El monto en MXN es captura libre y no entra a ninguna fórmula escrita.

#### N2-TIC-05 · `R00-TIC-SOURCING-SERV`

- Sección de origen: SECCIÓN I: ROMPEHIELOS DE JERARQUIZACIÓN DE IMPACTO (MÉTODO DE BORDA)
- Bloque: `borda_r00`
- Tipo: `ranking_borda`; N = 6
- Enunciado: Jerarquización de Deficiencias en Servicios Especializados del Ecosistema (Rompehielos de Jerarquización)
- Pregunta: Pregunta de Evaluación / Jerarquización: Ordene del 1 al 6 las mayores deficiencias de servicios especializados e infraestructura de soporte en Puebla-Tlaxcala
- Factores o casillas:
  1. Escasez de firmas locales de auditoría e implementación de cumplimiento ISO 27001 / SOC 2.
  2. Falta de despachos legales especializados en derecho informático, patentes y contratos SAFE/ESOP.
  3. Red de ángeles inversionistas y fondos de Venture Capital locales prácticamente inexistente.
  4. Escasos programas de aceleración corporativa vinculados a la industria tradicional (VW, Audi, Agro).
  5. Deficiencias de conectividad de fibra óptica redundante de alta velocidad en zonas de oficinas.
  6. Falta de mentores con experiencia real escalando empresas SaaS B2B a nivel global.
- Puntos por factor: no están en el instrumento sectorial. Ver fórmulas de Borda en la sección F. El monto en MXN es captura libre y no entra a ninguna fórmula escrita.

#### N2-TIC-06 · `TC-TECH-01`

- Sección de origen: SECCIÓN II: AUDITORÍA TÉCNICA DE ARQUITECTURA CLOUD, DEVSECOPS, CIBERSEGURIDAD e IA
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Arquitectura de Software, Nube y Escalabilidad (Cloud-Native)
- Pregunta: Pregunta de Evaluación / Jerarquización: ¿Cuál es el nivel de madurez y escalabilidad de la arquitectura de infraestructura y software de sus aplicaciones?
- Opciones:
  1. `25 pts` — Monolito Servidor Local / VPS Básico: Aplicación monolítica alojada en servidor físico local o VPS sin balanceo de carga ni autoescalado.
  2. `50 pts` — Servidores en Nube con Migración Directa (Lift & Shift): Uso de máquinas virtuales en AWS/Azure/GCP, pero con administración manual y sin contenedores.
  3. `75 pts` — Arquitectura Cloud-Native / Contenedores (Docker / Kubernetes): Aplicación desacoplada en microservicios o contenedores, con bases de datos gestionadas en nube y autoescalado dinámico.
  4. `100 pts` — Serverless / Arquitectura Event-Driven y Multi-Region: Infraestructura como Código (Terraform/CloudFormation), arquitectura serverless/microservicios e hiper-escalabilidad distribuida.

#### N2-TIC-07 · `TC-TECH-02`

- Sección de origen: SECCIÓN II: AUDITORÍA TÉCNICA DE ARQUITECTURA CLOUD, DEVSECOPS, CIBERSEGURIDAD e IA
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Prácticas DevSecOps, Integración Continua (CI/CD) y Pruebas Automatizadas
- Pregunta: Pregunta de Evaluación / Jerarquización: ¿Cómo gestiona su equipo de ingeniería los despliegues de código, las pruebas de calidad y la seguridad en el ciclo de desarrollo?
- Opciones:
  1. `25 pts` — Despliegue Manual por FTP/SSH: Compilación y subida manual de archivos al servidor directamente por el desarrollador; sin pruebas automatizadas.
  2. `50 pts` — Control de Versiones Git y Despliegue Semiautomático: Uso de repositorios (GitHub/GitLab), con scripts de despliegue pero pruebas manuales en ambiente de staging.
  3. `75 pts` — Tubería CI/CD Automatizada y Pruebas Unitarias: Flujo CI/CD completo (GitHub Actions/Jenkins) con ejecución automatizada de pruebas unitarias/integración previo al merge.
  4. `100 pts` — DevSecOps Pleno / Análisis de Código SAST/DAST y Monitoreo APM: Seguridad automatizada integrada en la tubería (escaneo de vulnerabilidades en código y dependencias) y APM (Datadog/Sentry) en producción.

#### N2-TIC-08 · `TC-TECH-03`

- Sección de origen: SECCIÓN II: AUDITORÍA TÉCNICA DE ARQUITECTURA CLOUD, DEVSECOPS, CIBERSEGURIDAD e IA
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Ciberseguridad, Gobernanza de Datos (ISO 27001 / SOC 2) y Ley LFPDPPP
- Pregunta: Pregunta de Evaluación / Jerarquización: ¿Qué estándares de ciberseguridad, encriptación y protección de datos personales de clientes/usuarios aplica su empresa?
- Opciones:
  1. `25 pts` — Seguridad Básica / Contraseñas Simples: Antivirus comercial básico, sin políticas formales de contraseñas, sin encriptación de base de datos ni aviso de privacidad.
  2. `50 pts` — Cumplimiento Legal Básico LFPDPPP: Aviso de Privacidad formalizado y encriptación SSL/TLS en tránsito, pero sin auditorías de vulnerabilidad ni cifrado en reposo.
  3. `75 pts` — Encriptación Avanzada, WAF y Pruebas de Penetración: Cifrado en tránsito y en reposo (AES-256), cortafuegos WAF, autenticación MMF obligatoria y pentesting anual.
  4. `100 pts` — Certificación ISO/IEC 27001 / Reporte SOC 2 Type II / GDPR: Sistema de Gestión de Seguridad de la Información (SGSI) certificado, cumplimiento SOC 2 / GDPR y equipo SOC/SIEM de respuesta a incidentes 24/7.

#### N2-TIC-09 · `TC-TECH-04`

- Sección de origen: SECCIÓN II: AUDITORÍA TÉCNICA DE ARQUITECTURA CLOUD, DEVSECOPS, CIBERSEGURIDAD e IA
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Integración de Inteligencia Artificial (IA), MLOps y Analítica de Datos
- Pregunta: Pregunta de Evaluación / Jerarquización: ¿De qué manera su producto o plataforma incorpora capacidades de Inteligencia Artificial, Machine Learning o procesamiento de datos?
- Opciones:
  1. `25 pts` — Sin Capacidades de IA / Reportes Estáticos: Sistema transaccional tradicional sin algoritmos predictivos ni análisis avanzado de datos.
  2. `50 pts` — Integración de APIs de IA de Terceros: Uso de APIs externas (OpenAI / Claude / Google AI) para funciones auxiliares de chatbot o generación de texto básico.
  3. `75 pts` — Modelos de Machine Learning Propietarios y Analítica Predictiva: Desarrollo de modelos de ML entrenados con datos propios para clasificación, visión artificial o analítica predictiva.
  4. `100 pts` — Canalización MLOps / Fine-Tuning Propietario e IA Generativa Core: Flujo MLOps automatizado para re-entrenamiento continuo de modelos, arquitectura RAG propia y protección de datos sin filtrado a modelos públicos.

#### N2-TIC-10 · `CP-TC-01`

- Sección de origen: SECCIÓN III: SOFISTICACIÓN PRODUCTIVA Y SALTO EN EL ESPACIO DE SERVICIOS INTENSIVOS EN CONOCIMIENTO
- Bloque: `complejidad`
- Tipo: `seleccion_unica`
- Enunciado: Reconversión hacia la 'Fruta Madura' Digital (Alta Densidad ω_j > 0.65)
- Pregunta: Pregunta de Evaluación / Jerarquización: Considerando su equipo técnico actual, ¿hacia cuál solución tecnológica adyacente tiene mayor viabilidad de reconversión comercial en < 12 meses?
- Opciones:
  1. `25 pts` — Verticalización SaaS B2B para la Industria Tradicional Regional: Software especializado en la nube para la gestión de la cadena automotriz, textil, agroindustrial o logística de Puebla-Tlaxcala.
  2. `50 pts` — Plataformas de Ciberseguridad e Identidad Digital (IAM): Soluciones para autenticación segura, biometría y prevención de fraude en transacciones comerciales.
  3. `75 pts` — Soluciones IoT e Industria 4.0 para Piso de Planta: Sensores y software de monitoreo de maquinaria (OEE, mantenimiento predictivo) integrados a líneas de producción.
  4. `100 pts` — Sistemas de HealthTech y Telemedicina B2B: Software certificado para gestión médica, expediente clínico electrónico (NOM-024) e interpretación de imágenes con IA.

#### N2-TIC-11 · `CP-TC-02`

- Sección de origen: SECCIÓN III: SOFISTICACIÓN PRODUCTIVA Y SALTO EN EL ESPACIO DE SERVICIOS INTENSIVOS EN CONOCIMIENTO
- Bloque: `complejidad`
- Tipo: `seleccion_unica`
- Enunciado: Apuestas Estratégicas Deep Tech y Valoración de Propiedad Intelectual (Alto ICPO)
- Pregunta: Pregunta de Evaluación / Jerarquización: En un horizonte de 2 a 3 años, ¿en cuál segmento de tecnología de frontera tiene visión de desarrollar activos de propiedad intelectual protegidos?
- Opciones:
  1. `25 pts` — Registro de Software (INDAUTOR) y Marcas Comerciales (IMPI): Registro formal del código fuente de aplicaciones y marcas registradas ante instituciones oficiales.
  2. `50 pts` — Patentes de Algoritmos Propietarios y Secretos Industriales: Modelos matemáticos o procesos de procesamiento de datos protegidos bajo patente internacional o secreto industrial estructurado.
  3. `75 pts` — Algoritmos Quantum-Ready y Criptografía Poscuántica: Desarrollo de soluciones de cifrado y optimización preparadas para la era de la computación cuántica.
  4. `100 pts` — Bioinformática y Descubrimiento de Materiales con IA: Modelación computacional para la aceleración de síntesis química, biopolímeros o fármacos en alianza con laboratorios.

#### N2-TIC-12 · `CP-TC-03`

- Sección de origen: SECCIÓN III: SOFISTICACIÓN PRODUCTIVA Y SALTO EN EL ESPACIO DE SERVICIOS INTENSIVOS EN CONOCIMIENTO
- Bloque: `complejidad`
- Tipo: `seleccion_unica`
- Enunciado: Estructura Corporativa, Gobernanza y Preparación para Levantamiento de Capital
- Pregunta: Pregunta de Evaluación / Jerarquización: ¿Qué nivel de formalización legal, gobernanza corporativa e instrumentos de inversión (SAFE / ESOP) tiene implementados la empresa?
- Opciones:
  1. `25 pts` — Empresa Persona Física o S.A. Tradicional Sin Gobernanza: Estructura legal básica sin separación entre fundadores y empresa; sin plan de opciones de acciones (ESOP).
  2. `50 pts` — S.A.P.I. de C.V. Formalizada con Cap Table Ordenado: Sociedad Anónima Promotora de Inversión constituida, con libro de socios limpio y contabilidad auditada.
  3. `75 pts` — Implementación de Instrumentos SAFE / Nota Convertible y ESOP: Uso de acuerdos SAFE (Simple Agreement for Future Equity) estandarizados para inversión ángel y plan ESOP para talentos clave.
  4. `100 pts` — Holding Internacional (Delaware / C-Corp) y Gobernanza Institucional: Estructura de holding internacional lista para recibir capital de fondos de Venture Capital institucionales con Consejo de Administración.

#### N2-TIC-13 · `COL-TC01`

- Sección de origen: SECCIÓN IV: SOLUCIONES COLABORATIVAS ANTE LA FALLA DE ESCALA (BIENES DE CLUB)
- Bloque: `bienes_club`
- Tipo: `seleccion_unica`
- Enunciado: Centro Regional de Ciberseguridad, SOC Comunitario y Nube Privada
- Pregunta: Pregunta de Evaluación / Jerarquización: ¿Cuál sería la disposición de su empresa para utilizar o cofinanciar un Centro de Operaciones de Seguridad (SOC) y nube regional compartida bajo esquema Pay-per-Use?
- Opciones:
  1. `25 pts` — Desinterés u Operación Aislada: Prefiere continuar contratando servicios de nube y seguridad comercial de forma individual.
  2. `50 pts` — Esquema Pay-per-Use de SOC y Pentesting Compartido: Interés en contratar servicios de monitoreo de ciberseguridad y auditorías de vulnerabilidades con descuento colectivo.
  3. `75 pts` — Coinversión en Laboratorio de Pruebas ISO 27001 / SOC 2: Disposición a aportar cuotas para equipar un centro de auditoría de ciberseguridad y certificación acelerada.
  4. `100 pts` — Fideicomiso Tecnológico para Nube Sovereign Regional: Participación fiduciaria para operar un Data Center regional de alta seguridad para datos críticos industriales y de gobierno.

#### N2-TIC-14 · `COL-TC02`

- Sección de origen: SECCIÓN IV: SOLUCIONES COLABORATIVAS ANTE LA FALLA DE ESCALA (BIENES DE CLUB)
- Bloque: `bienes_club`
- Tipo: `seleccion_unica`
- Enunciado: Hub de Entrenamiento de Inteligencia Artificial y Compute Cluster (GPUs)
- Pregunta: Pregunta de Evaluación / Jerarquización: ¿Cómo participaría su empresa en una alianza de Cuádruple Hélice para acceder a un cluster comunitario de procesamiento con supercomputadoras/GPUs para IA?
- Opciones:
  1. `25 pts` — Uso Exclusivo de Nube Pública Comercial: Continuar pagando cómputo de GPU a tarifas comerciales en AWS/GCP sin subsidio ni cluster local.
  2. `50 pts` — Reserva de Horas de Cómputo en Cluster Universitario: Integrar una bolsa regional de horas de GPU en supercomputadoras universitarias (BUAP / UDLAP) para entrenamiento de modelos.
  3. `75 pts` — Hub Regional de Inteligencia Artificial Aplicada: Alianza formal (Empresas TICs - Universidad - Gobierno) para cofinanciar servidores GPU dedicados para startups locales.
  4. `100 pts` — Consorcio de Co-Innovación MLOps e IA Soberana: Participación activa en un consorcio tecnológico que desarrolle modelos fundacionales de IA adaptados a las industrias de la región.

#### N2-TIC-15 · `COL-TC03`

- Sección de origen: SECCIÓN IV: SOLUCIONES COLABORATIVAS ANTE LA FALLA DE ESCALA (BIENES DE CLUB)
- Bloque: `bienes_club`
- Tipo: `seleccion_unica`
- Enunciado: Red de Inversión Ángel, Fondo de Venture Capital Regional y Matchmaking B2B
- Pregunta: Pregunta de Evaluación / Jerarquización: ¿Qué grado de apertura e interés tiene su empresa para asociarse en un consorcio de comercialización B2B y participar en una Red de Inversión Ángel regional?
- Opciones:
  1. `25 pts` — Ventas e Inversión Independientes: Mantener estrategia comercial propia sin participar en redes de aceleración ni fondos colectivos.
  2. `50 pts` — Participación en Eventos de Matchmaking B2B / Demo Days: Asistir a encuentros de vinculación comercial con industrias locales y presentación ante inversionistas.
  3. `75 pts` — Integración al Catálogo Regional KISA y Red Ángel: Formar parte del catálogo verificado de soluciones TICs para la industria de Puebla-Tlaxcala y recibir mentoría de inversión.
  4. `100 pts` — Co-Fundación de Fondo de Venture Capital Tecnológico: Participar como socio industrial en un fondo de capital de riesgo para co-invertir en la aceleración de startups regionales.


### Sector turismo (`TUR`) — 16 reactivos

Fuente: `docs/metodologia/03-instrumento-nivel2/turismo.md`.

#### N2-TUR-01 · `TG-01`

- Sección de origen: (sin encabezado)
- Bloque: `perfilado`
- Tipo: `seleccion_unica`
- Enunciado: Eslabón Dominante en la Cadena Turística y Gastronómica
- Pregunta: Pregunta de Evaluación: ¿En cuál de los siguientes eslabones se concentra la mayor proporción de los ingresos y la actividad comercial de su empresa o establecimiento?
- Opciones:
  1. `HOS` — Hospedaje y Alojamiento: Hoteles (boutique, business, haciendas, turismo rural), posadas, glamping o administración de villas/propiedades vacacionales.
  2. `GAS` — Gastronomía y Restauración: Restaurantes de cocina virreinal/de autor, banquetes y eventos, cafeterías de especialidad, bares/cantinas tradicionales o food halls.
  3. `TOU` — Servicios Turísticos y Tour Operación: DMCs, agencias receptivas, guías certificados (NOM-08/NOM-09), rutas bioculturales y transporte turístico.
  4. `MIC` — Turismo MICE, Eventos y Bodas de Destino: Centros de convenciones, recintos históricos, organizadores de congresos/bodas y proveedores de ambientación/banquetes MICE.

#### N2-TUR-02 · `TG-02`

- Sección de origen: (sin encabezado)
- Bloque: `perfilado`
- Tipo: `seleccion_unica`
- Enunciado: Corredor Turístico y Micro-Región de Operación Principal
- Pregunta: Pregunta de Evaluación: ¿En qué corredor o subregión turística de Puebla o Tlaxcala se localiza la principal infraestructura o punto de atención de su empresa?
- Opciones:
  1. `R1` — Corredor 1: ZMPT y Centro Histórico (Puebla - Tlaxcala - Cholula): Turismo cultural virreinal UNESCO, turismo MICE, corporativo y gastronómico.
  2. `R2` — Corredor 2: Valles y Pueblos Mágicos (Atlixco, Val'Quirico, Calpan, Huejotzingo): Turismo de fin de semana, bodas de destino, agroturismo y ruta del Chile en Nogada.
  3. `R3` — Corredor 3: Sierra Norte y Nororiental (Zacatlán, Chignahuapan, Cuetzalan, Teziutlán): Ecoturismo, turismo de aventura, sidra/esferas, café de especialidad e identidad indígena.
  4. `R4` — Corredor 4: Ruta de las Haciendas, Pulque y Naturaleza (Huamantla, Nanacamilpa, Tlaxco, Altiplano): Santuario de Luciérnagas, haciendas pulqueras, alfombras de aserrín.

#### N2-TUR-03 · `TG-03`

- Sección de origen: (sin encabezado)
- Bloque: `perfilado`
- Tipo: `seleccion_unica`
- Enunciado: Sustentabilidad Hídrica, Manejo de Residuos y Huella Ambiental
- Pregunta: Pregunta de Evaluación: ¿Cuál es la situación de su establecimiento en cuanto al consumo de agua, tratamiento de aguas residuales, aceites de cocina y separación de residuos orgánicos?
- Opciones:
  1. `0 pts` — Sin Manejo Sustentable / Cumplimiento Mínimo: Vertido de aguas residuales sin trampa de grasa certificada; descarga de aceite al drenaje y basura sin separar.
  2. `33 pts` — Separación Básica y Trampa de Grasa: Trampa de grasa en cocina con limpieza periódica y entrega de aceite usado a recolectores; separación primaria de residuos.
  3. `66 pts` — Tratamiento Hídrico y Compras de Reducción: Mantenimiento de trampa de grasa con bitácora, sistema de captación pluvial o grifería ahorradora y compostaje orgánico.
  4. `100 pts` — Certificación Ambiental Integral (EarthCheck / NOM-120 / Zero Waste): Planta de tratamiento de aguas grises propia (PTAR), cero plásticos de un solo uso, compostaje total y energía solar/eficiente.

#### N2-TUR-04 · `R00-TUR-PROD`

- Sección de origen: (sin encabezado)
- Bloque: `borda_r00`
- Tipo: `ranking_borda`; N = 8
- Enunciado: Jerarquización de Fricciones en Operación y Servicio al Cliente (Rompehielos de Jerarquización (Drag-and-Drop 1 al 8))
- Pregunta: Pregunta de Evaluación: Ordene del 1 al 8 los siguientes problemas operativos según el impacto económico negativo y la frecuencia con que afectan la rentabilidad de su establecimiento
- Factores o casillas:
  1. Alta estacionalidad y baja ocupación / ventas entre semana (dependencia exclusiva de fin de semana).
  2. Cancelaciones de última hora, no-shows o mesas vacías por falta de depósitos de garantía.
  3. Alta rotación, ausentismo y falta de capacitación del personal (meseros, cocineros, recepción).
  4. Tiempos de espera prolongados y cuello de botella en cocina / comandas durante horas pico.
  5. Sobrecostos operacionales de energía eléctrica, gas L.P. y abastecimiento de agua en pipas.
  6. Mermas y desperdicio de insumos perecederos por mala proyección de demanda o fallas de refrigeración.
  7. Fallas en conectividad Wi-Fi, terminales punto de venta (TPV) o caídas del sistema de reservas.
  8. Quejas recurrentes, malas calificaciones o gestión deficiente en plataformas digitales (TripAdvisor, Google, OTAs).
- Puntos por factor: no están en el instrumento sectorial. Ver fórmulas de Borda en la sección F. El monto en MXN es captura libre y no entra a ninguna fórmula escrita.

#### N2-TUR-05 · `R00-TUR-SOURCING-IN`

- Sección de origen: (sin encabezado)
- Bloque: `borda_r00`
- Tipo: `ranking_borda`; N = 6
- Enunciado: Jerarquización de Riesgos en Sourcing de Insumos Gastronómicos y Suministros (Rompehielos de Jerarquización (Drag-and-Drop 1 al 6))
- Pregunta: Pregunta de Evaluación: Ordene del 1 al 6 los principales cuellos de botella y riesgos en la compra de insumos agrícolas, alimentos y suministros para su negocio
- Factores o casillas:
  1. Escasez o encarecimiento de ingredientes criollos regionales de temporada (Chile Poblano criollo de Calpan, Nuez de Castilla, piñón, pulque).
  2. Volatilidad de precios en cárnicos, pescados, mariscos y lácteos de calidad estandarizada.
  3. Falta de proveedores locales de alimentos que cuenten con certificación de inocuidad o facturación formal.
  4. Sobrecostos en amenidades, blancos, mantelería, vajilla de Talavera o equipamiento especializado de cocina.
  5. Dificultad para abastecer bebidas locales artesanales con marca y registro sanitario (mezcal poblano, sidra, cerveza artesanal).
  6. Comisiones elevadas de plataformas intermediarias de entrega a domicilio (delivery) y agencias de viaje OTAs (15% a 30%).
- Puntos por factor: no están en el instrumento sectorial. Ver fórmulas de Borda en la sección F. El monto en MXN es captura libre y no entra a ninguna fórmula escrita.

#### N2-TUR-06 · `R00-TUR-SOURCING-SERV`

- Sección de origen: (sin encabezado)
- Bloque: `borda_r00`
- Tipo: `ranking_borda`; N = 6
- Enunciado: Jerarquización de Deficiencias en Infraestructura y Servicios Externos Regionales (Rompehielos de Jerarquización (Drag-and-Drop 1 al 6))
- Pregunta: Pregunta de Evaluación: Ordene del 1 al 6 las mayores deficiencias de infraestructura y servicios gubernamentales/externos en su zona turística
- Factores o casillas:
  1. Insuficiente conectividad y transporte turístico especializado entre los atractivos del corredor o Pueblo Mágico.
  2. Falta de señalética turística clara, módulos de información y estacionamientos seguros para autobuses/visitantes.
  3. Percepción de inseguridad, falta de iluminación o riesgos en tramos carreteros durante traslados nocturnos.
  4. Escasa o ineficiente promoción turística digital del destino por parte de las autoridades municipales o estatales.
  5. Ausencia de centros de formación y certificación técnica turística local (falta de guías capacitados e intérpretes).
  6. Tramitología compleja, inspecciones discrecionales o sobrecostos en licencias de funcionamiento y protección civil.
- Puntos por factor: no están en el instrumento sectorial. Ver fórmulas de Borda en la sección F. El monto en MXN es captura libre y no entra a ninguna fórmula escrita.

#### N2-TUR-07 · `TG-TECH-01`

- Sección de origen: (sin encabezado)
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Inocuidad Alimentaria, Calidad Sanitaria y Distintivos de Higiene
- Pregunta: Pregunta de Evaluación: ¿Cuál es el nivel de implementación formal de normas de higiene e inocuidad alimentaria en la recepción, preparación y servicio de alimentos/bebidas en su establecimiento?
- Opciones:
  1. `0 pts` — Cumplimiento Sanitario Empírico: Limpieza diaria convencional sin bitácoras de temperatura, sin análisis microbiológico de agua/hielo y sin plan de inocuidad.
  2. `33 pts` — Cumplimiento de NOM-251-SSA1-2009 Obligatoria: Manejo higiénico con bitácoras internas de temperatura en refrigeración/congelación y cloración de agua, pero sin distintivo formal.
  3. `66 pts` — Certificación Distintivo H / Punto Limpio Vigente: Reconocimiento otorgado por SECTUR/SALUD con auditoría de tercera parte en recepción, almacenamiento, preparación y servicio.
  4. `100 pts` — Certificación Internacional de Inocuidad (ISO 22000 / FSSC 22000 / Distintivo M Superior): Sistema HACCP certificado para procesamiento masivo de alimentos, banquetes o hotelería de lujo con auditorías no anunciadas.

#### N2-TUR-08 · `TG-TECH-02`

- Sección de origen: (sin encabezado)
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Comercialización Digital, Motor de Reservas Directo y Channel Manager
- Pregunta: Pregunta de Evaluación: ¿Cómo gestiona su establecimiento la atracción de clientes, la venta de habitaciones/mesas y el control de reservas en canales digitales?
- Opciones:
  1. `0 pts` — Venta Tradicional / Walk-in: Captación presencial, telefónica o libreta manual; sin sitio web comercial ni motor de reservas automatizado.
  2. `33 pts` — Venta por Redes Sociales y OTAs Básicas: Consultas por WhatsApp/Facebook y listado en OTAs o apps de delivery, pero con carga manual de disponibilidad y riesgo de overbooking.
  3. `66 pts` — Motor de Reservas Directo en Sitio Web con Pasarela de Pago: Sitio web propio responsivo con motor de reservas/comandas en tiempo real, cobro digital (Stripe/PayPal/SPEI) y listado administrado.
  4. `100 pts` — Ecosistema Digital Integrado (PMS / POS + Channel Manager + CRM + IA): PMS/POS sincronizado en la nube con Channel Manager de OTAs, CRM para fidelización y tarificación dinámica (Yield/Revenue Management) por demanda.

#### N2-TUR-09 · `TG-TECH-03`

- Sección de origen: (sin encabezado)
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Gestión del Talento, Estándares de Servicio y Certificación de Competencias
- Pregunta: Pregunta de Evaluación: ¿Cuál es el grado de formalización de la capacitación, estándares de atención al cliente y certificación del personal de contacto en su empresa?
- Opciones:
  1. `0 pts` — Capacitación Empírica Informa: Aprendizaje 'sobre la marcha' sin manuales de servicio, sin perfil de puesto definido y con alta rotación de personal no calificado.
  2. `33 pts` — Manuales Internos de Operación: Procedimientos de atención escritos para recepción, mesa o cocina, con inducción básica pero sin certificación externa.
  3. `66 pts` — Certificación Distintivo M (Moderniza) o Estándares CONOCER: Personal capacitado y evaluado en estándares de competencias (EC0127, EC0081), inglés turístico básico y protocolos de servicio.
  4. `100 pts` — Planta Laboral Bilingüe Altamente Calificada (Sommelier / Barista / Concierge Clefs d'Or): Cuadro directivo y operativo con certificaciones de especialidad internacional, bilingüismo fluido y plan de carrera continuo.

#### N2-TUR-10 · `TG-TECH-04`

- Sección de origen: (sin encabezado)
- Bloque: `auditoria_tecnica`
- Tipo: `seleccion_unica`
- Enunciado: Paquetización, Turismo de Experiencias y Aumento de Pernocta
- Pregunta: Pregunta de Evaluación: ¿De qué manera su oferta de servicios se integra con otros atractivos del destino para incentivar una mayor estancia promedio (pernocta) y gasto por visitante?
- Opciones:
  1. `0 pts` — Servicio Aislado / Monoproducto: Venta exclusiva de noche de habitación o platillo individual sin vinculación ni recomendación de atractivos del destino.
  2. `33 pts` — Recomendación e Información Turística Básica: Mapeo impreso o digital de atractivos locales disponible en recepción/mesa, pero sin alianzas ni paquetes estructurados.
  3. `66 pts` — Paquetización y Alianzas Comerciales Locales: Paquetes combinados (ej. Hotel + Tour a Luciérnagas / Ruta del Chile en Nogada + Cata de Mezcal) co-diseñados con operadores locales.
  4. `100 pts` — Experiencias Inmersivas Exclusivas de Destino: Producto turístico de autor (talleres privados de cocina virreinal, cenas maridaje en haciendas, senderismo interpretativo con guías NOM-09) que atrae clientes por sí mismo.

#### N2-TUR-11 · `CP-TG-01`

- Sección de origen: (sin encabezado)
- Bloque: `complejidad`
- Tipo: `seleccion_unica`
- Enunciado: Reconversión hacia la 'Fruta Madura' Turística y Gastronómica (Alta Densidad ω_j > 0.65)
- Pregunta: Pregunta de Evaluación: Considerando su infraestructura y ubicación actual, ¿hacia cuál de los siguientes productos de mayor margen y sofisticación tiene viabilidad técnica de reconversión o ampliación en menos de 12 meses?
- Opciones:
  1. `Fruta Madura 1` — Menús Maridaje de Cocina de Origen Certificado: Incorporación de menús degustación con Denominación de Origen (Mezcal Poblano, Talavera en vajilla, ingredientes criollos de temporada).
  2. `Fruta Madura 2` — Bodas de Destino y Eventos Sociales de Alto Formato: Adecuación de jardines, patios virreinales o salones para banquetes boutique de bodas con proveedores locales coordinados.
  3. `Fruta Madura 3` — Rutas y Experiencias Ecoturísticas Certificadas: Habilitación de senderos, glamping de lujo o tours nocturnos con acreditación de seguridad y protección ambiental.
  4. `Fruta Madura 4` — Gastronomía Especializada para Nichos de Alta Derrama: Oferta de menús certificados para requerimientos específicos (gluten-free, vegano, Kosher, Halal o dietas de salud).

#### N2-TUR-12 · `CP-TG-02`

- Sección de origen: (sin encabezado)
- Bloque: `complejidad`
- Tipo: `seleccion_unica`
- Enunciado: Apuestas Estratégicas y Turismo de Alta Complejidad (Alto ICPO)
- Pregunta: Pregunta de Evaluación: En un horizonte de 2 a 3 años con apoyo de coinversión y alianzas institucionales, ¿en cuál segmento de alta sofisticación y derrama económica tiene visión de incursionar?
- Opciones:
  1. `Apuesta 1` — Turismo MICE y Congresos Sustentables Internacionales: Infraestructura y certificación verde para hospedar simposios, convenciones corporativas y expos de nivel internacional.
  2. `Apuesta 2` — Turismo Médico, de Bienestar (Wellness) y Longevidad: Alianza con hospitales/clínicas para estancias de recuperación médica o retreats de spa/wellness de alta gama en entornos naturales.
  3. `Apuesta 3` — Centro de Investigación Biocultural y Laboratorio Gastronómico: Creación de un espacio dedicado a la recuperación, conservación y vanguardia de la cocina tradicional con chef investigador.
  4. `Apuesta 4` — Plataformas de Turismo Inmersivo e Inteligencia Artificial: Integración de experiencias de realidad aumentada en recorridos patrimoniales, conciergerie con IA y membresías Web3/NFTs de arte local.

#### N2-TUR-13 · `CP-TG-03`

- Sección de origen: (sin encabezado)
- Bloque: `complejidad`
- Tipo: `seleccion_unica`
- Enunciado: Economía Circular, 'Kilómetro 0' y Residuo Cero en Alimentos
- Pregunta: Pregunta de Evaluación: ¿Qué nivel de integración tiene su establecimiento con productores agrícolas/artesanales de proximidad (KM 0) y el manejo sustentable de desperdicios orgánicos?
- Opciones:
  1. `0 pts` — Compras en Centrales de Abasto / Intermediarios: Compras convencionales de insumos importados o de origen indeterminado; basura mezclada enviada al relleno sanitario.
  2. `33 pts` — Compras Locales Parciales y Separación de Residuos: Compra de hortalizas o frutas en mercados locales y separación básica de cartón y botellas de vidrio.
  3. `66 pts` — Cadena de Abastecimiento 'Kilómetro 0' Directa: Alianza comercial permanente con cooperativas agrícolas y campesinos de la región (sin intermediarios) para la compra de insumos tradicionales.
  4. `100 pts` — Certificación Residuo Cero (Zero Waste) y Bioconversión: Menú 100% de temporada KM 0, compostaje en planta o envío a biodigestores, reciclaje de aceite para biodiesel y cero merma.

#### N2-TUR-14 · `COL-TG01`

- Sección de origen: (sin encabezado)
- Bloque: `bienes_club`
- Tipo: `seleccion_unica`
- Enunciado: Comité Regional de Marca Destino, Promoción Digital y Channel Manager Compartido
- Pregunta: Pregunta de Evaluación: ¿Cuál sería la disposición de su empresa para integrar un comité colectivo de comercialización que opere una plataforma digital y Channel Manager unificado del destino?
- Opciones:
  1. `0 pts` — Operación Individual Cerrada: Prefiere mantener la comercialización de su negocio de forma independiente y aislada.
  2. `33 pts` — Participación en Campañas de Promoción Conjunta: Interés en aportar a un fondo promocional regional para ferias turísticas o campañas digitales colectivas.
  3. `66 pts` — Adopción de Plataforma Digital y Motor de Reservas Compartido: Disposición a integrar sus inventarios en una app/plataforma web regional con comisiones reducidas (Pay-per-Booking).
  4. `100 pts` — Gobernanza Fiduciaria en la Marca Destino: Participación activa con aportación de capital en un fideicomiso de turismo/gastronomía que administre la marca colectiva del corredor.

#### N2-TUR-15 · `COL-TG02`

- Sección de origen: (sin encabezado)
- Bloque: `bienes_club`
- Tipo: `seleccion_unica`
- Enunciado: Centro de Capacitación y Laboratorio Gastronómico Comunitario (Cuádruple Hélice)
- Pregunta: Pregunta de Evaluación: ¿Cómo participaría su establecimiento en una alianza con escuelas de gastronomía y turismo locales para operar un centro de formación continua y certificación de personal?
- Opciones:
  1. `0 pts` — Capacitación Interna Exclusiva: Mantener la formación del personal dentro del establecimiento sin vinculación académica.
  2. `33 pts` — Recepción de Practicantes y Becarios: Permitir que estudiantes de carreras de turismo/gastronomía realicen estadías temporales en su negocio.
  3. `66 pts` — Co-diseño de Planes de Formación Dual: Participar con chefs y gerentes en la impartición de talleres y certificación de competencias CONOCER/Distintivo H para el sector.
  4. `100 pts` — Patronato de Centro de Innovación Gastronómica y Turística: Co-financiamiento de un laboratorio de investigación biocultural y escuela de alta gastronomía en alianza público-privada.

#### N2-TUR-16 · `COL-TG03`

- Sección de origen: (sin encabezado)
- Bloque: `bienes_club`
- Tipo: `seleccion_unica`
- Enunciado: Consorcio de Compras Consolidadas 'Kilómetro 0' y Sello de Origen Regional
- Pregunta: Pregunta de Evaluación: ¿Qué grado de apertura tiene su empresa para asociarse en un consorcio de compras agrupadas de insumos criollos certificados (Chile de Calpan, Nuez de Castilla, Mezcal, Pulque)?
- Opciones:
  1. `0 pts` — Compras Individuales Directas: Mantener negociaciones independientes con proveedores o distribuidores.
  2. `33 pts` — Compras Agrupadas de Insumos Secos y Blancos: Disposición a consolidar pedidos de loza, mantelería, cristalería o insumos de limpieza para obtener precios de mayoreo.
  3. `66 pts` — Consorcio de Insumos Gastronómicos con Sello de Origen: Integración a una red de compra anticipada a productores agrícolas regionales con garantía de inocuidad y precio estandarizado.
  4. `100 pts` — Integradora Logística y Marca Colectiva Gastronómica: Co-fundación de una empresa integradora con centro de acopio y red de distribución en frío para abastecer al sector turístico regional.


## F. Algoritmo de evaluación

Hay **cuatro** procedimientos escritos. No forman una tubería única. Se especifican por separado. Donde el paso siguiente no está escrito, el pseudocódigo se detiene.

### F.1 Equivalencias que sí están escritas

**Likert 1–7 del `SEN`** (N1, tabla de índices). Sea `x` la respuesta en {1, 2, 3, 4, 5, 6, 7}:

```text
puntos_0_100(x) = ((x - 1) / 6) * 100
```

| Respuesta | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Puntos | 0 | 16.666… | 33.333… | 50 | 66.666… | 83.333… | 100 |

El ancla verbal depende del módulo (entorno, ecosistema, colaboración, expansión), pero la única conversión numérica publicada es esta, y solo bajo `SEN`.

**Selección única de Nivel 2.** El valor es el `Score` impreso en la opción. No hay una tabla maestra que traduzca «la primera opción siempre vale 0». Familias observadas:

| Familia | Valores en el orden de las opciones | Dónde aparece |
| --- | --- | --- |
| A | 25, 50, 75, 100 | Artes gráficas puntuadas; TICs puntuadas; parte de textil, muebles y médico (`MD-01`–`MD-04`) |
| B | 0, 33, 66, 100 | Parte de textil, muebles, turismo y club médico |
| C | 0, 50, 100 | `COL-MED03` (tres opciones) |
| D | 1, 2, 3, 4 | Mayoría de automotriz y construcción |
| E | 1, 2, 3, 4, 5 | Solo `CN-02` |
| F | 5, 12, 20, 25 | Varios de metalmecánica y plásticos |
| G | 25, 22, 20, 18 o 25, 20, 18, 22 | Eslabón de metalmecánica y de plásticos. No es una escalera de madurez creciente |
| H | 4, 3, 2, 2 y 3, 4, 3, 4, 2 | `A01` y `OP01` de automotriz. Hay empates y el orden no es monótono |
| I | códigos no numéricos (`M1`, `ZMPT`, `FM-01`, `HOS`, `Fruta Madura 1`) | Perfilado y parte de complejidad. No entran a una suma |
| J | sin score | Agroindustria, logística, varios perfilados, Borda, `A02`, `CP` de construcción y médico |

**Borda, dos fórmulas distintas para el mismo ranking.**

Tabulador, sección 1. `Rango_i = 1` es máximo dolor. `N` es el número de factores:

```text
BordaTabulador_i = ((N - Rango_i + 1) / N) * 100
```

Reporte, sección 4.2:

```text
BordaReporte_i = ((N - Rango_i + 1) / Σ_{k=1..N} k) * 100
Σ_{k=1..N} k = N * (N + 1) / 2
```

Para un ranking completo, la **media** de los puntajes de todos los factores es constante: no depende del orden.

| N | Media Tabulador | Suma Tabulador | Puntaje del rango 1, Tabulador | Media Reporte | Suma Reporte | Puntaje del rango 1, Reporte |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 8 | 56.25 | 450 | 100 | 12.5 | 100 | 22.222… |
| 6 | 58.333… | 350 | 100 | 16.666… | 100 | 28.571… |

El rango 1 en la fórmula del Tabulador **siempre vale 100**, sea cual sea el factor que el usuario puso primero. Lo que cambia es qué factor recibe ese 100. Eso sirve para una alerta o un enrutamiento. No sirve, por sí solo, como termómetro de madurez que suba y baje.

El Reporte, además, dice que si un factor queda en rango 1 se dispara una alerta roja y un motor de salto hacia «los reactivos de auditoría técnica profunda correspondientes». Ni el Reporte ni los N2 publican el mapa factor → reactivo. El tooltip de automotriz `R00-PROD` dice que el sistema adapta las secciones siguientes según los **tres** principales dolores. Los cuestionarios impresos traen todas las preguntas. Decisión abierta H3.

El campo de costo anual en pesos, presente en varios rankings, no tiene fórmula.

### F.2 Score técnico del Nivel 2

Tabulador, sección 1:

```text
Score_Tecnico = (Σ puntos_de_las_preguntas_incluidas / Σ maximo_de_esas_preguntas) * 100
```

Pseudocódigo de lo que está definido, con el conjunto de preguntas todavía abierto:

```text
funcion scoreTecnico(respuestas, preguntas):
    obtenidos = 0
    maximos = 0
    para cada pregunta en preguntas:
        si la pregunta no es seleccion unica: error de alcance
        si la respuesta esta vacia: DETENER  # no hay regla
        si la opcion elegida no tiene puntaje numerico: DETENER
        obtenidos = obtenidos + puntaje(opcion)
        maximos = maximos + maximoNumerico(pregunta)
    si maximos = 0: DETENER
    devolver (obtenidos / maximos) * 100
```

`preguntas` no está delimitado. El recuadro dice «preguntas técnicas de selección única». La lectura más estrecha es la sección de auditoría (bloque `auditoria_tecnica`). La lectura ancha mete también complejidad y bienes de club cuando tienen `Score` numérico, y quizá el perfilado cuando también lo tiene. Esas lecturas dan resultados distintos. Ejemplo en la sección G. Decisión abierta H5.

No hay peso extra por pregunta más allá de su máximo.

### F.3 Borda hacia un solo número, y el ISMS

```text
ISMS = (0.60 * Score_Tecnico) + (0.40 * Borda_Score_Sourcing_y_Operaciones)
```

`Borda_Score_Sourcing_y_Operaciones` no tiene fórmula de agregación. Cualquier promedio de un ranking completo es constante (F.1), así que **no puede** ser «el promedio de los factores» si se espera que el orden del usuario mueva el ISMS. El puntaje del primer lugar en el Tabulador también es constante (100).

Pseudocódigo honesto:

```text
funcion bordaFactor(N, rango, variante):
    # rango en 1..N, 1 = maximo dolor
    numerador = N - rango + 1
    si variante == "tabulador":
        devolver (numerador / N) * 100
    si variante == "reporte":
        devolver (numerador / (N * (N + 1) / 2)) * 100

funcion isms(scoreTecnico, bordaAgregado):
    # bordaAgregado: NO DEFINIDO en los documentos
    devolver 0.60 * scoreTecnico + 0.40 * bordaAgregado
```

La suma escrita **no invierte** la severidad. Un Borda alto es más dolor (rango 1). Sumarlo con peso 0.40 **sube** el ISMS cuando el dolor declarado es alto. Un índice de madurez esperaría lo contrario. Esa inversión `(100 − severidad)` **no está escrita**. No se aplica. Decisión abierta H6.

### F.4 Cuadrante numérico del Tabulador

Fuente: Tabulador, sección 2. Los mismos cortes se repiten en las 12 fichas sectoriales (Tabulador, sección 3) con otro texto de perfil y de ruta. Los cortes no cambian por sector.

```text
funcion cuadranteISMS(isms):
    si 0 <= isms <= 39:  devolver "I"
    si 40 <= isms <= 59: devolver "II"
    si 60 <= isms <= 79: devolver "III"
    si 80 <= isms <= 100: devolver "IV"
    si no: DETENER  # incluye huecos si el puntaje no es entero
```

| Rango ISMS | Cuadrante | Nombre en el tabulador general |
| --- | --- | --- |
| 0 a 39 | I | Trampa de básico / commodity |
| 40 a 59 | II | Vulnerabilidad operativa / cuello de botella |
| 60 a 79 | III | Especialista en riesgo de transición |
| 80 a 100 | IV | Líder de frontera e integrador global |

No hay regla de redondeo. Un 39.5 no cae en «0 a 39» ni en «40 a 59». Decisión abierta H7.

Nombres de la Fase 5 del Reporte, parecidos y no idénticos: I Trampa de commodity / baja complejidad; II Procesador artesanal vulnerable; III Especialista de alto volumen / riesgo de transición; IV Líder de frontera global. El Reporte no les pone los cortes 39/59/79.

### F.5 Cruce cualitativo del propio instrumento N2

No es una fórmula. El texto dice que el cruce de los dos ejes de la sección D.2 «ubica» a la empresa en un cuadrante, y describe la condición con frases («inocuidad baja / complejidad baja», etc.). No dice:

- cómo se promedian `FS-01`…`FS-04`;
- qué puntaje separa bajo, medio y alto;
- qué pasa si un eje es alto y el otro bajo cuando la viñeta del cuadrante III no sigue siempre el mismo par (en artes gráficas el cuadrante III está etiquetado «color medio / complejidad alta», no «color alto / complejidad baja»).

En agroindustria las etiquetas de los cuatro cuadrantes sí siguen el esquema bajo/bajo, medio/medio, alto/bajo, alto/alto. En artes gráficas el tercero es medio/alto. No hay una matriz 2×2 común con umbrales.

Sin puntos en agroindustria y logística, este cruce tampoco es numérico.

### F.6 Nivel 1: lo que sí se puede calcular y lo que no

**`SEN`**, con `EN1`…`EN6` cada uno en 1…7. N1, tabla de índices:

```text
promedio = (EN1 + EN2 + EN3 + EN4 + EN5 + EN6) / 6
SEN = ((promedio - 1) / 6) * 100
```

Si falta un `EN`, no hay regla (no dice si el divisor baja). Decisión abierta H8.

**`SEI`, `ITC`, `IMN`, `ICA`, `IPC`:** el nombre del agregado está escrito y los reactivos también. Faltan puntos de las opciones no Likert y, en `ITC` e `IMN`, los ponderadores. No se inventan. Esos cinco índices quedan sin número hasta una decisión de diseño.

**Índice de brecha, dos versiones.**

Reporte, sección 5:

```text
IB = Score_Percepcion - Score_Objetivo
```

| IB | Lectura del Reporte |
| --- | --- |
| IB < −15 | Opacidad e incertidumbre paralizante |
| −15 ≤ IB ≤ +15 | Alineación |
| IB > +15 | Falsa complacencia |

N1, motor de procesamiento:

```text
IB = Score Percepcion Empresarial (SEN + SEI) - Score Objetivo Estadistico (IMCO / IMD Regional)
```

| IB | Lectura del N1 |
| --- | --- |
| IB < −10 | Alerta roja / fricción institucional |
| −10 ≤ IB ≤ +10 | Semáforo verde / alineación |
| IB > +10 | Alerta amarilla / falsa complacencia |

Diferencias que impiden codificar una sola IB:

- Umbral ±15 en el Reporte y ±10 en el N1.
- El N1 escribe `SEN + SEI`. No dice si es suma (escala posible 0–200) o una forma de nombrar los dos scores. Restar un objetivo en escala 0–100 a una suma 0–200 sesga el signo. No está aclarado.
- El score objetivo IMCO/IMD regional **no está tabulado** en estos documentos. El Reporte cita ICE de complejidad (ZMPT 0.73, Puebla 0.21, Tlaxcala 0.05, Tehuacán −0.68, Teziutlán −0.92). Esos ICE no están identificados como el `Score_Objetivo` de la IB.
- El semáforo del N1 (rojo / verde / amarillo) no es el cuadrante I–IV del Tabulador.

### F.7 Híbrido percepción–objetivo

```text
ScoreHibrido = w_obj * Score_Objetivo + w_per * Score_Percepcion
w_obj + w_per = 1
w_obj ∈ [0.64, 0.75]
w_per ∈ [0.25, 0.36]
```

No fija el par. No define los dos scores como salida del formulario. No es la combinación de Nivel 1 con Nivel 2.

### F.8 Vacíos, no aplica, y si N1 se mezcla con N2

- Respuesta vacía: no hay regla de imputar 0, de sacar la pregunta del máximo, ni de bloquear el envío. El N1 pide guardado automático de sesión; eso no es una regla de puntaje.
- «No aplica»: no es un estado general. En automotriz, `COL02` y `COL03` traen una opción llamada «No aplica» con **1 punto**, dentro del máximo de la pregunta. Entra a la suma si esa pregunta entra al `Score_Tecnico`. No se excluye.
- Nivel 1 y Nivel 2 se reportan **aparte**. El ISMS es solo Nivel 2. Los seis índices son solo Nivel 1. La Fase 5 cruza madurez operativa contra complejidad específica, que es el lenguaje de la sección V de los N2, no una suma `a·N1 + b·N2`.
- El Tabulador no menciona al Nivel 1. El N1 dice que incorpora «la sección maestra del Tabulador General de Interpretación de Resultados Nivel 2» para convertir las respuestas sectoriales en score 0–100, cuadrante y plan. Es decir: el N1 **contiene la puerta** y **remite** el cálculo sectorial al tabulador. No funde los puntajes.

### F.9 Diferencia explícita Tabulador N2 frente a Nivel 1

| Tema | Nivel 1 (formulario + motor) | Nivel 2 (Tabulador) |
| --- | --- | --- |
| Índice principal | Seis índices. Solo `SEN` tiene fórmula cerrada | Un ISMS 0–100 |
| Pesos | No hay porcentajes entre índices | 60% selección técnica, 40% Borda |
| Escala de respuesta | Likert 1–7 en cuatro bloques; el resto es selección sin puntos | El `Score` impreso, que cambia de sector en sector |
| Borda | No hay rankings en el formulario web | Tres rankings por instrumento, con dos fórmulas posibles según el documento que se cite |
| Dictamen | IB con corte ±10 contra un dato externo no tabulado | Cuadrante por rango 0–39 / 40–59 / 60–79 / 80–100 |
| Otra brecha | El Reporte usa IB con corte ±15 y otra definición | El Tabulador no calcula IB |
| Preguntas comunes | Las 46, para todos | Ninguna pregunta de Nivel 2 es común a los 12 sectores |

---

## G. Ejemplo numérico

Los documentos **no traen** un caso resuelto. Este ejemplo se calcula con los puntajes impresos en artes gráficas. El sector se eligió porque sus tarjetas puntuadas usan una sola escala (25, 50, 75, 100) y el texto de cada opción está en `artes-graficas.md`. Agroindustria no sirve para un ejemplo numérico: no hay `Score` en ninguna opción.

Las respuestas son un llenado hipotético para mostrar la aritmética. No salen de un caso del documento.

### G.1 Respuestas supuestas y puntos escritos

Perfilado y Borda no tienen puntos de opción. No entran al `Score_Tecnico`.

| ID estable | Fuente | Opción supuesta | Puntos escritos | Máximo de la pregunta |
| --- | --- | --- | ---: | ---: |
| N2-GRAF-06 | `AG-TECH-01` | Medición densitométrica básica | 50 | 100 |
| N2-GRAF-07 | `AG-TECH-02` | CTP térmico / UV estándar | 50 | 100 |
| N2-GRAF-08 | `AG-TECH-03` | Copia de muestras manual | 25 | 100 |
| N2-GRAF-09 | `AG-TECH-04` | Tintas de baja migración solo bajo pedido | 50 | 100 |
| N2-GRAF-10 | `CP-AG-01` | Empaque plegadizo farmacéutico | 25 | 100 |
| N2-GRAF-11 | `CP-AG-02` | Empaque antifalsificación | 25 | 100 |
| N2-GRAF-12 | `CP-AG-03` | Segregación y cadena de custodia FSC | 75 | 100 |
| N2-GRAF-13 | `COL-AG01` | Pay-per-use de placas CTP | 50 | 100 |
| N2-GRAF-14 | `COL-AG02` | Bolsa regional de muestras | 50 | 100 |
| N2-GRAF-15 | `COL-AG03` | Compras individuales | 25 | 100 |

Subtotal de las cuatro técnicas (`AG-TECH-01` a `04`): puntos 50+50+25+50 = **175**. Máximo 400.

```text
Score_Tecnico_solo_seccion_II = (175 / 400) * 100 = 43.75
```

Subtotal de las diez tarjetas con puntaje: 175 + 25 + 25 + 75 + 50 + 50 + 25 = **425**. Máximo 1000.

```text
Score_Tecnico_todas_las_puntuadas = (425 / 1000) * 100 = 42.5
```

Solo técnica + complejidad (siete preguntas, que son los dos ejes de la sección V de artes gráficas): 175+25+25+75 = **300**. Máximo 700.

```text
Score_Tecnico_ejes_de_la_seccion_V = (300 / 700) * 100 = 42.857...
```

Esas tres cifras usan la misma fórmula del Tabulador. Cambian porque el documento no fija el conjunto. Ninguna es «el» score oficial por encima de las otras.

### G.2 Borda de un ranking, con las dos fórmulas

Se supone este orden en `R00-GRAF-PROD` (N = 8, 1 = mayor gravedad), solo para aplicar las fórmulas:

| Rango | Factor (texto corto del instrumento) | Tabulador `((8−r+1)/8)×100` | Reporte `((8−r+1)/36)×100` |
| ---: | --- | ---: | ---: |
| 1 | Variaciones de tono y color | 100 | 22.222… |
| 2 | Tiempos de ajuste y arreglo | 87.5 | 19.444… |
| 3 | Mermas de sustrato | 75 | 16.666… |
| 4 | Cuellos de botella en acabado | 62.5 | 13.888… |
| 5 | Escasez de prensistas | 50 | 11.111… |
| 6 | Paros no programados | 37.5 | 8.333… |
| 7 | Variaciones de energía o aire | 25 | 5.555… |
| 8 | Descalibración de monitores y CTP | 12.5 | 2.777… |
|  | Suma | 450 | 100 |
|  | Media | 56.25 | 12.5 |

La media no se mueve si el usuario invierte el ranking. Los otros dos rankings de artes gráficas (materiales y servicios) tienen N = 6. Su media de Tabulador es 58.333… y la del Reporte es 16.666…, otra vez constantes.

Por eso **no se cierra el ISMS**. Hace falta decidir qué número único es `Borda_Score_Sourcing_y_Operaciones`. Si se usara la media del Tabulador, el 40% sería casi una constante (cerca de 57) y el orden del empresario no cambiaría el índice. Si se usara el puntaje del rango 1 del Tabulador, ese 40% valdría siempre 40 puntos de ISMS `(0.40 × 100)`.

Ilustración de la sensibilidad, no como resultado oficial. Con `Score_Tecnico = 43.75` (solo sección II):

| Si el Borda agregado valiera… | ISMS = 0.60×43.75 + 0.40×Borda | Cuadrante si se aplicara el Tabulador |
| ---: | ---: | --- |
| 0 | 26.25 | I (0 a 39) |
| 56.25 (media constante de un N=8) | 48.75 | II (40 a 59) |
| 100 (rango 1 del Tabulador) | 66.25 | III (60 a 79) |

El mismo llenado técnico cae en tres cuadrantes distintos según una agregación que el documento no elige. **El resultado de madurez de este ejemplo queda indeterminado.** Lo único cerrado es el `Score_Tecnico` condicionado al conjunto de preguntas: 43.75, o 42.5, o 42.857….

### G.3 Lo que la sección V de artes gráficas habría exigido y no se puede cerrar

Esa sección cruza color (`AG-TECH-01` a `04`, media de puntos 175/4 = 43.75) contra complejidad (`CP-AG-01` a `03`, puntos 25+25+75 = 125, media 41.666…). No dice qué media es «color bajo», «medio» o «alto». No se asigna cuadrante I–IV por esa vía.

### G.4 `SEN` de muestra, aparte del ISMS

Supuestos `EN1`…`EN6` = 2, 3, 3, 4, 2, 5.

```text
promedio = (2+3+3+4+2+5) / 6 = 19/6 = 3.1666...
SEN = ((3.1666... - 1) / 6) * 100 = (2.1666... / 6) * 100 = 36.111...
```

Ese 36.111… es solo `SEN`. No se suma al 43.75. No hay IB porque falta el score objetivo externo.

---

## H. Decisiones abiertas

Hay que resolverlas antes de codificar. Ninguna se contesta en los documentos.

1. **H1. Momento del Nivel 2.** ¿El Nivel 2 empieza al guardar `F0.2`, o al terminar los módulos 1–6 del Nivel 1?
2. **H2. Un solo Borda.** Cómo pasar tres rankings (y el puntaje por factor) a `Borda_Score_Sourcing_y_Operaciones`. La media y el puntaje del primer lugar, con la fórmula del Tabulador, no dependen del orden.
3. **H3. Cuál fórmula de Borda.** Tabulador (`/ N`) o Reporte (`/ N(N+1)/2`). Y el mapa de «rango 1 → reactivos que se muestran», que no existe. También si el denominador usa los tres rankings o solo producción y materiales, como sugiere el nombre «sourcing y operaciones».
4. **H4. Qué dictamen manda.** ISMS con cortes 0–39 / 40–59 / 60–79 / 80–100, o el cruce cualitativo de la sección V de cada N2, o los cuatro perfiles sin corte de automotriz. Pueden contradecirse.
5. **H5. Qué preguntas entran al 60%.** Solo la auditoría técnica, o también complejidad, club y perfilado cuando tienen número. En artes gráficas eso mueve el score de 43.75 a 42.5 en el ejemplo.
6. **H6. Sentido del Borda dentro del ISMS.** La fórmula suma severidad. No dice que se reste de 100. Hay que decidir si se implementa la suma como está escrita o se corrige el sentido con quien diseñó el instrumento.
7. **H7. Bordes no enteros y topes.** 39.5, redondeo, y qué hacer si el score sale de 0–100 por una opción mal puntuada.
8. **H8. Vacíos.** Si falta una respuesta: bloquear, excluir pregunta y máximo, o poner 0. No está escrito. Lo mismo si falta un ítem Likert del `SEN` (¿divisor 6 o divisor de los contestados?).
9. **H9. Instrumentos sin puntos.** Agroindustria y logística no traen `Score`. Metalmecánica y plásticos mezclan puntos con códigos (`ZMPT`, `FM-01`). Esos códigos no se pueden sumar. Hasta que alguien asigne números, esos sectores no tienen `Score_Tecnico`.
10. **H10. Nivel 1 incompleto.** Faltan puntos y pesos de `ITC`, `IMN` e `ICA`. Falta precisar el promedio de `SEI` (seis ítems, o dos bloques). Falta la conversión a 0–100 de `IPC`, aunque el patrón del `SEN` es el candidato natural: no está escrito para `IPC`.
11. **H11. IB y híbrido.** Elegir ±10 o ±15. Definir si `SEN + SEI` es suma o promedio. Proveer la tabla del score objetivo IMCO/IMD, que no viene en estos archivos. Elegir un par `(w_obj, w_per)` dentro del rango, o fijar 0.64/0.36 como la cita IMD. Definir qué variable es `Score_Percepcion` y cuál `Score_Objetivo`.
12. **H12. Lógicas de salto del Nivel 1.** `R01` cita `F0.1`/`F0.2` en el componente y `F0.3`/`F0.4` en la lógica. `F0.5` anuncia preguntas de aranceles que no están en el formulario. Falta la lista de textos que cambian entre `MAN` y `SER` en los módulos 2, 3 y 4: en el archivo, `EN`, `ECO`, `COL` y `EXP` no tienen doble redacción.
13. **H13. Costo en pesos del ranking y acta de cierre.** Son captura. No entran a una fórmula. Confirmar que se guardan como evidencia y no como puntaje.
14. **H14. Encuesta `P00`–`P20`.** Confirmar que no se implementa en paralelo al formulario de 46 reactivos. Si sí se implementa, falta el cuestionario, porque el Reporte solo lo resume.
15. **H15. Prioridad cuando el eslabón no es una escalera.** En metalmecánica el eslabón vale 25, 22, 20 o 18. En automotriz dos posiciones valen 2. Esos números están escritos; no está escrito que representen «más madurez». Si entran al 60%, arrastran el ISMS con una lógica de clasificación, no de desempeño.

---

## I. Contrato de datos para la app

Esto no es el JSON de producción. Es la forma que los documentos soportan. Los campos `null` son huecos reales: el loader no debe inventar el número.

```json
{
  "instrumentVersion": "n1-web-3.0",
  "region": "puebla-tlaxcala",
  "applicationModel": {
    "everyoneSees": "n1",
    "sectorChoiceQuestionId": "N1-02",
    "sectorChoiceSourceId": "F0.2",
    "thenAsk": "exactlyOneN2",
    "n1AndN2CombinedIndex": null
  },
  "sectors": [
    {
      "id": "automotriz",
      "moduleCode": "MOD-AUTO-N2",
      "n1OptionLabel": "Sector 01: Industria Automotriz, Autopartes, BIW y Electrónica SDV",
      "sourceFile": "03-instrumento-nivel2/automotriz.md"
    }
  ],
  "questions": [
    {
      "id": "N1-11",
      "sourceId": "EN1",
      "level": "n1",
      "sectorId": null,
      "block": "SEN",
      "section": "MODULO 2",
      "type": "likert_7",
      "prompt": "Las normas fiscales, ambientales, laborales y de zonificación en mi entidad son claras, estables y permiten planear inversiones a largo plazo sin sorpresas intempestivas.",
      "options": [
        { "value": 1, "label": "Totalmente en desacuerdo / obstáculo severo", "score": null },
        { "value": 7, "label": "Totalmente de acuerdo / facilitador excelente", "score": null }
      ],
      "scaleTo100": "((value - 1) / 6) * 100",
      "scaleTo100AppliesTo": "SEN_only_as_written",
      "required": null,
      "skipLogic": null
    },
    {
      "id": "N2-GRAF-06",
      "sourceId": "AG-TECH-01",
      "level": "n2",
      "sectorId": "artes-graficas",
      "block": "auditoria_tecnica",
      "section": "SECCION II",
      "type": "single_select",
      "prompt": "¿Cuál es el nivel de estandarización en gestión de color, uso de espectrofotómetros y perfiles ICC en su proceso de preprensa e impresión?",
      "options": [
        { "value": "opt1", "label": "Ajuste empírico a ojo", "score": 25 },
        { "value": "opt2", "label": "Medición densitométrica básica", "score": 50 },
        { "value": "opt3", "label": "ISO 12647 / medición espectral", "score": 75 },
        { "value": "opt4", "label": "Certificación G7 Master", "score": 100 }
      ],
      "required": null
    },
    {
      "id": "N2-GRAF-03",
      "sourceId": "R00-GRAF-PROD",
      "level": "n2",
      "sectorId": "artes-graficas",
      "block": "borda_r00",
      "type": "rank",
      "rankDirection": "1_is_max_pain",
      "factorCount": 8,
      "factors": [{ "id": "f1", "label": "Variaciones de tono y color entre tirajes" }],
      "costCapture": { "unit": "MXN", "entersScore": false },
      "scorePerFactor": null
    }
  ],
  "weights": {
    "isms": {
      "technicalSingleSelect": 0.6,
      "borda": 0.4,
      "technicalQuestionIds": null,
      "bordaAggregation": null
    },
    "n1Indices": {
      "SEN": { "questionIds": ["N1-11", "N1-12", "N1-13", "N1-14", "N1-15", "N1-16"], "formula": "((mean(likert) - 1) / 6) * 100" },
      "SEI": { "questionIds": ["N1-17", "N1-18", "N1-19", "N1-20", "N1-21", "N1-22"], "inputIds": ["N1-17", "N1-18", "N1-19", "N1-20"], "outputIds": ["N1-21", "N1-22"], "formula": null },
      "ITC": { "questionIds": ["N1-23", "N1-24", "N1-25", "N1-26", "N1-27"], "optionScores": null, "weights": null },
      "IMN": { "questionIds": ["N1-28", "N1-29", "N1-30", "N1-31", "N1-32"], "optionScores": null, "weights": null },
      "ICA": { "questionIds": ["N1-33", "N1-34", "N1-35", "N1-36", "N1-37"], "optionScores": null, "weights": null },
      "IPC": { "questionIds": ["N1-38", "N1-39", "N1-40", "N1-41", "N1-42", "N1-43", "N1-44", "N1-45", "N1-46"], "formula": null }
    },
    "hybrid": {
      "wObjective": { "min": 0.64, "max": 0.75, "fixed": null },
      "wPerception": { "min": 0.25, "max": 0.36, "fixed": null },
      "constraint": "wObjective + wPerception = 1"
    }
  },
  "bordaFormulas": {
    "tabulador": "((N - rank + 1) / N) * 100",
    "reporte": "((N - rank + 1) / (N * (N + 1) / 2)) * 100",
    "active": null
  },
  "thresholds": {
    "ismsQuadrants": [
      { "id": "I", "min": 0, "max": 39, "label": "Trampa de basico / commodity" },
      { "id": "II", "min": 40, "max": 59, "label": "Vulnerabilidad operativa / cuello de botella" },
      { "id": "III", "min": 60, "max": 79, "label": "Especialista en riesgo de transicion" },
      { "id": "IV", "min": 80, "max": 100, "label": "Lider de frontera e integrador global" }
    ],
    "ib": {
      "reporte": { "low": -15, "high": 15 },
      "n1Instrument": { "low": -10, "high": 10 },
      "active": null,
      "objectiveScoreTable": null
    },
    "n2QualitativeMatrixCutoffs": null
  },
  "missingValuePolicy": null,
  "notApplicablePolicy": "only_where_an_option_is_labeled_no_aplica_and_carries_a_printed_score"
}
```

Notas de implementación que salen del contrato, no de una preferencia:

- `sectors` debe tener 12 elementos, uno por fila de `F0.2`. El ejemplo muestra solo la forma de uno.
- `questions` debe incluir las 46 de Nivel 1 y las 191 de Nivel 2. El banco completo de textos y scores está en E.1 y E.2, y la redacción larga sigue en cada `.md`.
- `weights.isms.technicalQuestionIds` y `bordaAggregation` quedan `null` a propósito.
- `optionScores` de `ITC`, `IMN` e `ICA` quedan `null` a propósito.
- No generar todavía los JSON de producción: este bloque es solo el contrato.
