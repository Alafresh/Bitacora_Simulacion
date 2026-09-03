let agents = []
let sprites = []
let sounds = []
let sliderK, sliderVar

function setup() {
  loadImage('expl_01_01_SpriteSheet.png')
    .then((img) => {
      console.log('IMAGEN OK:', img)
      spriteImg = img
      for (let agent of agents) {
        agent.spriteSheet = img
      }
    })
    .catch((err) => console.error('IMAGEN FALLÓ:', err))

  loadSound('DO.mp3')
    .then((snd) => {
      console.log('SONIDO OK:', snd)
      clickSound = snd
    })
    .catch((err) => console.error('SONIDO FALLÓ:', err))

  createCanvas(800, 600)

  sliderK = select('#sliderK')
  sliderVar = select('#sliderVar')

  // Distribución circular de los 8 agentes
  let centerX = width / 2
  let centerY = height / 2
  let radius = 200

  // Definimos 4 personalidades (Frecuencias base / BPM)
  // [Lento, Medio, Rápido, Muy Lento]
  let omegas = [PI * 0.5, PI * 1.0, PI * 2.0, PI * 0.25]

  for (let i = 0; i < 8; i++) {
    // Calcular posición en el círculo
    let angle = (TWO_PI / 8) * i
    let x = centerX + cos(angle) * radius
    let y = centerY + sin(angle) * radius

    // Asignar personalidad (0, 1, 2, 3, 0, 1, 2, 3)
    let pIndex = i % 4

    let omegaBase = omegas[pIndex]
    let sprite = sprites[pIndex]
    let sound = sounds[pIndex]

    // Instanciar el agente
    agents.push(new Agent(x, y, omegaBase, sprite, sound))
  }
}

function draw() {
  // 1. Calcular el estado global del colectivo
  let r = calculateOrderParameter()

  // 2. Transición de color visual del estado colectivo
  let caosColor = color(30, 30, 30)
  let syncColor = color(0, 100, 200)
  let bgColor = lerpColor(caosColor, syncColor, r)

  background(bgColor)

  // 3. Indicador UI
  fill(255)
  noStroke()
  textSize(16)
  text(`Sincronía Colectiva (r): ${r.toFixed(2)}`, 20, 30)

  // Si r > 0.8, podemos mostrar un indicador visual extra de "Organización Estable"
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
  let varValue = sliderVar.value() // Controla la dispersión de frecuencias

  for (let agent of agents) {
    // Aplicamos la varianza (sliderVar) a la frecuencia natural para generar desorden orgánico
    // Si varValue es 0, todos intentarán ir a su omegaBase original
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
      // Radio visual del nodo
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
