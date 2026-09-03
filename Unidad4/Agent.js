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

    // Propiedades generativas únicas para cada volcán en miniatura
    this.vBaseWidth = random(35, 55) // Ancho en la base de la superficie del planeta
    this.vTopWidth = random(16, 26) // Ancho del cráter
    this.vHeight = random(25, 45) // Altura hacia afuera de la superficie

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

    // Calcular el ángulo estático del agente más la rotación global del planeta
    let angle = this.index * (TWO_PI / this.total) + planetRotation

    // Trasladar el origen al centro del planeta y rotar para alinear con la normal radial
    translate(planetX, planetY)
    rotate(angle)

    // Posición base sobre la superficie del planeta (en el borde exterior de la esfera) y el pico hacia afuera
    let baseR = planetRadius
    let tipR = planetRadius + this.vHeight

    // 1. Dibujar el cono del volcán apuntando hacia afuera utilizando polígonos (quad / beginShape)
    noStroke()
    fill(this.vColor)
    beginShape()
    vertex(-this.vBaseWidth / 2, baseR) // Base izquierda
    vertex(this.vBaseWidth / 2, baseR) // Base derecha
    vertex(this.vTopWidth / 2, tipR) // Cumbre derecha
    vertex(-this.vTopWidth / 2, tipR) // Cumbre izquierda
    endShape(CLOSE)

    // 2. El cráter y la piscina de magma interior que reacciona a la presión (θ_i)
    let coldMagma = color(60, 45, 60)
    let hotMagma = color(255, 110, 0)
    let magmaColor = lerpColor(coldMagma, hotMagma, pressureRatio)

    fill(magmaColor)
    ellipse(0, tipR, this.vTopWidth * 0.8, 8) // El óvalo del cráter visto de perfil radial

    // Anillo de alerta si la presión está al límite (> 80%)
    if (pressureRatio > 0.8) {
      noFill()
      stroke(255, 200, 0, 180)
      strokeWeight(1.5)
      ellipse(0, tipR, this.vTopWidth, 10)
    }

    // 3. Lógica de erupción (spritesheet brotando hacia el espacio exterior desde el cráter)
    if (this.isAnimating) {
      let now = millis()
      if (now - this.lastFrameTime > this.frameDuration) {
        this.currentFrame++
        this.lastFrameTime = now
      }

      if (this.currentFrame >= this.totalFrames) {
        this.isAnimating = false
      } else {
        push()
        // Nos posicionamos exactamente en la cumbre del volcán y des-rotamos temporalmente
        // para que las explosiones siempre broten verticalmente hacia arriba respecto al espacio
        translate(0, tipR)
        rotate(-angle)

        let spriteSize = 70
        drawSpriteFrame(
          this.spriteSheet,
          this.cols,
          this.rows,
          this.currentFrame,
          -spriteSize / 2,
          -spriteSize + 5,
          spriteSize,
          spriteSize,
        )
        pop()
      }
    }
    pop()
  }
}
