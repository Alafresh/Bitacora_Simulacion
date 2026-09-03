class Agent {
  constructor(x, y, omegaBase, spriteSheet, sound, cols, rows, totalFrames) {
    this.x = x // Posición X central
    this.y = y // Línea de base inferior (suelo)
    this.theta = random(TWO_PI)
    this.omegaBase = omegaBase
    this.omega = omegaBase

    // Propiedades generativas únicas para cada volcán (inspirado en tu ejemplo)
    this.vWidth = random(130, 220) // Ancho de la base aleatorio
    this.topWidth = random(35, 75) // Ancho del cráter superior aleatorio
    this.vHeight = random(120, 200) // Altura del volcán aleatoria

    // Tono de roca volcánica único y terroso para cada montaña
    this.vColor = color(random(30, 70), random(25, 50), random(45, 85))

    this.spriteSheet = spriteSheet
    this.sound = sound
    this.isAnimating = false
    this.currentFrame = 0

    this.cols = cols
    this.rows = rows
    this.totalFrames = totalFrames

    this.frameDuration = 40
    this.lastFrameTime = 0
  }

  update(dt, allAgents, K) {
    let sum = 0
    let N = allAgents.length

    for (let other of allAgents) {
      let phaseDifference = other.theta - this.theta
      sum += Math.sin(phaseDifference)
    }

    let coupling = (K / N) * sum
    this.theta += (this.omega + coupling) * dt

    if (this.theta >= TWO_PI) {
      this.theta %= TWO_PI
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
    push()
    let pressureRatio = this.theta / TWO_PI

    // Coordenadas de la cumbre calculadas de forma generativa
    let peakX = this.x
    let peakY = this.y - this.vHeight

    // 1. Dibujar la silueta geométrica del volcán usando un quad personalizado
    noStroke()
    fill(this.vColor)
    quad(
      this.x - this.vWidth / 2,
      this.y, // Esquina inferior izquierda
      peakX - this.topWidth / 2,
      peakY, // Esquina superior izquierda (cráter)
      peakX + this.topWidth / 2,
      peakY, // Esquina superior derecha (cráter)
      this.x + this.vWidth / 2,
      this.y, // Esquina inferior derecha
    )

    // 2. El cráter y la piscina de magma interior que reacciona a la presión (θ_i)
    let coldMagma = color(60, 45, 60)
    let hotMagma = color(255, 110, 0)
    let magmaColor = lerpColor(coldMagma, hotMagma, pressureRatio)

    fill(magmaColor)
    ellipse(peakX, peakY, this.topWidth * 0.75, 16) // Óvalo del cráter

    // Anillo de alerta si la presión está al límite (> 80%)
    if (pressureRatio > 0.8) {
      noFill()
      stroke(255, 200, 0, 180)
      strokeWeight(2)
      ellipse(peakX, peakY, this.topWidth * 0.85, 20)
    }
    pop()

    // 3. Lógica de erupción (spritesheet brotando exactamente desde la cumbre)
    if (this.isAnimating) {
      let now = millis()
      if (now - this.lastFrameTime > this.frameDuration) {
        this.currentFrame++
        this.lastFrameTime = now
      }

      if (this.currentFrame >= this.totalFrames) {
        this.isAnimating = false
      } else {
        let spriteSize = 110
        drawSpriteFrame(
          this.spriteSheet,
          this.cols,
          this.rows,
          this.currentFrame,
          peakX - spriteSize / 2,
          peakY - spriteSize + 10,
          spriteSize,
          spriteSize,
        )
      }
    }
  }
}
