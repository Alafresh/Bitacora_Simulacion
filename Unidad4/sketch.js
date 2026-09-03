let moonCraters = []
let cleaningParticles = [] // Arreglo para almacenar el polvo estelar de limpieza
let shakeDuration = 0
let shakeIntensity = 0
let agents = []
let sprites = []
let sounds = []
let sliderK, sliderVar
let planetRotation = 0
let stars = []
let planetRose = null // Objeto que almacenará la rosa del planeta
let planetRadius = 140 // <-- Declarada globalmente aquí para que funcione en setup() y draw()

function preload() {
  // 7 Sprites (actualmente repitiendo el mismo, listos para ser reemplazados luego)
  sprites[0] = loadImage('expl_01_01_SpriteSheet.png') // 0: Kick (Rápido)
  sprites[1] = loadImage('spritesheet/lazer_normal_SpriteSheet.png') // 1: Beatbox
  sprites[2] = loadImage('spritesheet/Flame_1_SpriteSheet.png') // 2: Hi-hat
  sprites[3] = loadImage('spritesheet/Fireball_1_loop_SpriteSheet.png') // 3: Triangle
  sprites[4] = loadImage('spritesheet/Side_Hit_normal_SpriteSheet.png') // 4: Lento 1
  sprites[5] = loadImage('spritesheet/Flame_Vertical_4_SpriteSheet.png') // 5: Lento 2
  sprites[6] = loadImage('spritesheet/lazer_normal_SpriteSheet.png') // 6: Lento 3

  // 7 Audios
  sounds[0] = loadSound('audios/kick_drum.mp3') // 0: Rápido (Se repetirá en el agente 8)
  sounds[1] = loadSound('audios/beatbox.mp3')
  sounds[2] = loadSound('audios/hi-hat.mp3')
  sounds[3] = loadSound('audios/triangle.mp3')
  sounds[4] = loadSound('audios/snare.mp3')
  sounds[5] = loadSound('audios/dry_synth.mp3')
  sounds[6] = loadSound('audios/Riff_Synth.mp3')
}

function setup() {
  createCanvas(800, 600)
  sliderK = select('#sliderK')
  sliderVar = select('#sliderVar')

  // Generar estrellas dinámicas para el fondo espacial
  for (let i = 0; i < 100; i++) {
    stars.push({
      baseX: random(width),
      baseY: random(height),
      size: random(1, 3),
      alpha: random(100, 255),
      nSeed: random(1000), // Semilla única para desfasar el movimiento de cada estrella
    })
  }

  // Crear la rosa matemática aleatoria del principito en el centro
  setupPlanetRose()

  // 7 frecuencias naturales: El 0 es muy rápido (Kick), los últimos 3 son extra lentos
  let omegas = [
    PI * 2.0, // 0: Kick (Rápido)
    PI * 1.0, // 1: Medio
    PI * 0.5, // 2: Lento
    PI * 0.25, // 3: Muy lento
    PI * 0.15, // 4: Extra lento 1
    PI * 0.1, // 5: Extra lento 2
    PI * 0.05, // 6: Extra lento 3 (Casi estático)
  ]

  let totalAgents = 8

  // 7 configuraciones de spritesheets correspondientes
  let spriteConfigs = [
    { cols: 4, rows: 4, frames: 16 }, // 0
    { cols: 4, rows: 4, frames: 16 }, // 1
    { cols: 4, rows: 4, frames: 16 }, // 2
    { cols: 2, rows: 4, frames: 8 }, // 3
    { cols: 2, rows: 4, frames: 8 }, // 4
    { cols: 8, rows: 4, frames: 32 }, // 5
    { cols: 4, rows: 4, frames: 64 }, // 6
  ]

  for (let i = 0; i < totalAgents; i++) {
    // Al usar módulo 7 (i % 7), el agente índice 7 tomará la personalidad 0
    let pIndex = i % 7
    let omegaBase = omegas[pIndex]
    let spr = sprites[pIndex]
    let snd = sounds[pIndex]
    let conf = spriteConfigs[pIndex]

    agents.push(
      new Agent(
        i,
        totalAgents,
        omegaBase,
        spr,
        snd,
        conf.cols,
        conf.rows,
        conf.frames,
      ),
    )
  }
  // Generar cráteres lunares aleatorios pero fijos para la superficie
  for (let i = 0; i < 6; i++) {
    let angle = random(TWO_PI)
    let distFromCenter = random(25, planetRadius - 35)
    moonCraters.push({
      x: cos(angle) * distFromCenter,
      y: sin(angle) * distFromCenter,
      size: random(12, 28),
    })
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
  push()
  // Aplicar sacudida de cámara si el terremoto está activo
  if (shakeDuration > 0) {
    let offsetX = random(-shakeIntensity, shakeIntensity)
    let offsetY = random(-shakeIntensity, shakeIntensity)
    translate(offsetX, offsetY)
    shakeDuration--
  }

  // 1. Fondo de espacio profundo con estrellas dotadas de ruido orgánico
  background(15, 15, 30)
  noStroke()

  for (let s of stars) {
    // Desplazamiento sutil en X e Y usando Perlin Noise basado en el tiempo (frameCount)
    let nX = s.baseX + (noise(frameCount * 0.004 + s.nSeed) - 0.5) * 15
    let nY = s.baseY + (noise(frameCount * 0.004 + s.nSeed + 500) - 0.5) * 15

    // Parpadeo suave (twinkle) combinado con el ruido
    let twinkleAlpha = s.alpha + (noise(frameCount * 0.01 + s.nSeed) - 0.5) * 80

    fill(255, constrain(twinkleAlpha, 40, 255))
    ellipse(nX, nY, s.size)
  }

  let r = calculateOrderParameter()

  let planetX = width / 2
  let planetY = height / 2 + 30

  // 4. Dibujar la atmósfera exterior del planeta según el estado de sincronía (r)
  let glowColor

  if (r < 0.3) {
    // DESORDEN: Atmósfera Azul profunda y fría
    glowColor = color(214, 214, 214, 100)
  } else if (r < 0.8) {
    // ORDEN PARCIAL: Transición entre Amarillo y Naranja cálido
    let t = map(r, 0.3, 0.8, 0, 1)
    glowColor = color(160, 160, 160, 110)
  } else {
    // ORDEN ESTABLE: Rojo intenso con un pulso dinámico de erupción unificada
    let pulseAlpha = map(sin(frameCount * 0.15), -1, 1, 120, 220)
    glowColor = color(240, 220, 190, pulseAlpha)
  }

  // Renderizar las capas del halo atmosférico
  for (let rDist = planetRadius + 40; rDist > planetRadius; rDist -= 5) {
    fill(
      red(glowColor),
      green(glowColor),
      blue(glowColor),
      map(rDist, planetRadius, planetRadius + 40, alpha(glowColor), 0),
    )
    ellipse(planetX, planetY, rDist * 2)
  }

  // 5. Dibujar el cuerpo esférico del planeta (Estilo Luna Neutra sin líneas divisorias)
  fill(165, 170, 180) // Gris lunar base uniforme
  stroke(110, 115, 125) // Borde sutil de la esfera
  strokeWeight(3)
  ellipse(planetX, planetY, planetRadius * 2)

  // Dibujar los cráteres lunares estáticos en la superficie
  noStroke()
  for (let c of moonCraters) {
    // Sombra del cráter
    fill(135, 140, 150, 200)
    ellipse(planetX + c.x, planetY + c.y, c.size)
    // Pequeño brillo interior para dar volumen cóncavo
    fill(190, 195, 205, 150)
    ellipse(planetX + c.x - 2, planetY + c.y - 2, c.size * 0.6)
  }

  drawPlanetRose(planetX, planetY)

  planetRotation += 0.003

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

  let dt = deltaTime / 1000
  let kValue = sliderK.value()
  let varValue = sliderVar.value()

  for (let agent of agents) {
    agent.omega = agent.omegaBase + random(-varValue, varValue)
    agent.update(dt, agents, kValue)
    agent.draw(planetX, planetY, planetRadius, planetRotation)
  }
  // Actualizar y dibujar partículas de limpieza (polvo estelar)
  for (let i = cleaningParticles.length - 1; i >= 0; i--) {
    let p = cleaningParticles[i]
    p.x += p.vx
    p.y += p.vy
    p.alpha -= 6 // Velocidad de desvanecimiento

    noStroke()
    fill(red(p.col), green(p.col), blue(p.col), constrain(p.alpha, 0, 255))
    ellipse(p.x, p.y, p.size)

    // Eliminar partículas cuando se desvanezcan por completo
    if (p.alpha <= 0) {
      cleaningParticles.splice(i, 1)
    }
  }
  pop() // Cierra la transformación del temblor de cámara
}

function keyPressed() {
  // Al presionar la barra espaciadora (Space)
  if (key === ' ' || keyCode === 32) {
    shakeDuration = 25 // Duración del temblor en fotogramas
    shakeIntensity = 10 // Fuerza de la sacudida visual

    // Aumentar drásticamente el acoplamiento K temporalmente para forzar sincronía
    let currentK = sliderK.value()
    sliderK.value(min(5, currentK + 3.0))
  }

  // Limpieza del Planeta (Tecla W) -> Desacopla la red, sube el caos y lanza polvo estelar
  if (key === 'w' || key === 'W') {
    let currentK = sliderK.value()
    let currentVar = sliderVar.value()

    sliderK.value(max(0, currentK - 2.5))
    sliderVar.value(min(2, currentVar + 1.0))

    // Generar ráfaga de polvo estelar dorado barriendo la superficie
    let planetX = width / 2
    let planetY = height / 2 + 30
    let planetRadius = 140

    for (let i = 0; i < 45; i++) {
      let angle = random(TWO_PI)
      let speed = random(1.5, 3.5)
      cleaningParticles.push({
        x: planetX + cos(angle) * planetRadius,
        y: planetY + sin(angle) * planetRadius,
        vx: cos(angle) * speed,
        vy: sin(angle) * speed - 0.5, // Leve impulso ascendente de limpieza
        alpha: 255,
        size: random(2, 5),
        col: color(255, random(190, 230), random(80, 130)), // Tonos dorados y chispas suaves
      })
    }
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
