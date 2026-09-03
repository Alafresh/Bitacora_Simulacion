class Agent {
  constructor(x, y, omegaBase, spriteSheet, sound) {
    this.x = x
    this.y = y
    this.theta = random(TWO_PI) // Fase inicial aleatoria
    this.omegaBase = omegaBase // Frecuencia natural base
    this.omega = omegaBase // Frecuencia actual (modificable)

    // Assets y estado de animación
    this.spriteSheet = spriteSheet
    this.sound = sound
    this.isAnimating = false
    this.currentFrame = 0
    this.totalFrames = 16 // 4x4 grid
    this.cols = 4
    this.rows = 4
    this.frameDuration = 40 // Milisegundos por frame
    this.lastFrameTime = 0
  }

  update(dt) {
    // Evolución de la fase (Aquí sumarás la interacción de Kuramoto después)
    this.theta += this.omega * dt

    // Disparador al completar ciclo (θi >= 2π)
    if (this.theta >= TWO_PI) {
      this.theta %= TWO_PI // Mantener dentro del rango [0, 2π]
      this.triggerEvent()
    }
  }

  triggerEvent() {
    this.isAnimating = true
    this.currentFrame = 0
    this.lastFrameTime = millis()
    if (this.sound && this.sound.isLoaded()) {
      this.sound.play()
    }
  }

  draw() {
    // Dibujar el estado pasivo del nodo (fase visual)
    push()
    translate(this.x, this.y)
    noFill()
    stroke(100)
    strokeWeight(2)
    circle(0, 0, 50) // Círculo base

    // Indicador de fase actual
    stroke(255)
    let phaseRadius = 25
    line(0, 0, cos(this.theta) * phaseRadius, sin(this.theta) * phaseRadius)
    pop()

    // Lógica de animación del spritesheet
    if (this.isAnimating) {
      let now = millis()
      if (now - this.lastFrameTime > this.frameDuration) {
        this.currentFrame++
        this.lastFrameTime = now
      }

      if (this.currentFrame >= this.totalFrames) {
        this.isAnimating = false
      } else {
        // Dibujar el frame recortado centrado en el agente
        let spriteSize = 100
        drawSpriteFrame(
          this.spriteSheet,
          this.cols,
          this.rows,
          this.currentFrame,
          this.x - spriteSize / 2,
          this.y - spriteSize / 2,
          spriteSize,
          spriteSize,
        )
      }
    }
  }
}
