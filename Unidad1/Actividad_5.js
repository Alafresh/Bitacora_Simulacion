// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

let walker

function setup() {
  createCanvas(windowWidth, windowHeight)
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
    this.px = this.x
    this.py = this.y
  }

  show() {
    stroke(0)
    strokeWeight(1)

    line(this.px, this.py, this.x, this.y)

    this.px = this.x
    this.py = this.y
  }

  step() {
    let xstep, ystep

    let r = random(1)
    if (r < 0.01) {
      xstep = random(-100, 100)
      ystep = random(-100, 100)
      this.x += xstep
      this.y += ystep
    } else {
      xstep = random(-2, 2)
      ystep = random(-2, 2)
      this.x += xstep
      this.y += ystep
    }
  }
}
