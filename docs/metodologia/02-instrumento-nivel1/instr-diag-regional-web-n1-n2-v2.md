**INSTRUMENTO DE DIAGNÓSTICO REGIONAL-EMPRESARIAL DE NIVEL 1**

**(PLATAFORMA WEB INTERACTIVA)**

**Perfilado Inicial, Precondiciones del Estado de Derecho, Absorción Tecnológica y Menú de Enrutamiento Dinámico a los 12 Instrumentos Sectoriales de Nivel 2 (Región Puebla - Tlaxcala)**

+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| **Versión del Formulario:** 3.0 Web UX/UI Interactive Edition                                                                                                                                                                                                                                            |
|                                                                                                                                                                                                                                                                                                          |
| **Entorno de Ejecución:** Plataforma Web SaaS / App Responsiva                                                                                                                                                                                                                                           |
|                                                                                                                                                                                                                                                                                                          |
| **Propósito:** Guía completa de redacción de preguntas, componentes de interfaz (UI), opciones de respuesta con ponderación numérica, textos de ayuda/tooltips y lógica de salto (skip-logic) para implementación en frontend (React/Vue/Angular) o gestor de formularios (Typeform/SurveyJS/Qualtrics). |
|                                                                                                                                                                                                                                                                                                          |
| **DIRECTRICES DE ARQUITECTURA UX/UI Y REGLAS DE NAVEGACIÓN WEB**                                                                                                                                                                                                                                         |
|                                                                                                                                                                                                                                                                                                          |
| *Principios de diseño de interfaz para maximizar la tasa de respuesta y evitar el sesgo de fatiga cognitiva*                                                                                                                                                                                             |
|                                                                                                                                                                                                                                                                                                          |
| Para garantizar una experiencia de usuario (UX) óptima, el instrumento debe desplegarse como una **aplicación web progresiva o formulario multipaso (Step-by-Step Wizard)**, cumpliendo con los siguientes estándares de diseño e interactividad:                                                        |
|                                                                                                                                                                                                                                                                                                          |
| > **• Navegación Modular por Fases:** Cada etapa se muestra como una pantalla o vista independiente con su propia barra de progreso visual (ej. \'Paso 3 de 7: Entorno Normativo\'). Esto segmenta el esfuerzo y reduce el abandono.                                                                     |
| >                                                                                                                                                                                                                                                                                                        |
| > **• Micro-copy y Tooltips Claros:** Todo término técnico (ej. \'Nearshoring\', \'VCR\', \'Bienes de Club\', \'Tier 2\') incluye un icono flotante de información (?) que despliega una definición breve sin abandonar el flujo.                                                                        |
| >                                                                                                                                                                                                                                                                                                        |
| > **• Persistencia y Guardado Automático:** El sistema guarda automáticamente el progreso en tiempo real (Local Storage / Backend Session) para permitir retomar la sesión ante desconexiones accidentales.                                                                                              |
| >                                                                                                                                                                                                                                                                                                        |
| > **• Componentes Nativos Optimizados para Móvil:** Las matrices tipo Likert (1 a 7) se renderizan como botones numéricos horizontales en pantallas de escritorio y como selectores deslizantes o tarjetas verticales táctiles en dispositivos móviles.                                                  |
| >                                                                                                                                                                                                                                                                                                        |
| > **• Enrutamiento Dinámico Silencioso:** Las respuestas del Módulo 0 adaptan de forma reactiva el vocabulario de las preguntas subsiguientes (mostrando términos de manufactura o servicios según corresponda) sin que el usuario perciba fricción técnica.                                             |
+==========================================================================================================================================================================================================================================================================================================+

  -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **📌 ENCUADRE REGIONAL Y ARQUITECTURA DE ENRUTAMIENTO A NIVEL 2\**
  Este instrumento constituye la puerta de entrada digital (Nivel 1 General) del Sistema de Diagnóstico Regional-Empresarial. Cumple tres funciones críticas:\
  1. Capturar la caracterización estructural y geográfica de la unidad económica en la región Puebla - Tlaxcala.\
  2. Auditar el impacto de las precondiciones del entorno (Estado de Derecho, infraestructura, seguridad en corredores y absorción tecnológica).\
  3. Ejecutar el enrutamiento automatizado (\*triggering logic\*) hacia el Instrumento Especializado de Nivel 2 correspondiente, desglosado puntualmente para los 12 sectores económicos con desarrollo metodológico propio.\
  \
  Asimismo, incorpora la sección maestra del Tabulador General de Interpretación de Resultados Nivel 2 para convertir las respuestas de los instrumentos sectoriales en un Score Normalizado (0-100 pts), Cuadrante de Madurez Operativa y Plan de Acción a 6 y 12 meses.
  -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**MÓDULO 0: CARACTERIZACIÓN ESTRUCTURAL Y ENRUTAMIENTO SECTORIAL**

*Configura los parámetros del modelo de negocio que gobiernan la personalización del cuestionario*

  -----------------------------------------------------------------------------------------------------------------
  **\[F0.1\] Tamaño de la Empresa y Estrato de Empleo Directo\
  ¿En qué estrato de tamaño y personal ocupado total se clasifica su unidad económica?\
  \**
  *ℹ️ Micro-copy / Guía Técnica: Define la escala operativa y los criterios de estratificación oficial INEGI/SE.\
  \*
  ( ) Microempresa: 1 a 10 colaboradores directos. \[Score: M1\]\
  ( ) Pequeña Empresa: 11 a 50 colaboradores directos. \[Score: M2\]\
  ( ) Mediana Empresa: 51 a 250 colaboradores directos. \[Score: M3\]\
  ( ) Grande Empresa: Más de 250 colaboradores directos. \[Score: M4\]
  -----------------------------------------------------------------------------------------------------------------

  -----------------------------------------------------------------------------------------------------------------

  --------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **\[F02\] Sector Económico Dominante y Menú de Enrutamiento a Nivel 2\
  ¿En cuál de los siguientes 12 sectores económicos especializados concentra su empresa la mayor proporción de su facturación bruta anual en la región Puebla - Tlaxcala?\
  \**
  *ℹ️ Micro-copy / Guía Técnica: Respuesta crítica de enrutamiento: determina la apertura inmediata del formulario de auditoría profunda de Nivel 2 correspondiente.\
  \*
  ( ) Sector 01: Industria Automotriz, Autopartes, BIW y Electrónica SDV \[Enruta a: MOD-AUTO-N2\]\
  ( ) Sector 02: Agroindustria, Procesamiento de Alimentos y Bebidas \[Enruta a: MOD-AGRO-N2\]\
  ( ) Sector 03: Plásticos, Polímeros Técnicos y Envase Sustentable \[Enruta a: MOD-PLAST-N2\]\
  ( ) Sector 04: Metalmecánica, Maquinado CNC de Precisión y Pailería \[Enruta a: MOD-METAL-N2\]\
  ( ) Sector 05: Textil, Confección y Textiles Técnicos Industriales \[Enruta a: MOD-TEXT-N2\]\
  ( ) Sector 06: Muebles, Madera e Ingeniería RTA \[Enruta a: MOD-MUEB-N2\]\
  ( ) Sector 07: Turismo, Gastronomía y Servicios de Hospitalidad \[Enruta a: MOD-TUR-N2\]\
  ( ) Sector 08: Dispositivos Médicos, Material Quirúrgico y Salud \[Enruta a: MOD-MED-N2\]\
  ( ) Sector 09: Construcción, Prefabricados e Infraestructura \[Enruta a: MOD-CONST-N2\]\
  ( ) Sector 10: Logística, Transporte de Carga y Cadena de Suministro \[Enruta a: MOD-LOG-N2\]\
  ( ) Sector 11: Artes Gráficas, Impresión y Empaque Estructural \[Enruta a: MOD-GRAF-N2\]\
  ( ) Sector 12: Startups, Soluciones TICs y Software (KISA / Deep Tech) \[Enruta a: MOD-TIC-N2\]
  --------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  --------------------------------------------------------------------------------------------------------------------------------------------------------------------------

+---------------------------------------------------------------------------------------------------------------------------------------------------------+
| **\[F0.3\] ¿Cuál es la actividad económica principal de su establecimiento?**                                                                           |
|                                                                                                                                                         |
| **Tipo de Componente UI:** Single-Select Radio Button (Tarjetas Visuales) \|                                                                            |
|                                                                                                                                                         |
| **Texto de Ayuda / Tooltip:** *\"Seleccione la actividad que genere el mayor porcentaje de su facturación actual.\"*                                    |
|                                                                                                                                                         |
| **Opciones de Respuesta y Parámetros:**                                                                                                                 |
|                                                                                                                                                         |
| > **•** \[MAN\] Manufactura / Producción Física: Transformación de materias primas, maquinado, confección o ensamble de bienes físicos.                 |
| >                                                                                                                                                       |
| > **•** \[SER\] Servicios Intensivos en Conocimiento (KISA): Software, ingeniería de diseño, logística 3PL/4PL, consultoría o mantenimiento industrial. |
|                                                                                                                                                         |
| **Lógica de Salto / Visualización Condicional:** Filtro maestro: Activa la redacción industrial \[MAN\] o de servicios \[SER\] en los módulos 2,3 y 4.  |
+=========================================================================================================================================================+

+--------------------------------------------------------------------------------------------------------------------------------------------------------------+
| **\[F0.4\] ¿Cuál es su modelo de negocio y canal transaccional dominante?**                                                                                  |
|                                                                                                                                                              |
| **Tipo de Componente UI:** Single-Select Radio Button \|                                                                                                     |
|                                                                                                                                                              |
| **Texto de Ayuda / Tooltip:** *\"Identifique quién es su comprador directo habitual.\"*                                                                      |
|                                                                                                                                                              |
| **Opciones de Respuesta y Parámetros:**                                                                                                                      |
|                                                                                                                                                              |
| > **•** \[B2B\] Empresa a Empresa: Ventas a otras compañías, maquiladoras, armadoras OEM, distribuidores mayoristas o compras de gobierno.                   |
| >                                                                                                                                                            |
| > **•** \[B2C\] Empresa a Consumidor: Ventas directas al usuario o consumidor final mediante tiendas físicas, retail, autoservicio o plataformas e-commerce. |
|                                                                                                                                                              |
| **Lógica de Salto / Visualización Condicional:** Personaliza los términos de venta en R01 (homologación corporativa vs. adquisición de clientes finales).    |
+==============================================================================================================================================================+

+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| **\[F0.5\] ¿Cuál es el alcance geográfico de sus mercados actuales y meta a 24 meses?**                                                                                                       |
|                                                                                                                                                                                               |
| **Tipo de Componente UI:** Single-Select Radio Button \|                                                                                                                                      |
|                                                                                                                                                                                               |
| **Texto de Ayuda / Tooltip:** *\"Defina la frontera geográfica hacia donde orienta sus esfuerzos comerciales.\"*                                                                              |
|                                                                                                                                                                                               |
| **Opciones de Respuesta y Parámetros:**                                                                                                                                                       |
|                                                                                                                                                                                               |
| > **•** \[LOC\] Mercado Local, Regional o Nacional: La facturación se concentra en el mercado doméstico mexicano.                                                                             |
| >                                                                                                                                                                                             |
| > **•** \[EXP\] Mercado de Exportación / Cadenas Globales: Realiza exportaciones directas, opera como proveedor Tier de una empresa exportadora, o cuenta con planes de internacionalización. |
|                                                                                                                                                                                               |
| **Lógica de Salto / Visualización Condicional:** Gobierna la activación de preguntas sobre aranceles, aduanas, reglas de origen y estándares de exportación.                                  |
+===============================================================================================================================================================================================+

**MÓDULO 1: EL ROMPEHIELOS OPERATIVO (FRICCIONES INMEDIATAS DE PISO DE PLANTA)**

*Captura pragmática de restricciones de corto plazo.*

+--------------------------------------------------------------------------------------------------------------------------------------+
| **\[D1\] Durante los últimos 12 meses, ¿cuál ha sido el principal obstáculo que frenó la operación o el crecimiento de su negocio?** |
|                                                                                                                                      |
| **Tipo de Componente UI:** Single-Select Radio Button (Lista Vertical)                                                               |
|                                                                                                                                      |
| **Texto de Ayuda / Tooltip:** *\"Seleccione el factor crítico que generó mayor fricción o pérdida de oportunidades.\"*               |
|                                                                                                                                      |
| **Opciones de Respuesta y Parámetros:**                                                                                              |
|                                                                                                                                      |
| > **•** Falta de demanda, pérdida de clientes o ventas insuficientes                                                                 |
| >                                                                                                                                    |
| > **•** Falta de liquidez financiera, cobro lento a clientes (60 a 120 días) o falta de crédito                                      |
| >                                                                                                                                    |
| > **•** Escasez de técnicos u operarios calificados, o alta rotación de personal                                                     |
| >                                                                                                                                    |
| > **•** Maquinaria y equipo obsoleto, o falta de digitalización y automatización de procesos                                         |
| >                                                                                                                                    |
| > **•** Costo elevado, fallas o falta de suministro de energía eléctrica o agua                                                      |
| >                                                                                                                                    |
| > **•** Inseguridad en carreteras, robo a transporte de carga o sobrecostos de custodia logística                                    |
| >                                                                                                                                    |
| > **•** Falta de certificaciones de calidad (ISO/IATF), permisos gubernamentales o trabas de inspección                              |
| >                                                                                                                                    |
| > **•** Competencia desleal de empresas informales o productos importados de bajo costo                                              |
+======================================================================================================================================+

+--------------------------------------------------------------------------------------------------------------------------------------+
| **\[D2\] ¿A cuánto asciende aproximadamente el costo adicional o pérdida de ingresos que este obstáculo le causó en el último año?** |
|                                                                                                                                      |
| **Tipo de Componente UI:** Single-Select Radio Button (Escala Porcentual)                                                            |
|                                                                                                                                      |
| **Texto de Ayuda / Tooltip:** *\"Estime el impacto financiero directo e indirecto como proporción de su facturación anual.\"*        |
|                                                                                                                                      |
| **Opciones de Respuesta y Parámetros:**                                                                                              |
|                                                                                                                                      |
| > **•** Menos del 1% de las ventas anuales (Fricción baja / Controlada)                                                              |
| >                                                                                                                                    |
| > **•** Entre 1% y 3% de las ventas anuales (Fricción moderada)                                                                      |
| >                                                                                                                                    |
| > **•** Entre 3% y 5% de las ventas anuales (Impacto notable en utilidades)                                                          |
| >                                                                                                                                    |
| > **•** Más del 5% de las ventas anuales (Impacto crítico que amenaza la continuidad)                                                |
| >                                                                                                                                    |
| > **•** Existe una pérdida clara, pero no la tenemos cuantificada contablemente                                                      |
+======================================================================================================================================+

+--------------------------------------------------------------------------------------------------------------------+
| **\[D3\] ¿En qué plazo necesita resolver esta problemática para evitar un daño severo a su viabilidad comercial?** |
|                                                                                                                    |
| **Tipo de Componente UI:** Single-Select Radio Button (Ventana Temporal)                                           |
|                                                                                                                    |
| **Texto de Ayuda / Tooltip:** *\"Define la urgencia de intervención que debe reflejarse en la hoja de ruta.\"*     |
|                                                                                                                    |
| **Opciones de Respuesta y Parámetros:**                                                                            |
|                                                                                                                    |
| > **•** Urgencia Inmediata: En menos de 3 meses (Riesgo inminente de paro o pérdida de clientes)                   |
| >                                                                                                                  |
| > **•** Corto Plazo: Entre 3 y 12 meses (Requiere solución en este ejercicio fiscal)                               |
| >                                                                                                                  |
| > **•** Mediano Plazo: Entre 1 y 2 años (Afecta el crecimiento futuro, pero permite operar)                        |
| >                                                                                                                  |
| > **•** Problema Crónico: Sin plazo definido / Nos hemos adaptado a operar con él                                  |
+====================================================================================================================+

+------------------------------------------------------------------------------------------------------------------------------------------------------+
| **\[D4\] ¿Cuál ha sido la situación de sus proyectos de inversión (ampliación de planta, compra de maquinaria o software) en los últimos 24 meses?** |
|                                                                                                                                                      |
| **Tipo de Componente UI:** Single-Select Radio Button                                                                                                |
|                                                                                                                                                      |
| **Texto de Ayuda / Tooltip:** *\"Mide el grado de dinamismo o parálisis de capital fijo en su empresa.\"*                                            |
|                                                                                                                                                      |
| **Opciones de Respuesta y Parámetros:**                                                                                                              |
|                                                                                                                                                      |
| > **•** Se ejecutaron conforme a lo planeado y están operando                                                                                        |
| >                                                                                                                                                    |
| > **•** Se ejecutaron, pero a una escala o presupuesto menor al programado                                                                           |
| >                                                                                                                                                    |
| > **•** Están temporalmente detenidos o en pausa por incertidumbre de mercado o falta de liquidez                                                    |
| >                                                                                                                                                    |
| > **•** Fueron cancelados definitivamente                                                                                                            |
| >                                                                                                                                                    |
| > **•** No se contempló ningún proyecto de inversión en este periodo                                                                                 |
+======================================================================================================================================================+

+-----------------------------------------------------------------------------------------------------------------------+
| **\[D5\] ¿Qué condición concreta activaría de forma inmediata su siguiente decisión de inversión?**                   |
|                                                                                                                       |
| **Tipo de Componente UI:** Single-Select Radio Button                                                                 |
|                                                                                                                       |
| **Texto de Ayuda / Tooltip:** *\"Identifica la palanca prioritaria de política pública o financiamiento requerida.\"* |
|                                                                                                                       |
| **Opciones de Respuesta y Parámetros:**                                                                               |
|                                                                                                                       |
| > **•** Un contrato marco garantizado o una orden de compra en firme de un cliente consolidado                        |
| >                                                                                                                     |
| > **•** Acceso a un crédito bancario accesible o factoraje ágil sin requisitos excesivos de garantías                 |
| >                                                                                                                     |
| > **•** Obtener una certificación técnica o acreditación de calidad indispensable para cotizar                        |
| >                                                                                                                     |
| > **•** Garantías de seguridad física en traslados y certidumbre en tarifas de energía                                |
| >                                                                                                                     |
| > **•** Simplificación y rapidez en la obtención de permisos y trámites regulatorios                                  |
+=======================================================================================================================+

**MODULO 2: EL ENTORNO NORMATIVO E INSTITUCIONAL COMO FACILITADOR ECONÓMICO**

*Auditoría del suelo institucional fundamentada en los 5 Pilares del Estado de Derecho*

**Instrucción para la Interfaz Web:** Este bloque se presenta como una **Matriz de Escala Likert de 7 Puntos** (donde 1 = Totalmente en Desacuerdo / Obstáculo Severo, 4 = Neutral, y 7 = Totalmente de Acuerdo / Facilitador Excelente).

+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| **\[EN1 a EN6\] Matriz de Evaluación del Estado de Derecho y Certeza Jurídica Regional**                                                                                                                    |
|                                                                                                                                                                                                             |
| **Tipo de Componente UI:** Likert Grid Matrix (7 Puntos con Radio Buttons)                                                                                                                                  |
|                                                                                                                                                                                                             |
| **Texto de Ayuda / Tooltip:** *\"Indique su grado de acuerdo con cada una de las siguientes afirmaciones respecto a la región donde opera.\"*                                                               |
|                                                                                                                                                                                                             |
| **Opciones de Respuesta y Parámetros:**                                                                                                                                                                     |
|                                                                                                                                                                                                             |
| > **•** \[EN1 - Previsibilidad\] Las normas fiscales, ambientales, laborales y de zonificación en mi entidad son claras, estables y permiten planear inversiones a largo plazo sin sorpresas intempestivas. |
| >                                                                                                                                                                                                           |
| > **•** \[EN2 - Protección Contractual\] El marco legal y los juzgados locales son imparciales, confiables y rápidos para hacer cumplir contratos comerciales o resolver disputas mercantiles.              |
| >                                                                                                                                                                                                           |
| > **•** \[EN3 - Costo de Seguridad\] Los costos en materia de seguridad (guardias, cámaras, GPS, seguros de transporte) no representan un sobrecosto excesivo que reduzca nuestras utilidades.              |
| >                                                                                                                                                                                                           |
| > **•** \[EN4 - Restricción del Poder\] Mi empresa opera con libertad e imparcialidad, sin verse expuesta a inspecciones discrecionales, clausuras arbitrarias o solicitudes de pagos informales.           |
| >                                                                                                                                                                                                           |
| > **•** \[EN5 - Mejora Regulatoria\] Los trámites estatales y municipales (licencias, vistos buenos, ventanillas) están digitalizados y se resuelven con agilidad sin entorpecer el negocio.                |
| >                                                                                                                                                                                                           |
| > **•** \[EN6 - Certeza de Retención\] El clima institucional de mi estado incentiva activamente a mi empresa a seguir reinvirtiendo utilidades aquí en lugar de mudarse a otra entidad o país.             |
+=============================================================================================================================================================================================================+

**MÓDULO 3: DIAGNÓSTICO DEL ECOSISTEMA REGIONAL DE INNOVACIÓN (NIVEL MESO-MACRO)**

*Evaluación de la interacción con universidades, centros de I+D y clústeres (Modelo OMPI / Aghion)*

+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| **\[ECO1 a ECO6\] Matriz de Interacción con el Ecosistema Regional (Inputs vs. Outputs de Innovación)**                                                                                                                        |
|                                                                                                                                                                                                                                |
| **Tipo de Componente UI:** Likert Grid Matrix (7 Puntos: 1 = Nula o Inexistente a 7 = Excelente y Continua)                                                                                                                    |
|                                                                                                                                                                                                                                |
| **Texto de Ayuda / Tooltip:** *\"Evalúe el grado de vinculación y aprovechamiento de los recursos científicos y tecnológicos de su entorno.\"*                                                                                 |
|                                                                                                                                                                                                                                |
| **Opciones de Respuesta y Parámetros:**                                                                                                                                                                                        |
|                                                                                                                                                                                                                                |
| > **•** \[ECO1 - Talento STEM / Dual\] Las universidades y escuelas técnicas locales preparan personal calificado en las áreas técnicas que mi empresa necesita y facilitan esquemas de educación dual o estadías en planta.   |
| >                                                                                                                                                                                                                              |
| > **•** \[ECO2 - Infraestructura de Ensayo\] En mi región existen laboratorios de prueba, centros de metrología o plantas piloto accesibles para realizar pruebas de calidad y certificación de productos.                     |
| >                                                                                                                                                                                                                              |
| > **•** \[ECO3 - Financiamiento a Innovación\] Existen fondos públicos o privados, subsidios o estímulos fiscales claros y disponibles en el estado para apoyar la modernización tecnológica o compra de equipo especializado. |
| >                                                                                                                                                                                                                              |
| > **•** \[ECO4 - Dinámica de Clúster\] Las cámaras industriales o clústeres de mi sector generan oportunidades reales de negocio, compras consolidadas y transferencia tecnológica entre empresas asociadas.                   |
| >                                                                                                                                                                                                                              |
| > **•** \[ECO5 - Proyectos de Co-Diseño\] En los últimos 2 años, mi empresa ha desarrollado proyectos tecnológicos conjuntos con universidades o centros de investigación que mejoraron nuestros procesos o productos.         |
| >                                                                                                                                                                                                                              |
| > **•** \[ECO6 - Articulación con Startups\] Mi empresa tiene la capacidad o interés de colaborar, contratar o comprar componentes desarrollados por emprendedores o pequeñas empresas de base tecnológica local.              |
+================================================================================================================================================================================================================================+

**MÓDULO 4: CAPACIDADES INTERNAS, TRACCIÓN Y ABSORCIÓN TECNOLÓGICA (NIVEL MICRO)**

*Auditoría del embudo comercial, cumplimiento normativo y madurez operativa (Porter / Aghion)*

+-------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| **\[R01\] ¿Cuál es la principal barrera técnica u operativa que frena el cierre de nuevas ventas?**                                                               |
|                                                                                                                                                                   |
| **Tipo de Componente UI:** Single-Select Radio Button (Adaptativo según F0.1 / F0.2) \|                                                                           |
|                                                                                                                                                                   |
| **Texto de Ayuda / Tooltip:** *\"Identifique la restricción interna más frecuente cuando intenta concretar una orden de compra.\"*                                |
|                                                                                                                                                                   |
| **Opciones de Respuesta y Parámetros:**                                                                                                                           |
|                                                                                                                                                                   |
| > **•** Para \[MAN\]: Incapacidad de cumplir con tolerancias de precisión técnica, pruebas de laboratorio o falta de capacidad de planta instalada.               |
| >                                                                                                                                                                 |
| > **•** Para \[SER\]: Falta de acreditaciones corporativas de seguridad informática (ISO 27001), experiencia previa demostrable o tiempos excesivos de respuesta. |
| >                                                                                                                                                                 |
| > **•** Para \[B2B\]: Requisitos burocráticos y costos elevados de los portales de homologación de proveedores de grandes corporativos.                           |
| >                                                                                                                                                                 |
| > **•** Para \[B2C\]: Costo publicitario excesivo para adquirir clientes (CAC) o saturación en los canales de venta tradicionales.                                |
+===================================================================================================================================================================+

+--------------------------------------------------------------------------------------------------------------------------------------------------+
| **\[R02\] ¿Qué porcentaje de cotizaciones u oportunidades de venta pierde al año por no contar con certificaciones o no poder surtir a tiempo?** |
|                                                                                                                                                  |
| **Tipo de Componente UI:** Single-Select Radio Button (Escala Porcentual)                                                                        |
|                                                                                                                                                  |
| **Texto de Ayuda / Tooltip:** *\"Estime el volumen de negocio que queda sobre la mesa por fricciones de calidad o escala.\"*                     |
|                                                                                                                                                  |
| **Opciones de Respuesta y Parámetros:**                                                                                                          |
|                                                                                                                                                  |
| > **•** Menos del 5% de las cotizaciones (Nivel de fricción bajo)                                                                                |
| >                                                                                                                                                |
| > **•** Entre 6% y 15% de las cotizaciones (Pérdida moderada de contratos)                                                                       |
| >                                                                                                                                                |
| > **•** Entre 16% y 30% de las cotizaciones (Fricción severa que frena el crecimiento)                                                           |
| >                                                                                                                                                |
| > **•** Más del 30% de las cotizaciones (Pérdida crítica; estamos fuera del radar de clientes grandes)                                           |
+==================================================================================================================================================+

+----------------------------------------------------------------------------------------------------------------------------------------------------+
| **\[R03\] ¿Cuánto tiempo transcurre en promedio desde que contacta a un cliente calificado hasta que recibe la primera orden de compra en firme?** |
|                                                                                                                                                    |
| **Tipo de Componente UI:** Single-Select Radio Button (Ciclo de Venta)                                                                             |
|                                                                                                                                                    |
| **Texto de Ayuda / Tooltip:** *\"Mide la velocidad de conversión y el requerimiento de capital de trabajo asociado.\"*                             |
|                                                                                                                                                    |
| **Opciones de Respuesta y Parámetros:**                                                                                                            |
|                                                                                                                                                    |
| > **•** Venta Rápida: Menos de 1 mes (Transacciones cotidianas o de mostrador)                                                                     |
| >                                                                                                                                                  |
| > **•** Venta Intermedia: De 1 a 3 meses (Requiere muestras o validaciones sencillas)                                                              |
| >                                                                                                                                                  |
| > **•** Venta Consultiva / Industrial: De 4 a 6 meses (Auditorías técnicas y cotizaciones formales)                                                |
| >                                                                                                                                                  |
| > **•** Venta de Alta Complejidad: Más de 6 meses (Homologaciones corporativas o licitaciones)                                                     |
+====================================================================================================================================================+

+----------------------------------------------------------------------------------------------------------+
| **\[R04\] ¿Qué porcentaje de sus ventas anuales totales depende de sus tres principales clientes?**      |
|                                                                                                          |
| **Tipo de Componente UI:** Single-Select Radio Button (Concentración - Poder del Comprador Porter)       |
|                                                                                                          |
| **Texto de Ayuda / Tooltip:** *\"Mide su nivel de vulnerabilidad ante la pérdida de una cuenta clave.\"* |
|                                                                                                          |
| **Opciones de Respuesta y Parámetros:**                                                                  |
|                                                                                                          |
| > **•** Menos del 25% (Cartera altamente diversificada y protegida)                                      |
| >                                                                                                        |
| > **•** Entre 26% y 50% (Riesgo moderado de concentración)                                               |
| >                                                                                                        |
| > **•** Entre 51% y 75% (Alta dependencia; vulnerables a condiciones impuestas por el cliente)           |
| >                                                                                                        |
| > **•** Más del 75% (Riesgo crítico de captura; un solo cliente determina la vida del negocio)           |
+==========================================================================================================+

+-------------------------------------------------------------------------------------------------------------------------------------------------------------+
| **\[R05\] ¿Cuál es la base sobre la que compite habitualmente en su mercado?**                                                                              |
|                                                                                                                                                             |
| **Tipo de Componente UI:** Single-Select Radio Button (Rivalidad Porter)                                                                                    |
|                                                                                                                                                             |
| **Texto de Ayuda / Tooltip:** *\"Define si su estrategia se orienta a costos o a exclusividad y calidad.\"*                                                 |
|                                                                                                                                                             |
| **Opciones de Respuesta y Parámetros:**                                                                                                                     |
|                                                                                                                                                             |
| > **•** Guerra de Precios: Competimos ofreciendo el precio más bajo, con márgenes muy reducidos y alta presión de competidores informales o asiáticos.      |
| >                                                                                                                                                           |
| > **•** Diferenciación y Calidad: Competimos por certificaciones formales, diseño especializado, confiabilidad de entrega y tolerancias de calidad técnica. |
+=============================================================================================================================================================+

+------------------------------------------------------------------------------------------------------------------------------+
| **\[R06\] ¿En qué nivel domina las normas técnicas y estándares internacionales requeridos en su mercado objetivo?**         |
|                                                                                                                              |
| **Tipo de Componente UI:** Single-Select Radio Button (Pasaporte Normativo)                                                  |
|                                                                                                                              |
| **Texto de Ayuda / Tooltip:** *\"Refleja el conocimiento de normas ISO, IATF, FDA, CE o criterios de sustentabilidad ESG.\"* |
|                                                                                                                              |
| **Opciones de Respuesta y Parámetros:**                                                                                      |
|                                                                                                                              |
| > **•** Desconocimiento total: Desconocemos qué normas específicas nos exigirían en mercados avanzados.                      |
| >                                                                                                                            |
| > **•** Conocimiento reactivo: Investigamos las normas únicamente cuando un cliente nos condiciona una orden de compra.      |
| >                                                                                                                            |
| > **•** Dominio proactivo: Conocemos el mapa normativo de nuestro sector y realizamos auditorías internas continuas.         |
+==============================================================================================================================+

+--------------------------------------------------------------------------------------------------------------------------+
| **\[R07\] ¿Cuál es el estatus actual de sus acreditaciones o certificaciones de calidad de tercera parte?**              |
|                                                                                                                          |
| **Tipo de Componente UI:** Single-Select Radio Button                                                                    |
|                                                                                                                          |
| **Texto de Ayuda / Tooltip:** *\"Estatus de sellos formales otorgados por casas certificadoras acreditadas.\"*           |
|                                                                                                                          |
| **Opciones de Respuesta y Parámetros:**                                                                                  |
|                                                                                                                          |
| > **•** Certificaciones Vigentes: Contamos con certificados internacionales vigentes y auditados periódicamente.         |
| >                                                                                                                        |
| > **•** En Proceso Avanzado: Estamos en proceso formal de certificación con un avance superior al 50%.                   |
| >                                                                                                                        |
| > **•** Calidad Empírica: Trabajamos con altos estándares y buenas prácticas, pero no tenemos certificaciones oficiales. |
| >                                                                                                                        |
| > **•** Sin Certificación: No contamos con certificaciones ni tenemos capacidad financiera actual para costearlas.       |
+==========================================================================================================================+

+-------------------------------------------------------------------------------------------------------------------------------------------+
| **\[R08\] ¿Qué nivel de trazabilidad tiene sobre el origen de sus insumos y componentes?**                                                |
|                                                                                                                                           |
| **Tipo de Componente UI:** Single-Select Radio Button (Reglas de Origen)                                                                  |
|                                                                                                                                           |
| **Texto de Ayuda / Tooltip:** *\"Capacidad de documentar de dónde provienen sus materias primas ante auditorías de clientes o T-MEC.\"*   |
|                                                                                                                                           |
| **Opciones de Respuesta y Parámetros:**                                                                                                   |
|                                                                                                                                           |
| > **•** Trazabilidad Automatizada: Sistema digital (ERP / código de barras) que rastrea lotes, origen y certificados en tiempo real.      |
| >                                                                                                                                         |
| > **•** Trazabilidad Documental / Manual: Conservamos facturas y certificados en papel o carpetas, pero toma días compilar una auditoría. |
| >                                                                                                                                         |
| > **•** Trazabilidad Débil o Nula: Compramos a distribuidores intermedios que no nos entregan certificados de calidad o de origen.        |
+===========================================================================================================================================+

+----------------------------------------------------------------------------------------------------------------------------------------------------+
| **\[R09\] ¿Qué tan vulnerable es su negocio ante la dependencia de materias primas o componentes importados?**                                     |
|                                                                                                                                                    |
| **Tipo de Componente UI:** Single-Select Radio Button \|                                                                                           |
|                                                                                                                                                    |
| **Texto de Ayuda / Tooltip:** *\"Mide el riesgo ante retrasos aduanales, volatilidad cambiaria o aranceles.\"*                                     |
|                                                                                                                                                    |
| **Opciones de Respuesta y Parámetros:**                                                                                                            |
|                                                                                                                                                    |
| > **•** Sin Vulnerabilidad: La totalidad de nuestros insumos se consiguen localmente con proveedores diversificados.                               |
| >                                                                                                                                                  |
| > **•** Vulnerabilidad Moderada: Dependemos de 1 o 2 insumos importados, pero existen sustitutos en el mercado nacional.                           |
| >                                                                                                                                                  |
| > **•** Vulnerabilidad Crítica: Dependemos totalmente de piezas o insumos importados que, si se encarecen o frenan en aduana, detienen la empresa. |
+====================================================================================================================================================+

+------------------------------------------------------------------------------------------------------------------------------+
| **\[R10\] Si recibiera un apoyo técnico especializado en cumplimiento normativo, ¿dónde generaría mayor impacto inmediato?** |
|                                                                                                                              |
| **Tipo de Componente UI:** Single-Select Radio Button (Prioridad de Intervención)                                            |
|                                                                                                                              |
| **Texto de Ayuda / Tooltip:** *\"Orienta la asignación de consultoría técnica de política pública.\"*                        |
|                                                                                                                              |
| **Opciones de Respuesta y Parámetros:**                                                                                      |
|                                                                                                                              |
| > **•** Pruebas de laboratorio acreditadas y ensayos destructivos/no destructivos para validar producto                      |
| >                                                                                                                            |
| > **•** Consultoría técnica especializada en planta para solventar no-conformidades y preparación de auditorías              |
| >                                                                                                                            |
| > **•** Gestión y pago de registros de marca, patentes o códigos de barras en mercados destino                               |
| >                                                                                                                            |
| > **•** Capacitación de auditores internos en normas de sustentabilidad, huella de carbono y criterios ESG                   |
+==============================================================================================================================+

+-------------------------------------------------------------------------------------------------------------------------------------------+
| **\[R11\] Si un cliente de primer orden le ofreciera duplicar su volumen de pedidos en un plazo de 90 días, ¿cómo respondería?**          |
|                                                                                                                                           |
| **Tipo de Componente UI:** Single-Select Radio Button (Escalabilidad)                                                                     |
|                                                                                                                                           |
| **Texto de Ayuda / Tooltip:** *\"Mide la elasticidad de su capacidad instalada y herramental.\"*                                          |
|                                                                                                                                           |
| **Opciones de Respuesta y Parámetros:**                                                                                                   |
|                                                                                                                                           |
| > **•** Aceptación Inmediata: Tenemos capacidad ociosa en planta y turnos disponibles para responder sin problemas.                       |
| >                                                                                                                                         |
| > **•** Aceptación con Ajustes: Podríamos responder subcontratando procesos secundarios o pagando horas extra.                            |
| >                                                                                                                                         |
| > **•** Rechazo Obligado: Tendríamos que rechazar el contrato porque nuestra capacidad está al 100% y no podemos ampliarla a corto plazo. |
+===========================================================================================================================================+

+----------------------------------------------------------------------------------------------------------------------------------------------+
| **\[R12\] ¿Cuál es el nivel de digitalización e integración tecnológica en la gestión de su negocio?**                                       |
|                                                                                                                                              |
| **Tipo de Componente UI:** Single-Select Radio Button (Madurez Digital) \|                                                                   |
|                                                                                                                                              |
| **Texto de Ayuda / Tooltip:** *\"Mide el grado de adopción de software industrial y financiero en el núcleo del negocio.\"*                  |
|                                                                                                                                              |
| **Opciones de Respuesta y Parámetros:**                                                                                                      |
|                                                                                                                                              |
| > **•** Sistemas Integrados en la Nube: Operamos con ERP/CRM en la nube, portales EDI con clientes y pagos digitales automatizados vía SPEI. |
| >                                                                                                                                            |
| > **•** Digitalización en Silos: Usamos software comercial o contable, pero no está conectado con piso de producción ni con clientes.        |
| >                                                                                                                                            |
| > **•** Operación Básica / Manual: La mayor parte del control de inventarios, pedidos y finanzas se lleva en hojas de cálculo o papel.       |
+==============================================================================================================================================+

+-------------------------------------------------------------------------------------------------------------------------------------------------+
| **\[R13\] ¿En qué perfil de talento humano enfrenta la empresa la mayor escasez para mantener su operación y calidad?**                         |
|                                                                                                                                                 |
| **Tipo de Componente UI:** Single-Select Radio Button (Brecha de Capital Humano)                                                                |
|                                                                                                                                                 |
| **Texto de Ayuda / Tooltip:** *\"Identifica el cuello de botella en competencias laborales.\"*                                                  |
|                                                                                                                                                 |
| **Opciones de Respuesta y Parámetros:**                                                                                                         |
|                                                                                                                                                 |
| > **•** Sin problema: Encontramos suficiente personal calificado y con baja rotación en nuestra zona.                                           |
| >                                                                                                                                               |
| > **•** Operadores Técnicos y Maquinistas: Escasez de torneros, soldadores, costureros o técnicos en inyección/mantenimiento.                   |
| >                                                                                                                                               |
| > **•** Especialistas en Automatización y Datos: Escasez de programadores CNC, ingenieros de automatización, mecatrónicos o analistas de datos. |
| >                                                                                                                                               |
| > **•** Ventas Técnicas y Comercio Exterior: Escasez de ejecutivos bilingües de ventas B2B que conozcan especificaciones y trámites aduanales.  |
+=================================================================================================================================================+

+-------------------------------------------------------------------------------------------------------------------------------+
| **\[R14\] ¿Cuál es la principal barrera financiera que le impide tomar contratos de mayor envergadura?**                      |
|                                                                                                                               |
| **Tipo de Componente UI:** Single-Select Radio Button (Restricción Financiera)                                                |
|                                                                                                                               |
| **Texto de Ayuda / Tooltip:** *\"Mide el acceso a crédito productivo y capital de trabajo.\"*                                 |
|                                                                                                                               |
| **Opciones de Respuesta y Parámetros:**                                                                                       |
|                                                                                                                               |
| > **•** Ninguna: Contamos con flujos propios suficientes o líneas de crédito bancarias activas.                               |
| >                                                                                                                             |
| > **•** Falta de Factoraje: No tenemos cómo financiar los 60 a 120 días que tardan los clientes corporativos en pagarnos.     |
| >                                                                                                                             |
| > **•** Falta de Garantías Colaterales: La banca nos pide hipotecas o garantías inmobiliarias que no podemos cubrir.          |
| >                                                                                                                             |
| > **•** Tasas de Interés Elevadas: El costo del dinero en el sistema bancario comercial hace inviable endeudarse para equipo. |
+===============================================================================================================================+

+-------------------------------------------------------------------------------------------------------------------------+
| **\[R15\] ¿Qué proyecto puntual generaría el mayor salto de productividad en su empresa durante los próximos 6 meses?** |
|                                                                                                                         |
| **Tipo de Componente UI:** Single-Select Radio Button                                                                   |
|                                                                                                                         |
| **Texto de Ayuda / Tooltip:** *\"Permite definir el plan de acción rápido de acompañamiento industrial.\"*              |
|                                                                                                                         |
| **Opciones de Respuesta y Parámetros:**                                                                                 |
|                                                                                                                         |
| > **•** Implementar un software ERP/CRM modular para ordenar inventarios y pedidos                                      |
| >                                                                                                                       |
| > **•** Reorganizar las líneas de producción bajo metodología Lean Manufacturing para eliminar desperdicios             |
| >                                                                                                                       |
| > **•** Cerrar la auditoría para conseguir la certificación técnica indispensable para cotizar                          |
| >                                                                                                                       |
| > **•** Participar en un encuentro de negocios estructurado con compradores ancla de grandes corporativos               |
+=========================================================================================================================+

**MÓDULO 5: MODELOS COLABORATIVOS Y PULVERIZACIÓN DE INVERSIONES (BIENES DE CLUB)**

*Mecanismos asociativos para abatir costos de capital mediante infraestructura compartida*

**Instrucción para la Interfaz Web:** Matriz de Escala Likert de 7 Puntos (1 = Rechazo Total / Desconfianza Absoluta a 7 = Totalmente Dispuesto / Prioridad Estratégica).

+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| **\[COL1 a COL5\] Matriz de Disposición a la Pulverización de Inversiones y Asociatividad Empresarial**                                                                                                                                                                     |
|                                                                                                                                                                                                                                                                             |
| **Tipo de Componente UI:** Likert Grid Matrix (7 Puntos con Radio Buttons) \|                                                                                                                                                                                               |
|                                                                                                                                                                                                                                                                             |
| **Texto de Ayuda / Tooltip:** *\"Evalúe su nivel de interés en participar en esquemas asociativos con otras empresas de su sector.\"*                                                                                                                                       |
|                                                                                                                                                                                                                                                                             |
| **Opciones de Respuesta y Parámetros:**                                                                                                                                                                                                                                     |
|                                                                                                                                                                                                                                                                             |
| > **•** \[COL1 - Compras y Fletes Consolidados\] Estaría dispuesto a integrarse a un comité de compras conjuntas con otras empresas para adquirir materias primas a precio de mayoreo y consolidar contenedores de flete para abaratar transporte.                          |
| >                                                                                                                                                                                                                                                                           |
| > **•** \[COL2 - Co-financiamiento de Infraestructura Club\] Estaría dispuesto a aportar una cuota de inversión compartida con otras empresas para equipar un laboratorio de pruebas, centro de maquinado o sala limpia que de forma individual no puede pagar.             |
| >                                                                                                                                                                                                                                                                           |
| > **•** \[COL3 - Esquema de Pago por Uso (Pay-per-Use)\] Considera viable sustituir la compra de maquinaria costosa o licencias de software industrial por un esquema de arrendamiento o pago por hora de uso en una instalación comunitaria administrada profesionalmente. |
| >                                                                                                                                                                                                                                                                           |
| > **•** \[COL4 - Consorcio de Comercialización Colectiva\] Estaría dispuesto a sumar la capacidad de producción / servicio de su empresa dentro de una marca o consorcio común para poder cotizar y ganar contratos masivos que solo no puede surtir por volumen.           |
| >                                                                                                                                                                                                                                                                           |
| > **•** \[COL5 - Gobernanza Fiduciaria Neutral\] Aceptaría operar estos esquemas bajo un contrato de fideicomiso independiente y neutral (con mediación técnica de universidades o clústeres), que garantice transparencia y proteja sus secretos industriales.             |
+=============================================================================================================================================================================================================================================================================+

**MÓDULO 6: ESTRATEGIAS DE EXPANSIÓN, ESCALAMIENTO Y ESPACIO DE PRODUCTOS**

*Ruta hacia la reconversión de productos adyacentes y diversificación de mercados (CIDE / Harvard)*

**Instrucción para la Interfaz Web:** Matriz de Escala Likert de 7 Puntos (1 = Sin Capacidad / Totalmente Descartado a 7 = Totalmente Preparado / Estrategia Diseñada).

+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| **\[EXP1 a EXP4\] Matriz de Visión Prospectiva y Salto en Complejidad Económica**                                                                                                                                                                                                            |
|                                                                                                                                                                                                                                                                                              |
| **Tipo de Componente UI:** Likert Grid Matrix (7 Puntos con Radio Buttons) \|                                                                                                                                                                                                                |
|                                                                                                                                                                                                                                                                                              |
| **Texto de Ayuda / Tooltip:** *\"Evalúe la preparación de su empresa para evolucionar hacia productos de mayor valor agregado.\"*                                                                                                                                                            |
|                                                                                                                                                                                                                                                                                              |
| **Opciones de Respuesta y Parámetros:**                                                                                                                                                                                                                                                      |
|                                                                                                                                                                                                                                                                                              |
| > **•** \[EXP1 - Fruta Madura / Adyacencias Técnicas\] Mi empresa tiene identificados qué productos más complejos y rentables podría empezar a fabricar en menos de 12 meses utilizando su maquinaria y personal actuales con ajustes mínimos.                                               |
| >                                                                                                                                                                                                                                                                                            |
| > **•** \[EXP2 - Apuesta de Gran Calado (Alto ICPO)\] Si la región contara con financiamiento y laboratorios especializados, mi empresa tendría la capacidad de reconvertirse hacia industrias de alta tecnología (ej. partes de vehículos eléctricos, equipo médico o empaque sustentable). |
| >                                                                                                                                                                                                                                                                                            |
| > **•** \[EXP3 - Diversificación Internacional\] Mi empresa tiene una estrategia clara para reducir la dependencia de compradores locales y comenzar a vender directamente en nuevos mercados internacionales o canales e-commerce transfronterizos.                                         |
| >                                                                                                                                                                                                                                                                                            |
| > **•** \[EXP4 - Gobierno Corporativo e Inversión\] Mi empresa cuenta con estados financieros auditados, contabilidad transparente y gobierno corporativo listos para recibir inversión de fondos de capital privado o coinversionistas extranjeros.                                         |
+==============================================================================================================================================================================================================================================================================================+

**ESPECIFICACIÓN DEL MOTOR DE PROCESAMIENTO Y DASHBOARD DE RESULTADOS**

*Lógica matemática para la normalización de variables, análisis de brecha (IB) y visualización gráfica*

Una vez enviado el formulario web, el backend calcula automáticamente los siguientes **seis índices maestros normalizados en escala de 0 a 100**:

  ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Índice Maestro**                       **Reactivos de Origen**              **Fórmula de Normalización y Significado**
  ---------------------------------------- ------------------------------------ ------------------------------------------------------------------------------------------------------------------------------------------------------------
  **SEN: Score de Entorno Normativo**      EN1 a EN6 (Etapa 2)                  Promedio aritmético de los 6 reactivos (escala 1 a 7) convertido a base 100: \[(Promedio - 1) / 6\] \* 100. Mide certidumbre jurídica y Estado de Derecho.

  **SEI: Score de Ecosistema Innovador**   ECO1 a ECO6 (Etapa 3)                Promedio de Inputs (ECO1-4) y Outputs (ECO5-6) en base 100. Mide vinculación con universidades y eficiencia de transferencia tecnológica.

  **ITC: Índice de Tracción Comercial**    R01 a R05 (Etapa 4 - B1)             Suma ponderada de velocidad de cierre, diversificación de clientes y blindaje ante las 5 Fuerzas de Porter.

  **IMN: Índice de Madurez Normativa**     R06 a R10 (Etapa 4 - B2)             Ponderación de acreditaciones vigentes, trazabilidad de insumos y dominio de normas técnicas internacionales (Pasaporte Normativo).

  **ICA: Capacidad de Absorción**          R11 a R15 (Etapa 4 - B3)             Evaluación de la distancia a la frontera tecnológica (Aghion): digitalización ERP, escala de planta y capital humano técnico.

  **IPC: Potencial Colaborativo**          COL1 a 5 + EXP1 a 4 (Etapas 5 y 6)   Promedio de apertura a compras consolidadas, bienes de club y visión de salto en el espacio de productos.
  ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**Cálculo del Índice de Brecha de Percepción (IB) y Semáforo de Riesgo:**

> **IB = Score Percepción Empresarial (SEN + SEI) - Score Objetivo Estadístico (IMCO / IMD Regional)**
>
> **• IB \< -10 (Alerta Roja / Fricción Institucional):** El empresariado percibe un entorno delictivo o regulatorio significativamente más hostil que lo registrado en las estadísticas oficiales. Se requiere enfocar los apoyos en seguridad logística y simplificación administrativa.
>
> **• -10 \<= IB \<= +10 (Semáforo Verde / Alineación Estratégica):** Existe coherencia entre la percepción del sector productivo y la realidad estadística regional. Ecosistema listo para acelerar créditos, garantías y proyectos de inversión.
>
> **• IB \> +10 (Alerta Amarilla / Falsa Complacencia):** Las empresas sobreestiman sus capacidades o asumen ser competitivas por ser proveedores cautivos de una planta ensambladora, pero carecen de patentes o certificaciones propias. Requieren auditorías técnicas de choque.

**MATRIZ PARAMÉTRICA DE ENRUTAMIENTO AUTOMATIZADO A INSTRUMENTOS DE NIVEL 2**

*Reglas condicionales del motor de decisión para canalizar a la empresa al cuestionario especializado*

De acuerdo con la selección realizada en el Reactivo \[F0.2\], la plataforma web ejecuta el salto automatizado al Instrumento Especializado de Nivel 2. La siguiente tabla consolida las reglas de asignación, el código del módulo y el enfoque de auditoría profunda asignado:

  -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Sector Elegido en \[A02\]**         **Código Nivel 2**                                                 **Área de Profundización / Audit Focus**
  ------------------------------------- ------------------------------------------------------------------ ----------------------------------------------------------------------
  01\. Automotriz y Autopartes          **instrumento-nivel-2-automotriz-puebla-tlaxcala.docx**            Carrocerías BIW, Herramentales CAx, VDA 6.3, Electrónica SDV

  02\. Agroindustria y Alimentos        **instrumento-nivel-2-agroindustria-puebla-tlaxcala.docx**         Inocuidad FSMA/GFSI, Cadena de Frío, Liofilizados, Nutracéuticos

  03\. Plásticos y Polímeros            **instrumento-nivel-2-plasticos-puebla-tlaxcala.docx**             Moldeo Científico, Resina PCR/PIR, Colada Caliente, Empaque FDA

  04\. Metalmecánica y Maquinado        **instrumento-nivel-2-metalmecanica-puebla-tlaxcala.docx**         Maquinado CNC 5 Ejes, Soldadura AWS/WPS, Ensayos CND, CMM

  05\. Textil y Confección              **instrumento-nivel-2-textil-puebla-tlaxcala.docx**                Espectrocolorimetría Delta E, OEKO-TEX, Textiles Técnicos

  06\. Muebles y Madera                 **instrumento-nivel-2-muebles-puebla-tlaxcala.docx**               Estufado 8-10%, Nesting CNC RTA, Acabados UV, Certificación FSC

  07\. Turismo y Gastronomía            **instrumento-nivel-2-turismo-puebla-tlaxcala.docx**               Distintivo H/M, Motor de Reservas Directo, Channel Manager, KM 0

  08\. Dispositivos Médicos             **instrumento-nivel-2-medico-hospitalario-puebla-tlaxcala.docx**   COFEPRIS/FDA, Cuartos Limpios ISO 14644, Biocompatibilidad ISO 10993

  09\. Construcción e Infraestructura   **instrumento-nivel-2-construccion-puebla-tlaxcala.docx**          Ensayos ONNCCE/EMA, Metodología BIM 4D/5D, Reciclaje RCD, Telemetría

  10\. Logística y Transporte           **instrumento-nivel-2-logistica-puebla-tlaxcala.docx**             Telemetría IoT, C-TPAT/OEA, WMS/TMS, Cadena de Frío, Control Tower

  11\. Artes Gráficas e Impresión       **instrumento-nivel-2-artes-graficas-puebla-tlaxcala.docx**        Estandarización G7/ISO 12647, CTP Processless, Empaque Estructural

  12\. Startups, TICs y Software        **instrumento-nivel-2-tics-startups-puebla-tlaxcala.docx**         DevSecOps, Cloud Kubernetes, ISO 27001/SOC 2, MLOps e IA
  -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
