// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

let walker

function setup() {
  createCanvas(1920, 1080)
  walker = new Walker()
  background(255)
}

function draw() {
  walker.step()
  walker.show()
}

class Walker {
  constructor() {
    this.x = width / 2
    this.y = height / 2
  }

  show() {
    stroke(0)
    point(this.x, this.y)
  }

  step() {
    const choice = floor(randomGaussian(1))
    if (choice == 1) {
      this.x++
    } else if (choice == 0) {
      this.x--
    } else if (choice == 2) {
      this.y++
    } else {
      this.y--
    }
  }
}
