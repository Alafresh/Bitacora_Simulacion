let agents = []
let baseSprite
let baseSound
let sliderK, sliderVar
let planetRotation = 0 // Ángulo de rotación global del planeta
let stars = [] // Estrellas de fondo

function preload() {
  baseSprite = loadImage('expl_01_01_SpriteSheet.png')
  baseSound = loadSound('DO.mp3')
}

function setup() {
  createCanvas(800, 600)
  sliderK = select('#sliderK')
  sliderVar = select('#sliderVar')

  // Generar estrellas fijas para el fondo espacial
  for (let i = 0; i < 100; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      alpha: random(100, 255),
    })
  }

  let omegas = [PI * 0.5, PI * 1.0, PI * 2.0, PI * 0.25]
  let totalAgents = 8

  for (let i = 0; i < totalAgents; i++) {
    let pIndex = i % 4
    let omegaBase = omegas[pIndex]

    // Pasamos el índice 'i' para que cada agente sepa su posición angular inicial en el planeta
    agents.push(
      new Agent(i, totalAgents, omegaBase, baseSprite, baseSound, 4, 4, 16),
    )
  }
}

function draw() {
  // 1. Fondo de espacio profundo con estrellas
  background(15, 15, 30)
  noStroke()
  for (let s of stars) {
    fill(255, s.alpha)
    ellipse(s.x, s.y, s.size)
  }

  // 2. Calcular estado de sincronía colectiva (r)
  let r = calculateOrderParameter()

  // 3. Coordenadas del centro del planeta
  let planetX = width / 2
  let planetY = height / 2 + 30
  let planetRadius = 140

  // 4. Dibujar la atmósfera exterior del planeta (el gradiente de luz que responde a r)
  let glowColorA = color(230, 140, 100, 50)
  let glowColorB = color(100, 200, 255, 120)
  let currentGlow = lerpColor(glowColorA, glowColorB, r)

  for (let rDist = planetRadius + 40; rDist > planetRadius; rDist -= 5) {
    fill(
      red(currentGlow),
      green(currentGlow),
      blue(currentGlow),
      map(rDist, planetRadius, planetRadius + 40, 40, 0),
    )
    ellipse(planetX, planetY, rDist * 2)
  }

  // 5. Dibujar el cuerpo esférico del planeta (Estilo miniatura El Principito)
  fill(210, 165, 120) // Tono base de tierra/arena estelar
  stroke(130, 90, 60)
  strokeWeight(3)
  ellipse(planetX, planetY, planetRadius * 2)

  // Sombra interior o textura sutil del planeta
  noStroke()
  fill(180, 135, 95, 150)
  arc(planetX, planetY, planetRadius * 2, planetRadius * 2, 0, PI)

  // 6. Rotación lenta del planeta completo
  planetRotation += 0.003

  // 7. Interfaz de texto superior
  fill(255)
  textSize(16)
  text(`Sincronía Colectiva (r): ${r.toFixed(2)}`, 20, 30)

  if (r > 0.8) {
    fill(0, 255, 100)
    text(`ESTADO: ORDEN ESTABLE`, 20, 55)
  } else if (r > 0.3) {
    fill(255, 200, 0)
    text(`ESTADO: ORDEN PARCIAL`, 20, 55)
  } else {
    fill(255, 50, 50)
    text(`ESTADO: DESORDEN`, 20, 55)
  }

  // 8. Actualizar y dibujar agentes (los 8 volcanes orientados hacia afuera)
  let dt = deltaTime / 1000
  let kValue = sliderK.value()
  let varValue = sliderVar.value()

  for (let agent of agents) {
    agent.omega = agent.omegaBase + random(-varValue, varValue)
    agent.update(dt, agents, kValue)
    agent.draw(planetX, planetY, planetRadius, planetRotation)
  }
}

function drawSpriteFrame(img, cols, rows, frameIndex, dx, dy, dw, dh) {
  if (!img || !img.width) return
  let sw = img.width / cols
  let sh = img.height / rows
  let col = frameIndex % cols
  let row = floor(frameIndex / cols)
  let sx = col * sw
  let sy = row * sh
  image(img, dx, dy, dw, dh, sx, sy, sw, sh)
}

function mouseDragged() {
  let planetX = width / 2
  let planetY = height / 2 + 30
  let planetRadius = 140

  for (let agent of agents) {
    // Apuntar al área del cráter en la superficie exterior
    let angle = agent.index * (TWO_PI / 8) + planetRotation
    let vx = planetX + cos(angle) * (planetRadius + 20)
    let vy = planetY + sin(angle) * (planetRadius + 20)

    let d = dist(mouseX, mouseY, vx, vy)
    if (d < 30) {
      agent.theta += (movedX + movedY) * 0.05
      if (agent.theta < 0) {
        agent.theta += TWO_PI
      }
    }
  }
}

function calculateOrderParameter() {
  let sumCos = 0
  let sumSin = 0
  for (let agent of agents) {
    sumCos += cos(agent.theta)
    sumSin += sin(agent.theta)
  }
  return sqrt(sq(sumCos) + sq(sumSin)) / agents.length
}
