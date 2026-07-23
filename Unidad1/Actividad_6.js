function setup() {
  createCanvas(windowWidth, windowHeight)
}

let t = 0

function draw() {
  background(255)

  let val1D = noise(t)

  let diametro = val1D * 300
  circle(width / 2, height / 2, diametro)

  t += 0.01
}
