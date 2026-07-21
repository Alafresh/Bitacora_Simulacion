# 🌊 Unidad 1: Aleatoriedad y Procesos Estocásticos

**Texto Guia:** Capítulo 0 de _[The Nature of Code](https://natureofcode.com/random/#a-custom-distribution-of-random-numbers)_  
**Herramienta de desarrollo:** p5.js / JavaScript

---

## 📌 Actividad 01: Referentes, Recursos y Reflexión

En esta primera actividad exploro los fundamentos conceptuales de la aleatoriedad como motor generativo, analizando cómo el azar controlado permite transformar algoritmos rígidos en sistemas dinámicos con variabilidad y expresividad orgánica.

### 🔗 Enlaces de Investigación (Videos y Artículos)

- 📹 [Generative Art Exploration Chapter I Tracing the Roots: The History of Generative Art](https://youtu.be/d2LC6Am9bZI?si=ZMCtqfj6d7sjawNG).
- 📹 [How To Draw With Code | Casey Reas](https://youtu.be/_8DMEHxOLQE?si=4cFWE6rLkQYnftw9)
- 📹 [Artist Spotlight | Who is Refik Anadol?](https://youtu.be/zBYVm2wYzDU?si=0Bbvi2IT_zMSjrmq)
- 📹 [Discover Generative Artist Tyler Hobbs | AOI](https://youtu.be/8tTGJvijoDw?si=SSOmFDoxDmHtEjQL)
- 📄 [Randomness in the Composition of Artwork](https://www.tylerxhobbs.com/words/randomness-in-the-composition-of-artwork)
- 📄 [Probability Distributions for Algorithmic Artists](https://www.tylerxhobbs.com/words/probability-distributions-for-algorithmic-artists)
- 📄 [A Randomized Approach to Circle Packing](https://www.tylerxhobbs.com/words/a-randomized-approach-to-circle-packing)

### 💭 Mi Reflexión: El Control Estético a través de la Aleatoriedad

Una de las bases del arte generativo es la **aleatoriedad**; es la manera en que los artistas pueden multiplicar sus posibilidades, siendo esta una parte fundamental del proceso de creación. Al definir reglas alrededor de esta aleatoriedad, podemos cambiar el comportamiento y la aparición de las imágenes que queremos mostrar. Esto nos asegura que cada vez que ejecutemos el programa, el resultado será diferente al anterior, aportando una sensación de sorpresa, frescura y organicidad.

Esta técnica es profundamente versátil y se puede aplicar a diversos atributos visuales:

- **Color:** Variación de paletas, saturación y opacidad.
- **Movimiento:** Vectores de dirección y velocidades variables.
- **Forma y Geometría:** Mutación de vértices, escalas y densidades.

Se trata de un proceso interactivo y experimental que inicia a partir de una idea abstracta, la cual exploramos, traducimos a un algoritmo y sometemos a diferentes combinaciones paramétricas. En esencia, **el arte generativo es el proceso de generar arte a través del código, donde la aleatoriedad vive en la composición y se manifiesta en los detalles**. No es un azar caótico e incontrolable: controlamos cómo se comporta la aleatoriedad a través de la **probabilidad**, logrando exactamente los efectos estéticos que deseamos comunicarle al espectador.

### 📊 Exploración de Distribuciones Probabilísticas

Para gobernar el azar en el código, es vital entender cómo se distribuyen los números aleatorios. En mi exploración identifico tres distribuciones clave para modelar comportamientos:

| Tipo de Distribución                   | Comportamiento Teórico                                                                                                                                                              | Aplicación Estética y Algorítmica                                                                                                                                                                   |
| :------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1. Distribución Uniforme**           | Tiene exactamente la misma probabilidad de elegir cualquier número dentro de un rango determinado.                                                                                  | Es la más flexible y general en los lenguajes de programación (ej. `random()`). Se distribuye de manera homogénea y plana sobre un área o intervalo, ideal para dispersión isotrópica blanca.       |
| **2. Distribución Gaussiana (Normal)** | A diferencia de la uniforme, prevalecen con altísima probabilidad los números cercanos a la media ($\mu$), disminuyendo hacia los extremos según la desviación estándar ($\sigma$). | Es extremadamente útil para aproximar valores que queremos que sean similares entre sí (como tamaños en la naturaleza o agrupación de entidades), pero conservando variaciones orgánicas realistas. |
| **3. Ley de Potencia (Pareto / Lévy)** | Parte de un valor mínimo donde se concentra la mayor probabilidad, y esta disminuye exponencialmente a medida que el número aumenta (cola pesada).                                  | Perfecta para generar fenómenos donde "lo pequeño es común y lo gigantesco es raro" (ej. Vuelos de Lévy), creando trayectorias con muchos pasos cortos locales y saltos largos sorpresivos.         |

## 📌 Actividades Siguientes (Próximamente)

- [ ] **Actividad 02:** _Implementación de Caminatas Aleatorias (Random Walks)_
- [ ] **Actividad 03:** _Exploración con Distribuciones Gaussianas y Personalizadas_
- [ ] **Actividad 04:** _Introducción al Ruido de Perlin (Perlin Noise)_
- [ ] **Actividad 05 / Reto de Diseño:** _Prototipo de Simulación Visual de la Unidad 1_
