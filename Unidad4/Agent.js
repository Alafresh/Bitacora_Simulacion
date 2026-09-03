class Agent {
  constructor(
    index,
    total,
    omegaBase,
    spriteSheet,
    sound,
    cols,
    rows,
    totalFrames,
  ) {
    this.index = index
    this.total = total
    this.theta = random(TWO_PI)
    this.omegaBase = omegaBase
    this.omega = omegaBase

    this.vBaseWidth = random(45, 70) // Base ampliada
    this.vTopWidth = random(26, 40) // Cráter ensanchado
    this.vHeight = random(45, 75) // Volcanes más altos y sobresalientes

    // Tono de roca volcánica único
    this.vColor = color(random(50, 90), random(40, 70), random(60, 100))

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

  draw(planetX, planetY, planetRadius, planetRotation) {
    push()
    let pressureRatio = this.theta / TWO_PI

    // Ángulo estático del agente + rotación global del planeta
    let angle = this.index * (TWO_PI / this.total) + planetRotation

    translate(planetX, planetY)
    rotate(angle)

    // El eje X local ahora apunta radialmente hacia afuera desde el centro del planeta
    let baseR = planetRadius
    let tipR = planetRadius + this.vHeight

    // 1. Dibujar el cono del volcán apuntando hacia afuera
    noStroke()
    fill(this.vColor)
    quad(
      baseR,
      -this.vBaseWidth / 2, // Base izquierda
      baseR,
      this.vBaseWidth / 2, // Base derecha
      tipR,
      this.vTopWidth / 2, // Cumbre derecha
      tipR,
      -this.vTopWidth / 2, // Cumbre izquierda
    )

    // 2. El cráter y la piscina de magma interior
    let coldMagma = color(60, 45, 60)
    let hotMagma = color(255, 110, 0)
    let magmaColor = lerpColor(coldMagma, hotMagma, pressureRatio)

    fill(magmaColor)
    ellipse(tipR, 0, 8, this.vTopWidth * 0.8)

    // Anillo de alerta si la presión está al límite (> 80%)
    if (pressureRatio > 0.8) {
      noFill()
      stroke(255, 200, 0, 180)
      strokeWeight(1.5)
      ellipse(tipR, 0, 10, this.vTopWidth)
    }

    // 3. Lógica de erupción (spritesheet brotando hacia afuera)
    if (this.isAnimating) {
      let now = millis()
      if (now - this.lastFrameTime > this.frameDuration) {
        this.currentFrame++
        this.lastFrameTime = now
      }

      // LÓGICA DE BUCLE DINÁMICO:
      // Si la animación llega a su último frame, verifica el audio
      if (this.currentFrame >= this.totalFrames) {
        if (this.sound && this.sound.isPlaying()) {
          this.currentFrame = 0 // El audio sigue sonando -> Reinicia el ciclo
        } else {
          this.isAnimating = false // El audio terminó -> Apaga la animación
        }
      }

      // Dibujar solo si sigue animando
      if (this.isAnimating) {
        push()
        translate(tipR, 0)
        rotate(HALF_PI)

        let spriteSize = 140
        drawSpriteFrame(
          this.spriteSheet,
          this.cols,
          this.rows,
          this.currentFrame,
          -spriteSize / 2,
          -spriteSize,
          spriteSize,
          spriteSize,
        )
        pop()
      }
    }
    pop()
  }
}
