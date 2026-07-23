function setup() {
  createCanvas(windowWidth, windowHeight)
  background(10)
  noLoop() // Solo necesitamos dibujarlo una vez
}

function draw() {
  translate(width / 2, height / 2) // Centramos el origen

  stroke(255, 117, 0)
  strokeWeight(0.5)

  // Dibujamos 360 líneas en círculo
  for (let i = 0; i < 360; i++) {
    rotate(radians(1)) // Giramos un grado en cada vuelta

    // El randomGaussian define qué tan larga es la línea hacia afuera
    let longitud = randomGaussian(150, 40)

    line(0, 0, abs(longitud), 0)
  }
  print('Aguacate')
}
