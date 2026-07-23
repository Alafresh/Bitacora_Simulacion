let particulas = []
let sd = 50 // Desviación estándar base (Normalidad)
let levyProb = 0.01 // Probabilidad inicial de salto (Excepción)

function setup() {
  // Formato 9:16 - fullscreen interactivo
  createCanvas(1080, 1920)

  // Instanciamos 150 partículas y las guardamos en el arreglo
  for (let i = 0; i < 150; i++) {
    particulas.push(new Particula())
  }

  background(0)
}

function draw() {
  // Fondo con baja opacidad para crear el efecto de "estela" o rastro
  background(10, 20)

  // INFLUENCIA: El usuario modifica las probabilidades del sistema
  if (mouseX > 0 && mouseY > 0) {
    // Mover el mouse en Y afecta la campana de Gauss (Normalidad)
    sd = map(mouseY, 0, height, 10, 300)
    // Mover el mouse en X altera la probabilidad de que ocurra un evento raro (Excepción)
    levyProb = map(mouseX, 0, width, 0.0001, 0.05)
  }

  // Iteramos sobre el arreglo usando programación orientada a objetos
  for (let p of particulas) {
    p.update(sd, levyProb)
    p.show()
  }
}

// --- CLASE PARTICULA ---
class Particula {
  constructor() {
    this.x = random(width)
    this.y = random(height)
    // Guardamos las posiciones pasadas para trazar líneas continuas
    this.px = this.x
    this.py = this.y
  }

  update(sd, levyProb) {
    // Antes de calcular el nuevo paso, actualizamos la memoria de la posición
    this.px = this.x
    this.py = this.y

    // 1. POSIBILIDAD: Ruido base (Caminata aleatoria simple vibratoria)
    let pasoX = random(-1, 1)
    let pasoY = random(-1, 1)

    // 2. TENDENCIA: Flujo suave (Ruido Perlin) empujando hacia arriba
    let n = noise(this.x * 0.01, this.y * 0.01)
    let tendenciaX = map(n, 0, 1, -2, 3) // Favorece un poco la derecha
    let tendenciaY = -2 // Empuje constante hacia arriba

    // 3. EXCEPCIÓN: Lévy Flight
    if (random(1) < levyProb) {
      pasoX = random(-150, 150) // El salto gigante
      pasoY = random(-150, 150)
    }

    // 4. NORMALIDAD: Atracción al centro de la campana de Gauss
    let objetivoX = randomGaussian(width / 2, sd)
    let tironX = (objetivoX - this.x) * 0.05 // Interpolación para un tirón suave

    // Sumamos todas las reglas matemáticas a la posición actual
    this.x += pasoX + tendenciaX + tironX
    this.y += pasoY + tendenciaY

    // --- REGLAS DE CICLO DE VIDA (Para que el sistema sea infinito) ---
    // Si sale por arriba, la reseteamos en la parte de abajo
    if (this.y < 0) {
      this.y = height
      this.py = height // Previene que se dibuje una raya cruzando toda la pantalla
      this.x = random(width)
      this.px = this.x
    }
    // Si sale por los lados, aparece por el lado contrario (efecto Pac-Man)
    if (this.x < 0) {
      this.x = width
      this.px = width
    } else if (this.x > width) {
      this.x = 0
      this.px = 0
    }
  }

  show() {
    stroke(255, 250, 110)
    strokeWeight(1)
    // Dibujamos una línea conectando el frame anterior con el actual
    // Esto es vital para que el salto de Lévy deje una marca visual visible
    line(this.px, this.py, this.x, this.y)
  }
}
