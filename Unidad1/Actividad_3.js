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
    let xstep = randomGaussian(0.5, 1.2)
    let ystep = randomGaussian(0, 1.2)
    print(xstep)

    if (xstep > 0) {
      this.x++
    } else {
      this.x--
    }

    if (ystep > 0) {
      this.y++
    } else {
      this.y--
    }
  }
}
