class Agent {
  constructor(x, y, omegaBase, spriteSheet, sound, cols, rows, totalFrames) {
    this.x = x // Coordenada X del cráter/cumbre del volcán
    this.y = y // Coordenada Y de la cumbre
    this.theta = random(TWO_PI)
    this.omegaBase = omegaBase
    this.omega = omegaBase

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

    // 1. Dibujar la silueta del volcán (estilo vector plano / rocas oscuras)
    let baseWidth = 130
    let mountainBottom = height // Llega hasta el suelo del canvas

    noStroke()
    // Color base de roca volcánica (tonos púrpuras/grises oscuros inspirados en las referencias)
    fill(42, 38, 53)
    beginShape()
    vertex(this.x - baseWidth / 2, mountainBottom) // Base izquierda
    vertex(this.x + baseWidth / 2, mountainBottom) // Base derecha
    vertex(this.x + 22, this.y) // Cumbre derecha del cráter
    vertex(this.x - 22, this.y) // Cumbre izquierda del cráter
    endShape(CLOSE)

    // 2. El cráter y la piscina de magma interior
    let coldMagma = color(60, 45, 60)
    let hotMagma = color(255, 110, 0)
    let magmaColor = lerpColor(coldMagma, hotMagma, pressureRatio)

    fill(magmaColor)
    ellipse(this.x, this.y, 44, 16) // El óvalo del cráter superior

    // Anillo de alerta si la presión está al límite (> 80%)
    if (pressureRatio > 0.8) {
      noFill()
      stroke(255, 200, 0, 180)
      strokeWeight(2)
      ellipse(this.x, this.y, 52, 20)
    }
    pop()

    // 3. Lógica de erupción (el spritesheet brotando desde el cráter)
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
        // Se dibuja centrado justo encima de la cumbre (this.x, this.y)
        drawSpriteFrame(
          this.spriteSheet,
          this.cols,
          this.rows,
          this.currentFrame,
          this.x - spriteSize / 2,
          this.y - spriteSize - 20,
          spriteSize,
          spriteSize,
        )
      }
    }
  }
}
