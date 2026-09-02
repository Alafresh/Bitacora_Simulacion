# 🌊 Unidad 3: Osciliación

**Texto Guia:** Capítulo 3 - Oscillation [The Nature of Code](https://natureofcode.com/oscillation/)
**Herramienta de desarrollo:** three.js / JavaScript

El proposito de esta es estudiar comportamientos periódicos y oscilatoriosortes. La unidad busca ampliar la comprensión del movimiento más allá del desplazamiento lineal y usarlo con fines expresivos.

## 📌 Actividad 01: Referentes

- 📹[¿Quien es Memo Akten?](https://memo.tv/)
- 📹[Simple Harmonic Motion](https://memo.tv/projects/2019/shm/)
- 📹[El Sorprendente Secreto de la Sincronización](https://youtu.be/BH85KeKpNQQ?si=h6HIY39J0m5mwDe7)
- 📹[Fireflies](https://ncase.me/fireflies/)
- 📹[Incredibox](https://www.incredibox.com/)
- 📹[Kuramoto Dreams](https://cgli.itch.io/kuramoto-dreams)

## 📌 Actividad 02: Encargo de diseño

¿Cómo convertir un modelo de autoorganización en un instrumento audiovisual performativo?

¿Qué hace Kuramoto en esta experiencia que no podría resolverse simplemente mediante un reloj global, un secuenciador o temporizadores independientes?

En este espacio aproveche para explorar la plantilla, e inspirarme con la cancion que estaba escuchando

![Gif_reto_Diseno](./gifs/Video_galaxia.gif)

- 📄[Caso de estudio](https://github.com/juanferfranco/forces-instrument-u3)

## 📌 Actividad 03: Encargo de Diseño

Interpretaremos esta pieza musical

- 📹[LesAlpx](https://music.youtube.com/watch?v=iuTk8x410mk&si=5uIiZlxhe_l92Fny)

Esta cancion me saca de mi mundo y me transporta a otro universo me da vibras de futurismo y progreso, El concepto que decidi tomar partes del synthwave y agregarlos a mi visualizador, las particulas les agregue una textura de estrella y las organice en forma de galaxia tambien añadi una mujer bailando la cual esta farmeando aura y tiene toques de holograma mientras giran alrededor una nave espacial

![Imagen](./gifs/Holograma.png)

## 📌 Actividad 04: Presentacion

[Despliegue Visualizador de fuerzas](https://bitacora-simulacion.vercel.app/)

| Criterio                                      | Peso        | Qué debe demostrar la evidencia                                                                                                                                                                                                                                                                    | Valoración | Evidencia concreta                                                                                                                                                                                                                                   |
| --------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Trazabilidad y comprensión del sistema**    | 25          | Puedo señalar y explicar estado, fuerzas, integración, render y controles; además puedo ubicar qué partes produjo o modificó la IA.                                                                                                                                                                | **22/25**  | Explicación detallada del funcionamiento de los compute shaders en WebGPU, los buffers de almacenamiento para las 131,072 partículas, la estructura modular de la simulación y la sincronización de las posiciones de las naves hacia la GPU.        |
| **Verificación del algoritmo de fuerzas**     | 25          | Estudié en detalle el proyecto y aunque no comprenda toda la sintaxis, puedo identificar su arquitectura, sus partes, puedo aislar una fuerza central, formular una predicción, la ejecuté ya analicé, comparé el resultado, cambié deliberadamente un signo o parámetro y expliqué la diferencia. | **22/25**  | Análisis y ajuste de las fuerzas de vórtice, viento, atracción/repulsión y la inversión oscilante aplicada en la influencia de las naves, verificando empíricamente su comportamiento en el enjambre.                                                |
| **Diseño de fuerzas e intención**             | 20          | Las fuerzas y sus parámetros hacen perceptible una intención; el comportamiento surge de la dinámica y no de trayectorias previamente dibujadas.                                                                                                                                                   | **17/20**  | Diseño de las órbitas dinámicas de las cuatro naves usando funciones trigonométricas combinadas, la interacción de campo local sobre las partículas y la onda de choque radial activada por clic.                                                    |
| **Instrumento, score e interpretación**       | 15          | El score conecta la escucha con decisiones; escogí pocos controles expresivos y puedo conducir el sistema en vivo sin que el audio lo controle automáticamente.                                                                                                                                    | **13/15**  | Uso del panel de control con estética Synthwave personalizado para modificar en tiempo real los parámetros físicos, la velocidad y los comportamientos del sistema de manera manual.                                                                 |
| **Experimentación y criterio frente a la IA** | 10          | Comparé alternativas, registré hallazgos y descartes, corregí propuestas de IA y puedo justificar por qué conservé la versión presentada.                                                                                                                                                          | **8/10**   | Iteraciones conjuntas sobre la integración de texturas PNG con alpha map, ajuste del grosor vertical de la galaxia mediante el parámetro scatterY, corrección de errores de sintaxis en TSL y optimización de escala y materiales de los modelos 3D. |
| **Entrega técnica y documentación**           | 5           | la URL pública abre; la bitácora permite verificar el proceso.                                                                                                                                                                                                                                     | **4/5**    | Estructuración limpia del proyecto bajo WebGPU, corrección de errores de bucle y correcta integración de iluminación, niebla volumétrica y rejilla de neón.                                                                                          |
| **Total**                                     | **100/100** |                                                                                                                                                                                                                                                                                                    | **4.3**    |                                                                                                                                                                                                                                                      |
