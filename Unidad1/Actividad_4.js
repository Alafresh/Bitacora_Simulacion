function setup() {
  createCanvas(windowWidth, windowHeight)
  background(10)
  noLoop()
}

function draw() {
  translate(width / 2, height / 2)

  stroke(255, 117, 0)
  strokeWeight(0.5)

  for (let i = 0; i < 360; i++) {
    rotate(radians(1))

    let longitud = randomGaussian(150, 40)

    line(0, 0, abs(longitud), 0)
  }
  print('Aguacate')
}
