let agents = []
let baseSprite
let baseSound
let sliderK, sliderVar
let planetRotation = 0
let stars = []
let planetRose = null // Objeto que almacenará la rosa del planeta

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

  // Crear la rosa matemática aleatoria del principito en el centro
  setupPlanetRose()

  let omegas = [PI * 0.5, PI * 1.0, PI * 2.0, PI * 0.25]
  let totalAgents = 8

  for (let i = 0; i < totalAgents; i++) {
    let pIndex = i % 4
    let omegaBase = omegas[pIndex]
    agents.push(
      new Agent(i, totalAgents, omegaBase, baseSprite, baseSound, 4, 4, 16),
    )
  }
}

function setupPlanetRose() {
  let n = 0
  let d = 0
  while (n == d) {
    n = Math.ceil(random(3, 8))
    d = Math.ceil(random(3, 8))
  }
  let k = n / d
  let revolutions = reduceDenominator(n, d) * TWO_PI

  planetRose = {
    offsetX: random(-10, 10),
    offsetY: random(-10, 10),
    k: k,
    a: random(16, 24), // Radio pequeño para que encaje dentro del planeta
    revolutions: revolutions,
    hueVal: random(300, 360), // Tonos magentas/rojos característicos de la rosa
    satVal: random(80, 100),
    lightVal: random(50, 70),
  }
}

function reduceDenominator(n, d) {
  let gcf = Math.min(n, d)
  while (gcf) {
    if (!(n % gcf) && !(d % gcf)) {
      return d / gcf
    }
    gcf--
  }
  return d
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

  // 4. Dibujar la atmósfera exterior del planeta (glow dinámico)
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

  // 5. Dibujar el cuerpo esférico del planeta
  fill(210, 165, 120)
  stroke(130, 90, 60)
  strokeWeight(3)
  ellipse(planetX, planetY, planetRadius * 2)

  // Sombra interior sutil del planeta
  noStroke()
  fill(180, 135, 95, 150)
  arc(planetX, planetY, planetRadius * 2, planetRadius * 2, 0, PI)

  // 6. Dibujar la rosa matemática en el centro del planeta
  drawPlanetRose(planetX, planetY)

  // 7. Rotación lenta del planeta completo
  planetRotation += 0.003

  // 8. Interfaz de texto superior
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

  // 9. Actualizar y dibujar agentes (los 8 volcanes)
  let dt = deltaTime / 1000
  let kValue = sliderK.value()
  let varValue = sliderVar.value()

  for (let agent of agents) {
    agent.omega = agent.omegaBase + random(-varValue, varValue)
    agent.update(dt, agents, kValue)
    agent.draw(planetX, planetY, planetRadius, planetRotation)
  }
}

function drawPlanetRose(planetX, planetY) {
  if (!planetRose) return

  push()
  colorMode(HSL, 360, 100, 100, 100)
  translate(planetX + planetRose.offsetX, planetY + planetRose.offsetY)

  let scaleFactor = 1 + 0.04 * sin(frameCount * 0.06)
  scale(scaleFactor)

  // Color de relleno principal
  fill(planetRose.hueVal, planetRose.satVal, planetRose.lightVal, 90)

  // Líneas internas / contorno: mismo tono y saturación, pero restamos luminosidad para oscurecerlo
  let strokeLightness = max(10, planetRose.lightVal - 30)
  stroke(planetRose.hueVal, planetRose.satVal, strokeLightness, 100)
  strokeWeight(0.5) // Grosor de la línea (puedes ajustarlo si lo quieres más fino o grueso)

  beginShape()
  for (let angle = 0; angle < planetRose.revolutions; angle += 0.02) {
    let rad = planetRose.a * cos(planetRose.k * angle)
    let x = rad * cos(angle)
    let y = rad * sin(angle)
    vertex(x, y)
  }
  endShape(CLOSE)
  pop()
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

function calculateOrderParameter() {
  let sumCos = 0
  let sumSin = 0
  for (let agent of agents) {
    sumCos += cos(agent.theta)
    sumSin += sin(agent.theta)
  }
  return sqrt(sq(sumCos) + sq(sumSin)) / agents.length
}
