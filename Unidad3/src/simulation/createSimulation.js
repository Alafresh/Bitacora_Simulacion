import * as THREE from 'three/webgpu'
import {
  Fn,
  If,
  color,
  hash,
  instanceIndex,
  instancedArray,
  max,
  mix,
  mod,
  step,
  uint,
  uv,
  vec3,
  vec4,
  float,
  cos,
  sin,
  pow,
  sign,
  length,
  texture,
} from 'three/tsl'

const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/9.png')
particleTexture.colorSpace = THREE.SRGBColorSpace

export function createSimulation({ renderer, scene, params, count = 131072 }) {
  // STATE -----------------------------------------------------------------
  // Each particle owns position and velocity. The arrays live in GPU storage.
  const positionBuffer = instancedArray(count, 'vec3')
  const velocityBuffer = instancedArray(count, 'vec3')

  // INITIALIZATION --------------------------------------------------------
  // A compute pass writes the initial state for every particle in parallel.
  const initParticles = Fn(() => {
    // 1. Mantenemos el índice como ENTERO para que la función hash() no colapse
    const i = instanceIndex
    const p = positionBuffer.element(i)
    const v = velocityBuffer.element(i)

    // Semillas para posición
    const randRadius = hash(i.add(uint(11)))
    const randX = hash(i.add(uint(23)))
    const randY = hash(i.add(uint(37)))
    const randZ = hash(i.add(uint(53)))

    // Semillas para velocidad (necesarias para el preset de Inercia)
    const randVX = hash(i.add(uint(71)))
    const randVY = hash(i.add(uint(89)))
    const randVZ = hash(i.add(uint(101)))

    const PI2 = Math.PI * 2.0

    // 2. AHORA SÍ convertimos a FLOAT para hacer matemáticas de trigonometría
    const iFloat = float(i)

    // Calcular Radio y Ángulos
    const radius = randRadius.mul(params.galaxyRadius)
    const spinAngle = radius.mul(params.galaxySpin)

    const branchIndex = mod(iFloat, params.galaxyBranches).floor()
    const branchAngle = branchIndex.div(params.galaxyBranches).mul(PI2)
    const totalAngle = branchAngle.add(spinAngle)

    const baseX = cos(totalAngle).mul(radius)
    const baseZ = sin(totalAngle).mul(radius)

    // Calcular la dispersión
    const scatterX = pow(randX, params.randomnessPower)
      .mul(params.randomness)
      .mul(sign(randX.sub(0.5)))
    const scatterY = pow(randY, params.randomnessPower)
      .mul(params.randomness)
      .mul(sign(randY.sub(0.5)))
    const scatterZ = pow(randZ, params.randomnessPower)
      .mul(params.randomness)
      .mul(sign(randZ.sub(0.5)))

    // Asignar posición
    p.assign(vec3(baseX.add(scatterX), scatterY, baseZ.add(scatterZ)))

    // Asignar velocidad inicial aleatoria (¡Esto revive la prueba 1 de inercia!)
    v.assign(vec3(randVX, randVY, randVZ).sub(0.5).mul(params.initialSpeed))
  })()
    .compute(count)
    .setName('Initialize Particles')

  // UPDATE / COMPUTE SHADER ----------------------------------------------
  // This is the conceptual heart of the project:
  // state -> forces -> acceleration -> velocity -> position.
  const updateParticles = Fn(() => {
    const p = positionBuffer.element(instanceIndex)
    const v = velocityBuffer.element(instanceIndex)

    const dt = params.dt.mul(params.timeScale)
    const force = vec3(0.0).toVar()

    // 1) CONSTANT / WIND FORCE
    force.addAssign(params.wind.mul(params.windEnabled))

    // 2) RADIAL FORCE (positive = attraction, negative = repulsion)
    const toAttractor = params.attractor.sub(p)
    const distance = max(toAttractor.length(), params.softening)
    const radialDirection = toAttractor.div(distance)
    const radialForce = radialDirection
      .mul(params.radialStrength)
      .div(distance.pow(2))
      .mul(params.radialEnabled)
    force.addAssign(radialForce)

    // 3) VORTEX FORCE: tangent to the radial direction around Z.
    const zAxis = vec3(0.0, 0.0, 1.0)
    const tangent = zAxis.cross(radialDirection)
    force.addAssign(
      tangent.mul(params.vortexStrength).mul(params.vortexEnabled),
    )

    // 4) LINEAR DRAG: F = -c v
    force.addAssign(
      v.mul(params.dragCoefficient).mul(params.dragEnabled).mul(-1.0),
    )

    // INTEGRATION ---------------------------------------------------------
    // Unit mass: a = F. Semi-implicit Euler: update v, then p.
    v.addAssign(force.mul(dt))

    const speed = v.length()
    If(speed.greaterThan(params.maxSpeed), () => {
      v.assign(v.normalize().mul(params.maxSpeed))
    })

    // ¡ESTA ES LA LÍNEA QUE FALTABA!
    p.addAssign(v.mul(dt))

    // Teletransportación perfecta alineada a los bordes de la cámara
    const half = params.boundsSize.mul(0.5)
    p.assign(mod(p.add(half), params.boundsSize).sub(half))
  })()
    .compute(count)
    .setName('Update Particles')

  // RENDER ---------------------------------------------------------------
  const material = new THREE.SpriteNodeMaterial({
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: true,
    transparent: true,
  })

  material.positionNode = positionBuffer.toAttribute()
  material.scaleNode = params.particleSize

  // NUEVO: Color 100% aleatorio e individual por partícula
  material.colorNode = Fn(() => {
    const i = instanceIndex

    // Generamos 3 semillas distintas usando el índice único de cada partícula
    const r = hash(i.add(uint(101))) // Canal Rojo
    const g = hash(i.add(uint(203))) // Canal Verde
    const b = hash(i.add(uint(307))) // Canal Azul

    const randomColor = vec3(r, g, b)

    // Muestreamos la textura PNG
    const tex = texture(particleTexture, uv())

    // Multiplicamos el color único de la partícula por la textura
    return vec4(randomColor.mul(tex.rgb), tex.a)
  })()

  // Aplicamos la transparencia de tu textura PNG
  material.opacityNode = texture(particleTexture, uv()).a

  const geometry = new THREE.PlaneGeometry(1, 1)
  const mesh = new THREE.InstancedMesh(geometry, material, count)
  mesh.frustumCulled = false
  scene.add(mesh)

  function reset() {
    renderer.compute(initParticles)
  }

  function stepSimulation() {
    renderer.compute(updateParticles)
  }

  function dispose() {
    geometry.dispose()
    material.dispose()
    scene.remove(mesh)
  }

  return {
    count,
    positionBuffer,
    velocityBuffer,
    reset,
    stepSimulation,
    dispose,
  }
}
