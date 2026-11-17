# Cambios de instrumentos: v6 a v8

Comparación de `docs/metodologia/v2/_antes/` contra `docs/metodologia/v2/`. El v6 reconvertido es el mismo texto que `_antes` (solo ruido de pandoc). Lo que sigue es v6 contra v8, más los archivos nuevos.

## Resumen

El Nivel 1 conserva los mismos 22 reactivos y los mismos cortes de score (75 / 55 / 35), pero reescribe el perfilado para que sirva también a servicios médicos, hospitalidad y zona urbana, no solo a planta industrial. El selector de sector no crece: sigue diciendo 16 sectores y lista las opciones 01 a 16. Los 16 instrumentos de Nivel 2 que ya existían no cambian de enunciado ni de opciones. Entran en archivo el sector 17 (química) y el sector 18 (TICs), más el manual de reportes y la guía de ejemplos. Química y TICs no están en la lista del selector, y el manual sigue hablando de 16 instrumentos de Nivel 2.

En el v8 el id va solo en negrita (`**[MOD0-WEB-01]**`) y el título corto del v6 ya no viaja junto al id. Abajo se empareja por id. Solo se listan enunciados y etiquetas de opción que cambiaron.

## Nivel 1

Base: `_antes/instrumento-diagnostico-regional-web-v6.md`. Nuevo: `instrumento-diagnostico-regional-web-v8.md`.

Sin cambio de enunciado ni de opciones: **MOD0-WEB-01** (sigue «16 sectores» y las opciones 01 a 16, de Automotriz a Artes Gráficas) y **MOD0-WEB-02** (estrato INEGI, cuatro rangos iguales).

El marco pasa de «perfilado analítico» (manufactura vs. servicios, B2B/B2C/B2G/D2C, 16 instrumentos) a «puerto de entrada único» con estructura Borda 8-6-6, apta para manufactura, servicios médicos, hospitalarios, agroindustria y hospitalidad. La sección IV se titula ahora «Estructura completa 8-6-6». La sección V se titula «Brecha de percepción y enrutamiento dinámico».

### MOD0-WEB-03

- v6: ¿En qué municipio o parque/nodo industrial-agrícola se ubica la principal instalación operativa o centro de comando de su empresa en Puebla o Tlaxcala?
- v8: ¿En qué municipio o parque/nodo industrial-agrícola-urbano se ubica la principal instalación operativa o centro de comando de su empresa en Puebla o Tlaxcala?

Opciones: sin cambio (seis nodos).

### MOD0-WEB-04

Enunciado sin cambio. Pasa de 5 a 6 opciones. Se inserta salud como opción propia y «salud privada» sale de hospitalidad.

- v6 opción 2: Servicios Especializados a las Empresas / Industria: Consultoría técnica, mantenimiento industrial, ingeniería, software, metrología o soluciones B2B.
- v8 opción 2 (nueva): Servicios Médicos, Hospitalarios y Laboratorios de Diagnóstico: Atención clínica, hospitalización, análisis clínicos y atención sanitaria especializada.
- v8 opción 3 (la anterior 2, retocada): Servicios Especializados a las Empresas / Industria: Consultoría técnica, mantenimiento especializado, ingeniería, software, metrología o soluciones B2B.
- Comercio y producción primaria se recorren una posición, con el mismo texto.
- v6 opción 5: Servicios Directos al Consumidor / Hospitalidad: Restauración, hotelería, salud privada, turismo, educación o entretenimiento.
- v8 opción 6: Servicios Directos al Consumidor y Hospitalidad: Restauración, hotelería, turismo, educación o entretenimiento.

La tarjeta pasa de «Perfilado Analítico» a «Perfilado Analítico Multi-Sectorial».

### MOD0-WEB-05

Enunciado sin cambio. Seis opciones; la 5 (D2C) no cambia.

- v6: B2B Directo (Business-to-Business): Venta directa a otras empresas, fabricantes Tier 1/2, cadenas de retail o clientes corporativos.
- v8: B2B Directo (Business-to-Business): Venta directa a otras empresas, fabricantes Tier 1/2, cadenas corporativas o clientes empresariales.
- v6: B2B2C / Subcontratación en Cadena de Valor: Fabricación de componentes o maquila que se integra en el producto final de un tercero hacia el consumidor.
- v8: B2B2C / Subcontratación e Integración en Cadena de Valor: Suministro de componentes, maquila o servicios que se integran en la oferta final de un tercero hacia el usuario final.
- v6: B2C Directo al Consumidor (Business-to-Consumer): Venta directa al cliente o usuario final mediante puntos de venta o canales tradicionales.
- v8: B2C Directo al Consumidor / Paciente (Business-to-Consumer/Patient): Venta directa al cliente, usuario o paciente final mediante instalaciones o canales propios.
- v6: B2G / Compras Públicas (Business-to-Government): Suministro de bienes o servicios a dependencias gubernamentales e infraestructura pública.
- v8: B2G / Compras Públicas (Business-to-Government): Suministro de bienes, servicios médicos o infraestructura a dependencias gubernamentales e instituciones públicas.
- v6: Modelo Mixto Equilibrado: Facturación distribuida de forma similar entre clientes corporativos (B2B) y consumidor final (B2C).
- v8: Modelo Mixto Equilibrado: Facturación distribuida de forma similar entre clientes corporativos (B2B) y consumidor/paciente final (B2C).

### MOD0-WEB-06

- v6: ¿A través de qué canal transaccional recibe su empresa la mayor proporción de sus ingresos y órdenes de pedido?
- v8: ¿A través de qué canal transaccional recibe su empresa la mayor proporción de sus ingresos y órdenes de pedido o atención?

Opciones:

- v6: Fuerza de Ventas Directa / Ejecutivos de Cuenta: Negociación cara a cara, contratos plurianuales y órdenes de compra corporativas.
- v8: Fuerza de Ventas Directa / Ejecutivos de Cuenta Corporativos: Negociación cara a cara, contratos plurianuales y órdenes de compra corporativas.
- v6: Punto de Venta Físico / Sucursales / Mostrador: Atención presencial en instalaciones comerciales o salas de exhibición propias.
- v8: Punto de Venta Físico / Instalación Médica / Sucursales / Mostrador: Atención presencial en centros clínicos, locales comerciales o instalaciones propias.
- v6: Portal Digital Propio / E-commerce / Web-App B2B-B2C: Plataforma web de transacciones automatizadas integrada al ERP/sistema de cobro.
- v8: Portal Digital Propio / E-commerce / Web-App / Citas en Línea: Plataforma web transaccional automatizada integrada al ERP o sistema de facturación/cobro.
- v6: Marketplaces / OTAs / Intermediarios Digitales: Comercialización en plataformas de terceros (Amazon, MercadoLibre, Booking, UberEats).
- v8: Marketplaces / OTAs / Intermediarios Digitales: Comercialización en plataformas de terceros (Amazon, MercadoLibre, Booking, UberEats, aseguradoras).
- v6: Red de Distribuidores / Intermediarios Comerciales / Licitaciones: Venta a través de mayoristas, comisionistas o ganancia de licitaciones.
- v8: Red de Distribuidores / Intermediarios Comerciales / Licitaciones: Venta a través de mayoristas, comisionistas o asignación de licitaciones públicas/privadas.

### MOD0-WEB-07

- v6: ¿Cuál es el alcance geográfico y nivel de integración a cadenas de valor que caracteriza las ventas de su empresa?
- v8: ¿Cuál es el alcance geográfico y nivel de integración a cadenas de valor que caracteriza las ventas o servicios de su empresa?

Opciones 1 y 2 sin cambio. El resto:

- v6: Mercado Nacional: Distribución consolidada a nivel república mexicana.
- v8: Mercado Nacional: Distribución o prestación de servicios consolidada a nivel república mexicana.
- v6: Exportador Indirecto (Proveedor T-MEC): Insumos o piezas integradas en productos finales que se exportan a EE.UU., Canadá u otros mercados.
- v8: Exportador Indirecto (Proveedor T-MEC): Insumos, piezas o servicios integrados en productos finales o cadenas que exportan a EE.UU., Canadá u otros mercados.
- v6: Exportador Directo: Envíos directos al extranjero con pedimento de exportación propio (T-MEC, Europa, Latinoamérica, Asia).
- v8: Exportador Directo / Atención a Clientes Internacionales: Envíos directos al extranjero con pedimento propio (T-MEC, Europa, LatAm) o atención a turismo internacional.

### ED-01 / Pilar 1

- v6: ¿En qué medida el marco normativo, trámites estatales/municipales e inspecciones regulatorias en su municipio/estado son claros, estables y predecibles?
- v8: ¿En qué medida el marco normativo, trámites estatales/municipales, licencias operativas y verificaciones regulatorias en su zona son claros, estables y predecibles?
- v6 opción 2: 2 Points (40 pts): Impredecible / Tramitología lenta, discrecionalidad en licencias y poca claridad en cobros u homologaciones.
- v8 opción 2: 2 Points (40 pts): Impredecible / Tramitología lenta, discrecionalidad en licencias/permisos y poca claridad en cobros u homologaciones.

Opciones 1, 3, 4 y 5 sin cambio.

### ED-02 / Pilar 2

- v6: ¿Cómo evalúa el nivel de seguridad pública en las vías de transporte (autopista 150D, Arco Norte) y la protección contra el delito (robo de carga, extorsión, cobro de piso) en su zona?
- v8: ¿Cómo evalúa el nivel de seguridad pública en las vías de transporte (autopista 150D, Arco Norte) y la protección contra el delito (robo de carga/mercancías/equipos, extorsión) en su zona?
- v6 opción 2: 2 Points (40 pts): Inseguro / Alta percepción de riesgo en carreteras clave (150D/Arco Norte); requerimos custodia privada obligatoria.
- v8 opción 2: 2 Points (40 pts): Inseguro / Alta percepción de riesgo en carreteras clave (150D/Arco Norte); requerimos custodia o monitoreo privado obligatorio.
- v6 opción 3: 3 Points (60 pts): Moderado / Incidentes ocasionales en el sector; se invierte en GPS y monitoreo sin afectar severamente la rentabilidad.
- v8 opción 3: 3 Points (60 pts): Moderado / Incidentes ocasionales en el sector; se invierte en GPS y seguridad sin afectar severamente la rentabilidad.

Opciones 1, 4 y 5 sin cambio.

### ED-03 / Pilar 3

Enunciado sin cambio.

- v6 opción 1: 1 Point (20 pts): Totalmente Arbitrario / Inspecciones usadas como mecanismo de extorsión o clausura sin sustento técnico.
- v8 opción 1: 1 Point (20 pts): Totalmente Arbitrario / Inspecciones usadas como mecanismo de extorsión o suspensión sin sustento técnico.

Opciones 2 a 5 sin cambio.

### ED-04 / Pilar 4

- v6: ¿Cuál es el nivel de calidad y confiabilidad en la infraestructura básica de su parque/nodo (electricidad sin micro-cortes, agua industrial, gas natural, fibra óptica, caminos)?
- v8: ¿Cuál es el nivel de calidad y confiabilidad en la infraestructura básica de su parque, nodo o zona urbana (electricidad sin micro-cortes, agua de calidad/proceso, gas, fibra óptica, caminos)?
- v6 opción 1: 1 Point (20 pts): Deficiencia Crítica / Apagones frecuentes, escasez severa de agua y caminos destruidos paralizan la producción.
- v8 opción 1: 1 Point (20 pts): Deficiencia Crítica / Apagones frecuentes, escasez severa de agua y caminos destruidos paralizan las operaciones.
- v6 opción 2: 2 Points (40 pts): Deficiente / Micro-cortes eléctricos constantes dañan equipos y se carece de gasoducto o fibra óptica adecuada.
- v8 opción 2: 2 Points (40 pts): Deficiente / Micro-cortes eléctricos constantes dañan equipos e infraestructura; se carece de gasoducto o conectividad adecuada.
- v6 opción 4: 4 Points (80 pts): Bueno / Infraestructura industrial estable, buen ancho de banda y servicios continuos.
- v8 opción 4: 4 Points (80 pts): Bueno / Infraestructura de soporte estable, buen ancho de banda y servicios públicos continuos.
- v6 opción 5: 5 Points (100 pts): Excelencia / Parque industrial de clase mundial con energía limpia, redundancia hídrica y conectividad 5G.
- v8 opción 5: 5 Points (100 pts): Excelencia / Zona/Parque con energía limpia, redundancia hídrica, fibra óptica 5G y vías de comunicación de primer nivel.

Opción 3 sin cambio.

### ED-05 / Pilar 5

- v6: ¿Qué tan rápido y equitativo es el sistema de justicia mercantil y conciliación laboral en su entidad cuando se requiere resolver un litigio o arbitraje?
- v8: ¿Qué tan rápido y equitativo es el sistema de justicia mercantil y conciliación laboral en su entidad cuando se requiere resolver un litigio, cobro de facturas o arbitraje?
- v6 opción 1: 1 Point (20 pts): Ineficiente y Lento / Juicios tardan años, impunidad en juicios mercantiles y chantaje en litigios laborales.
- v8 opción 1: 1 Point (20 pts): Ineficiente y Lento / Juicios tardan años, impunidad en cobranza mercantil y chantaje en litigios laborales.
- v6 opción 2: 2 Points (40 pts): Ineficiente / Procesos costosos, lentitud en juzgados y dificultad para ejecutar garantías o cobranza judicial.
- v8 opción 2: 2 Points (40 pts): Ineficiente / Procesos costosos, lentitud en juzgados y dificultad para ejecutar garantías o contratos de servicios.

Opciones 3, 4 y 5 sin cambio.

### INO-01

- v6: ¿Qué porcentaje aproximado de los ingresos de la empresa se destina anualmente a Investigación, Desarrollo e Innovación (I+D+i) o capacitación avanzada?
- v8: ¿Qué porcentaje aproximado de los ingresos de la empresa se destina anualmente a Investigación, Desarrollo e Innovación (I+D+i), actualización de equipamiento o capacitación técnica?
- v6 opción 1: Sin Inversión (0%): No se asignan recursos a I+D ni a capacitación tecnológica especializada.
- v8 opción 1: Sin Inversión (0%): No se asignan recursos a I+D, innovación ni a capacitación técnica especializada.
- v6 opción 3: Inversión Moderada (1% a 3%): Presupuesto asignado a mejora de procesos, rediseño de productos o capacitación técnica regular.
- v8 opción 3: Inversión Moderada (1% a 3%): Presupuesto asignado a mejora de procesos, rediseño de servicios/productos o capacitación técnica regular.
- v6 opción 4: Inversión Avanzada (> 3%): Departamento de I+D formal, desarrollo de prototipos, coinversión con universidades o laboratorios.
- v8 opción 4: Inversión Avanzada (> 3%): Departamento/Equipo de I+D formal, desarrollo de prototipos, coinversión con universidades o laboratorios.

Opción 2 sin cambio.

### INO-02

Enunciado sin cambio.

- v6 opción 1: Cero / Sin Innovación: La oferta de productos/servicios se ha mantenido idéntica en los últimos 3 años.
- v8 opción 1: Cero / Sin Innovación: La oferta de productos/servicios o procedimientos se ha mantenido idéntica en los últimos 3 años.
- v6 opción 2: Innovación Incremental Menor (1 a 2): Mejoras cosméticas o adaptaciones menores a solicitud directa de clientes.
- v8 opción 2: Innovación Incremental Menor (1 a 2): Mejoras de adaptación o ajustes menores a solicitud directa de clientes/pacientes.
- v6 opción 3: Innovación Significativa (3 a 5): Nuevas líneas de producto o procesos digitalizados con secreto industrial o registro de marca.
- v8 opción 3: Innovación Significativa (3 a 5): Nuevas líneas de producto/servicio o procesos digitalizados con secreto industrial, marca o protocolo propio.

Opción 4, mismo texto: Innovación Disruptiva (> 5 o Patentes): Múltiples lanzamientos exitosos, marcas registradas, modelos de utilidad o patentes vigentes.

### INO-03

- v6: ¿Cuál es la tasa de éxito y retorno económico estimado de los proyectos tecnológicos implementados y su vinculación con centros de investigación/universidades?
- v8: ¿Cuál es la tasa de éxito y retorno económico estimado de las tecnologías implementadas y su grado de vinculación con centros de investigación/universidades?
- v6 opción 1: Sin Vinculación / Proyectos Frustrados: No se colabora con universidades y las inversiones en software/tecnología no han retornado valor.
- v8 opción 1: Sin Vinculación / Proyectos Frustrados: No se colabora con universidades y las inversiones en tecnología no han retornado valor.
- v6 opción 3: Vinculación Activa / Retorno Positivo: Convenios de pruebas de laboratorio; las mejoras tecnológicas recuperan su costo en 12 a 24 meses.
- v8 opción 3: Vinculación Activa / Retorno Positivo: Convenios de pruebas de laboratorio/evaluación; las mejoras tecnológicas recuperan su costo en 12 a 24 meses.

Opciones 2 y 4 sin cambio.

### INO-04

Enunciado sin cambio. Opción 1 sin cambio.

- v6 opción 2: Adopción Intermedia / Software Aislado: ERP/sistema de facturación básico instalado localmente; contabilidad digital pero sin comunicación con piso/operaciones.
- v8 opción 2: Adopción Intermedia / Software Aislado: ERP/sistema de facturación básico local; contabilidad digital pero sin comunicación con áreas operativas/clínicas.
- v6 opción 3: Adopción Avanzada / ERP Nube + CRM: Gestión integrada en tiempo real de finanzas, inventarios y ventas en la nube con respaldos automatizados.
- v8 opción 3: Adopción Avanzada / ERP Nube + CRM: Gestión integrada en tiempo real de finanzas, inventarios, operaciones y ventas/citas en la nube con respaldos automatizados.
- v6 opción 4: Adopción 4.0 / Cloud + IoT + IA: Plataforma integral en nube, captura de datos por sensores/QR, ciberseguridad avanzada e IA generativa/predictiva.
- v8 opción 4: Adopción 4.0 / Cloud + IoT + IA: Plataforma integral en nube, captura automatizada por sensores/QR, ciberseguridad avanzada e IA generativa/predictiva.

### COM-01

- v6: ¿Qué nivel de sofisticación y exigencia técnica caracteriza a sus principales clientes y contratos comerciales?
- v8: ¿Qué nivel de sofisticación y exigencia técnica o regulatoria caracteriza a sus principales clientes, pacientes o contratos comerciales?

Opción 1 sin cambio.

- v6 opción 2: Mercado Regional Estándar: Cumplimiento de normas comerciales básicas (facturación, crédito a 30 días) sin auditorías de proceso.
- v8 opción 2: Mercado Regional Estándar: Cumplimiento de normas comerciales o sanitarias básicas (facturación, permisos locales) sin auditorías externas.
- v6 opción 3: Cadenas Nacionales / Retail Organizado: Auditorías de calidad, códigos de barras GS1, entregas puntuales y capacidad de respuesta.
- v8 opción 3: Cadenas Nacionales / Retail Organizado / Instituciones: Auditorías formales de calidad, códigos GS1, entregas puntuales y capacidad de respuesta.
- v6 opción 4: Cadenas Globales de Valor (Tier 1/OEM / Exportación Directa): Auditorías internacionales (IATF, ISO, GlobalGAP, GFSI), entregas Just-in-Time y T-MEC.
- v8 opción 4: Cadenas Globales de Valor / Certificación de Excelencia (Tier 1/OEM / COFEPRIS / Joint Commission / T-MEC): Auditorías internacionales estrictas.

### COM-02

Enunciado sin cambio. Opción 1 sin cambio.

- v6 opción 2: Ubicuidad Media: Producto con diferenciación leve en empaque, marca o servicio pero replicable en el mediano plazo.
- v8 opción 2: Ubicuidad Media: Producto o servicio con diferenciación leve en empaque, marca o atención pero replicable en el mediano plazo.
- v6 opción 3: Baja Ubicuidad / Especializado: Producto/servicio con especificaciones técnicas complejas que muy pocos competidores regionales pueden fabricar.
- v8 opción 3: Baja Ubicuidad / Especializado: Oferta con especificaciones técnicas o clínicas complejas que muy pocos competidores regionales pueden brindar.
- v6 opción 4: Alta Exclusividad / Escasez Global: Producto/servicio protegido por tecnología propia, certificaciones raras o procesos micronicos/complejos.
- v8 opción 4: Alta Exclusividad / Escasez Global: Producto/servicio protegido por tecnología propia, certificaciones raras o procesos científicos/complejos.

### COM-03

- v6: ¿Con qué facilidad podría su empresa adaptar su maquinaria, talento y procesos para ofrecer un nuevo producto de mayor valor en menos de 12 meses?
- v8: ¿Con qué facilidad podría su empresa adaptar su tecnología, equipamiento, instalaciones y talento para ofrecer un nuevo producto o servicio de mayor valor en menos de 12 meses?
- v6 opción 1: Dificultad Severa: La maquinaria y procesos actuales son hiper-específicos o obsoletos; cambiar requiere inversión masiva de CAPEX.
- v8 opción 1: Dificultad Severa: Los equipos e instalaciones actuales son rígidos u obsoletos; cambiar requiere inversión masiva de CAPEX.
- v6 opción 2: Dificultad Moderada: Es posible reconvertir pero requiere adquirir herramentales costosos y reentrenar a todo el personal.
- v8 opción 2: Dificultad Moderada: Es posible reconvertir pero requiere adquirir equipamiento costoso y reentrenar a todo el personal.
- v6 opción 4: Reconversión Continua: Empresa ágil con equipos CNC/digitales versátiles capaz de cambiar de producto en semanas según demanda.
- v8 opción 4: Reconversión Continua: Empresa ágil con equipos e infraestructura versátil capaz de cambiar de oferta en semanas según la demanda.

Opción 3 (Alta Factibilidad / Fruta Madura) sin cambio.

### R00-REG-PROD

La tarjeta pasa de «Rompehielos de Jerarquización (1 al 8)» a «Rompehielos de Jerarquización - Top 3 (1 al 8)». El enunciado sigue pidiendo ordenar del 1 al 8.

- v6: Ordene del 1 al 8 las siguientes fricciones del entorno exógeno según el impacto económico negativo que provocan en su empresa (1 = Mayor impacto; 8 = Menor impacto):
- v8: Ordene del 1 al 8 las siguientes fricciones del entorno exógeno según el impacto económico negativo que provocan en la operación o servicio de su empresa (1 = Mayor impacto; 8 = Menor impacto):

Opciones 2 y 4 sin cambio. El resto:

- v6: Inseguridad pública en autopistas (150D, Arco Norte) y robo de mercancías/insumos.
- v8: Inseguridad pública en autopistas (150D, Arco Norte) y robo de mercancías, insumos o equipamiento.
- v6: Tramitología lenta, burocracia y cobros excesivos en licencias municipales/estatales.
- v8: Tramitología lenta, burocracia y cobros excesivos en licencias/permisos municipales o estatales.
- v6: Falta de disponibilidad y altos costos de suministro de agua industrial o tratamiento.
- v8: Falta de disponibilidad y altos costos de suministro de agua (industrial, potable o de proceso).
- v6: Sobrecostos en fletes logísticos y falta de infraestructura de transporte consolidado.
- v8: Sobrecostos en fletes logísticos y falta de infraestructura de transporte o accesibilidad.
- v6: Dificultad para acceder a financiamiento competitivo y crédito para adquisición de maquinaria.
- v8: Dificultad para acceder a financiamiento competitivo y crédito para adquirir equipamiento o tecnología.
- v6: Competencia desleal de empresas informales o importaciones con subvaluación.
- v8: Competencia desleal de establecimientos informales o importaciones subvaluadas.

### R00-REG-SOURCING-MAT

La tarjeta pasa a «Rompehielos de Jerarquización - Top 3 (1 al 6)». El enunciado sigue pidiendo ordenar del 1 al 6.

- v6: Ordene del 1 al 6 los cuellos de botella que mayor volatilidad causan en su abastecimiento de insumos (1 = Mayor impacto negativo; 6 = Menor impacto):
- v8: Ordene del 1 al 6 los cuellos de botella que mayor volatilidad o riesgo causan en su abastecimiento de insumos, materiales y suministros generales (1 = Mayor impacto negativo; 6 = Menor impacto):

Opción 6 sin cambio (pagos de contado o plazos de crédito reducidos).

- v6: Volatilidad de precios en materias primas básicas (acero, granos, plásticos, resinas, papel).
- v8: Volatilidad de precios en insumos, materias primas o materiales básicos de operación.
- v6: Tiempos de entrega excesivos (Lead Times) en insumos o refacciones importadas.
- v8: Tiempos de entrega excesivos (Lead Times) en insumos, piezas o refacciones importadas.
- v6: Escasez de proveedores locales certificados que cumplan especificaciones técnicas.
- v8: Escasez de proveedores locales certificados que cumplan especificaciones técnicas o sanitarias.
- v6: Sobrecosto en materiales de empaque, embalaje, tarimas o contenedores.
- v8: Sobrecosto en materiales de empaque, embalaje, contenedores o recipientes de traslado.
- v6: Restricciones o incrementos en costos de combustibles (diésel, gas natural, LP).
- v8: Restricciones o incrementos en costos de combustibles (diésel, gas natural, LP, energía).

### R00-REG-SOURCING-SERV

La tarjeta pasa a «Rompehielos de Jerarquización - Top 3 (1 al 6)». El enunciado sigue pidiendo ordenar del 1 al 6. Las seis opciones se sustituyen.

- v6: Ordene del 1 al 6 las mayores deficiencias en servicios de soporte que limitan su competitividad (1 = Mayor impacto negativo; 6 = Menor impacto):
- v8: Ordene del 1 al 6 las principales deficiencias o barreras que enfrenta su empresa en la contratación de servicios de apoyo al negocio y servicios especializados (1 = Mayor impacto negativo; 6 = Menor impacto):
- v6: Escasez de laboratorios locales acreditados ISO 17025 para pruebas, metrología o análisis.
- v8: Escasez o alto costo de laboratorios acreditados de ensayo, metrología, calibración o análisis clínicos/técnicos (ISO 17025 / COFEPRIS / EMA).
- v6: Carencia de centros de capacitación técnica especializada en tecnologías 4.0 o certificaciones.
- v8: Deficiencia o falta de consultoría local especializada en certificaciones internacionales de calidad, inocuidad o gestión (IATF, ISO, GlobalGAP, BRCGS).
- v6: Licencias de software especializado (ERP, CAD/CAM, WMS) costosas o inalcanzables.
- v8: Respuesta lenta o alto costo en servicios de mantenimiento preventivo y correctivo especializado para tecnología, equipos e infraestructura clave.
- v6: Falta de parques industriales con mantenimiento adecuado, seguridad e infraestructura moderna.
- v8: Retardos y complejidad burocrática en gestiones de impacto ambiental, licencias sanitarias o dictámenes de protección civil.
- v6: Lenta respuesta de consultores o gestores regulatorios en normas COFEPRIS, STPS o SEMARNAT.
- v8: Deficiencia en servicios especializados de ciberseguridad, gestión de datos en nube y conectividad de banda ancha de alta velocidad.
- v6: Falta de opciones de transporte público eficiente para el traslado de los trabajadores al centro de trabajo.
- v8: Sobrecostos y oferta limitada de servicios de capacitación técnica avanzada para la recalificación y desarrollo de talento (Upskilling / Reskilling).

### Tablero y acta

Los cortes no cambian: Platino >= 75, Oro 55 a 74.9, Plata 35 a 54.9, Bronce < 35. Cambia el texto de las capas. El v6 describía la condición de la empresa y una hoja de ruta (Capa A digital + Capa B políticas). El v8 parte el tablero en «Capa A: Transformación interna (bajo CAPEX)» y «Capa B: Bienes de club / políticas públicas»:

- Platino. Capa A: optimización 4.0, IA predictiva, ciberseguridad y exportación. Capa B: consorcios de I+D, hubs tecnológicos y atracción de proveedores Tier 1.
- Oro. Capa A: ERP en nube, calidad y Web-to-Business o citas digitales. Capa B: laboratorios ISO 17025 y capacitación especializada.
- Plata. Capa A: digitalización de registros, inventarios/costos y mantenimiento preventivo. Capa B: compras consolidadas y trámites municipales.
- Bronce. Capa A: formalización, contabilidad digital básica y capacitación. Capa B: trámites, licencias, formalización y crédito.

El acta sigue diciendo «Sector Seleccionado (MOD0-WEB-01): [ Sector 01 al 16 ]». La naturaleza pasa de `MANUFACTURA | SERVICIOS | COMERCIO | PRIMARIO` a `MANUFACTURA | SERVICIOS MÉDICOS | SERVICIOS B2B | AGRO | COMERCIO | HOSPITALIDAD`. El modelo pasa a `B2B | B2B2C | B2C/PACIENTE | B2G | D2C | MIXTO` y se agrega el campo «Fricciones Borda Top 1» (Operación, Insumos, Servicios).

## Nivel 2

Dieciséis archivos presentes en `_antes` y en la carpeta nueva. Tras quitar barras invertidas finales, ancho de tabla y líneas en blanco, el texto es el mismo. Sin cambio de enunciado ni de opción.

- `instrumento-nivel-2-agencias-viajes-operadores-puebla-tlax.md`: sin cambio
- `instrumento-nivel-2-agricola-pecuaria-puebla-tlaxcala-v5.md`: sin cambio
- `instrumento-nivel-2-alimentos-procesados-puebla-tlaxcala-v.md`: sin cambio
- `instrumento-nivel-2-artes-graficas-puebla-tlaxcala-v5.md`: sin cambio
- `instrumento-nivel-2-automotriz-puebla-tlaxcala-v5.md`: sin cambio
- `instrumento-nivel-2-confeccion-maquila-puebla-tlaxcala-v5.md`: sin cambio
- `instrumento-nivel-2-construccion-puebla-tlaxcala-v5.md`: sin cambio
- `instrumento-nivel-2-dispositivos-medicos-puebla-tlaxcala-v.md`: sin cambio
- `instrumento-nivel-2-gastronomia-catering-puebla-tlaxcala-v.md`: sin cambio
- `instrumento-nivel-2-logistica-puebla-tlaxcala-v5.md`: sin cambio
- `instrumento-nivel-2-medico-hospitalario-puebla-tlaxcala-v5.md`: sin cambio
- `instrumento-nivel-2-metalmecanica-estructuras-puebla-tlaxc.md`: sin cambio
- `instrumento-nivel-2-muebles-puebla-tlaxcala-v5.md`: sin cambio
- `instrumento-nivel-2-plasticos-puebla-tlaxcala-v5.md`: sin cambio
- `instrumento-nivel-2-textiles-hilados-puebla-tlaxcala-v5.md`: sin cambio
- `instrumento-nivel-2-turismo-puebla-tlaxcala-v5.md`: sin cambio

## Altas

- `Manual_Metodologia_Reportes_v10.md`. El archivo se llama v10; el título interno dice «v4.0». Es el manual de interpretación y de generación automática de reportes. Describe el Nivel 1 Web v8.0 y sigue asignando **1 de 16** instrumentos de Nivel 2, para una cohorte de 100 a 120 empresas en 16 sectores.
- `Ejemplos.md`. Guía de prueba del sistema v10.0 con cuatro casos: sector 01 automotriz, 04 plásticos, 12 servicios médicos y 15 logística. No incluye química ni TICs.
- `instrumento-nivel-2-quimica-petroquimica-puebla-tlaxcala-v.md`. Título del documento: **SECTOR 17 Industria Química, Petroquímica y Resinas Sintéticas**. Reactivos con prefijo QM (perfil QM-01 a QM-03, Borda R00-QM-*, TECH, CP-QM, COL-QM).
- `instrumento-nivel-2-tics-software-puebla-tlaxcala-v5.md`. Título del documento: **SECTOR 18 Tecnologías de la Información, Software y Servicios Digitales**. Reactivos con prefijo TC (perfil TC-01 a TC-03, Borda R00-TC-*, TECH, CP-TC, COL-TC).

El selector de `instrumento-diagnostico-regional-web-v8.md` (MOD0-WEB-01) sigue diciendo 16 sectores y lista las opciones 01 a 16. Química y TICs no están en esa lista. El acta del mismo instrumento también deja el sector en «01 al 16».
