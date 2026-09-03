let agents = []
let baseSprite
let baseSound
let sliderK, sliderVar

function preload() {
  // preload bloquea la ejecución hasta que estos archivos estén descargados
  baseSprite = loadImage('expl_01_01_SpriteSheet.png')
  baseSound = loadSound('DO.mp3')
}

function setup() {
  createCanvas(800, 600)
  console.log(baseSprite)
  sliderK = select('#sliderK')
  sliderVar = select('#sliderVar')

  let centerX = width / 2
  let centerY = height / 2
  let radius = 200

  let omegas = [PI * 0.5, PI * 1.0, PI * 2.0, PI * 0.25]

  for (let i = 0; i < 8; i++) {
    // Distribuir los 8 volcanes horizontalmente de izquierda a derecha
    let x = map(i, 0, 7, 80, width - 80)
    // Altura de la cumbre de los volcanes (alineados cerca de la mitad inferior)
    let y = height - 160

    let pIndex = i % 4
    let omegaBase = omegas[pIndex]

    // Instanciar el agente volcánico
    agents.push(new Agent(x, y, omegaBase, baseSprite, baseSound, 4, 4, 16))
  }
}

function draw() {
  let r = calculateOrderParameter()

  // Colores de cielo inspirados en las referencias (Atardecer cálido / Celeste claro)
  let skyCaos = color(230, 180, 150) // Tono melocotón/atardecer suave
  let skySync = color(100, 170, 210) // Celeste brillante de cielo despejado
  let bgColor = lerpColor(skyCaos, skySync, r)

  background(bgColor)

  fill(255)
  noStroke()
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

  let dt = deltaTime / 1000
  let kValue = sliderK.value()
  let varValue = sliderVar.value()

  for (let agent of agents) {
    agent.omega = agent.omegaBase + random(-varValue, varValue)
    agent.update(dt, agents, kValue)
    agent.draw()
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
  for (let agent of agents) {
    let d = dist(mouseX, mouseY, agent.x, agent.y)
    if (d < 25) {
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
