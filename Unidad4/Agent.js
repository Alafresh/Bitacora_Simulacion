class Agent {
  // El constructor ahora exige cols, rows y totalFrames
  constructor(x, y, omegaBase, spriteSheet, sound, cols, rows, totalFrames) {
    this.x = x
    this.y = y
    this.theta = random(TWO_PI)
    this.omegaBase = omegaBase
    this.omega = omegaBase

    this.spriteSheet = spriteSheet
    this.sound = sound
    this.isAnimating = false
    this.currentFrame = 0

    // Asignación de variables de recorte pasadas desde setup
    this.cols = cols
    this.rows = rows
    this.totalFrames = totalFrames

    this.frameDuration = 40
    this.lastFrameTime = 0
  }

  update(dt, allAgents, K) {
    let sum = 0
    let N = allAgents.length

    // Matemática de acoplamiento de Kuramoto
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
    translate(this.x, this.y)
    noFill()
    stroke(100)
    strokeWeight(2)
    circle(0, 0, 50)

    stroke(255)
    let phaseRadius = 25
    line(0, 0, cos(this.theta) * phaseRadius, sin(this.theta) * phaseRadius)
    pop()

    if (this.isAnimating) {
      let now = millis()
      if (now - this.lastFrameTime > this.frameDuration) {
        this.currentFrame++
        this.lastFrameTime = now
      }

      if (this.currentFrame >= this.totalFrames) {
        this.isAnimating = false
      } else {
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
