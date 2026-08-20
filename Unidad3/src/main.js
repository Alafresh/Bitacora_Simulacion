import * as THREE from 'three/webgpu'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import WebGPU from 'three/addons/capabilities/WebGPU.js'
import './style.css'
import { crearModelo } from './level/model.js'
import { createParameters } from './simulation/parameters.js'
import { createSimulation } from './simulation/createSimulation.js'
import { createLabPanel } from './ui/labPanel.js'

/*
2^15: 32768
2^16: 65536
2^17: 131072
2^18: 262144
2^19: 524288
2^20: 1048576
2^21: 2097152
2^22: 4194304
2^23: 8388608
2^24: 16777216
*/

const PARTICLE_COUNT = 131072 //2^17. Increase only after measuring performance.

async function main() {
  const mount = document.querySelector('#app')

  if (!WebGPU.isAvailable()) {
    mount.appendChild(WebGPU.getErrorMessage())
    throw new Error(
      'Este proyecto requiere WebGPU para ejecutar compute shaders.',
    )
  }

  // THREE.JS MENTAL MODEL: scene + camera + renderer ---------------------
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('#3b3e45')

  // --- NUEVO: AGREGAR LUCES A LA ESCENA ---
  // 1. Luz ambiental para iluminar los modelos de manera general
  const ambientLight = new THREE.AmbientLight(0xb4c9fe, 1.5)
  scene.add(ambientLight)

  const dancers = []
  let naveEspacial = null // Variable para guardar la referencia de la nave

  crearModelo(scene, dancers, (naveCargada) => {
    naveEspacial = naveCargada // ¡Listo! La nave ya está en la escena y se puede animar
  })
  const camera = new THREE.PerspectiveCamera(
    50,
    innerWidth / innerHeight,
    0.05,
    100,
  )
  camera.position.set(0, 0, 11)

  const renderer = new THREE.WebGPURenderer({ antialias: true })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.setSize(innerWidth, innerHeight)
  mount.appendChild(renderer.domElement)
  await renderer.init()

  const orbit = new OrbitControls(camera, renderer.domElement)
  orbit.enableDamping = true
  orbit.target.set(0, 0, 0)

  const params = createParameters()
  const simulation = createSimulation({
    renderer,
    scene,
    params,
    count: PARTICLE_COUNT,
  })

  // Calculamos el tamaño real de la pantalla en coordenadas de mundo (Z=0)
  function updateFrustumBounds() {
    // Pasamos el FOV de grados a radianes
    const vFov = (camera.fov * Math.PI) / 180

    // Altura = 2 * distancia * tan(fov / 2)
    const height = 2 * Math.tan(vFov / 2) * camera.position.z
    const width = height * camera.aspect

    // Asignamos al uniform (X, Y y una profundidad Z segura)
    params.boundsSize.value.set(width, height, 15.0)
  }

  // Lo ejecutamos al inicio
  updateFrustumBounds()

  const axes = new THREE.AxesHelper(1.5)
  scene.add(axes)

  // POINTER -> WORLD POSITION --------------------------------------------
  // This is a useful camera concept: screen coordinates are not world coords.
  const pointerNdc = new THREE.Vector2()
  const raycaster = new THREE.Raycaster()
  const interactionPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
  const hit = new THREE.Vector3()

  addEventListener('pointermove', (event) => {
    pointerNdc.x = (event.clientX / innerWidth) * 2 - 1
    pointerNdc.y = -(event.clientY / innerHeight) * 2 + 1
    raycaster.setFromCamera(pointerNdc, camera)
    if (raycaster.ray.intersectPlane(interactionPlane, hit)) {
      params.attractor.value.copy(hit)
    }
  })

  let paused = false
  let mode = 'LAB'
  let panel
  let savedRadialStrength = params.radialStrength.value
  let savedRadialEnabled = params.radialEnabled.value

  const applyPreset = (id) => {
    params.windEnabled.value = 0
    params.radialEnabled.value = 0
    params.vortexEnabled.value = 0
    params.dragEnabled.value = 0
    params.wind.value.set(0, 0, 0)
    params.initialSpeed.value = 0
    const halfW = params.boundsSize.value.x / 2
    const halfH = params.boundsSize.value.y / 2

    if (id === 'inertia') {
      params.initialSpeed.value = 0.8
      dancerTargets[0].set(-halfW, halfH, 0) // Arriba Izquierda
      dancerTargets[1].set(halfW, halfH, 0) // Arriba Derecha
      dancerTargets[2].set(-halfW, -halfH, 0) // Abajo Izquierda
      dancerTargets[3].set(halfW, -halfH, 0) // Abajo Derecha
    } else if (id === 'wind') {
      params.windEnabled.value = 1
      params.wind.value.set(1.5, 0, 0)
      // FORMACIÓN: CONTRA LA PARED (El viento los empuja al borde derecho)
      dancerTargets[0].set(halfW, halfH * 0.75, 0)
      dancerTargets[1].set(halfW, halfH * 0.25, 0)
      dancerTargets[2].set(halfW, -halfH * 0.25, 0)
      dancerTargets[3].set(halfW, -halfH * 0.75, 0)
    } else if (id === 'attract') {
      params.radialEnabled.value = 1
      params.radialStrength.value = 3.0
      dancerTargets.forEach((target) => target.set(0, 0, 0))
    } else if (id === 'repel') {
      params.radialEnabled.value = 1
      params.radialStrength.value = -3.0
      dancerTargets[0].set(-halfW, halfH, 0) // Arriba Izquierda
      dancerTargets[1].set(halfW, halfH, 0) // Arriba Derecha
      dancerTargets[2].set(-halfW, -halfH, 0) // Abajo Izquierda
      dancerTargets[3].set(halfW, -halfH, 0) // Abajo Derecha
    } else if (id === 'vortex') {
      params.radialEnabled.value = 1
      params.radialStrength.value = 1.0
      params.vortexEnabled.value = 1
      params.vortexStrength.value = 3.0
      params.dragEnabled.value = 1
      params.dragCoefficient.value = 0.08
      const offset = 2.0
      dancerTargets[0].set(0, offset, 0)
      dancerTargets[1].set(offset, 0, 0)
      dancerTargets[2].set(0, -offset, 0)
      dancerTargets[3].set(-offset, 0, 0)
    }
    randomizeColors()
    simulation.reset()
    panel?.refresh()
  }

  // Actualiza tu setMode para gestionar la cámara
  const setMode = (next) => {
    mode = next
    camera.position.set(0, 0, 11) // Volvemos a la vista de LAB
  }

  panel = createLabPanel({
    params,
    onReset: () => simulation.reset(),
    onPreset: applyPreset,
    onModeChange: () => setMode(mode === 'LAB' ? 'PERFORMANCE' : 'LAB'),
    onPauseChange: () => (paused = !paused),
  })

  const hud = document.createElement('div')
  hud.className = 'hud'
  document.body.append(hud)
  setMode('LAB')

  // BASELINE LIVE INSTRUMENT MAPPING -------------------------------------
  // Students are expected to redesign this mapping for their own instrument.
  addEventListener('keydown', (event) => {
    //console.log('radial inverted', params.radialStrength.value);
    if (event.repeat) return
    if (event.code === 'KeyP') setMode(mode === 'LAB' ? 'PERFORMANCE' : 'LAB')
    if (event.code === 'KeyR') simulation.reset()
    if (event.code === 'Digit1') applyPreset('inertia')
    if (event.code === 'Digit2') applyPreset('wind')
    if (event.code === 'Digit3') applyPreset('attract')
    if (event.code === 'Digit4') applyPreset('repel')
    if (event.code === 'Digit5') applyPreset('vortex')
    if (event.code === 'Space') {
      event.preventDefault()
      //savedRadialStrength = params.radialStrength.value || 2.0;
      savedRadialStrength = params.radialStrength.value
      savedRadialEnabled = params.radialEnabled.value
      params.radialEnabled.value = 1
      params.radialStrength.value = -(savedRadialStrength || 2.0)
      //console.log('radial inverted', params.radialStrength.value);
      randomizeColors()
    }
  })

  addEventListener('keyup', (event) => {
    if (event.code === 'Space') {
      params.radialEnabled.value = savedRadialEnabled
      params.radialStrength.value = savedRadialStrength
    }
  })

  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(innerWidth, innerHeight)
    updateFrustumBounds() // <--- Agrega esta línea
  })
  simulation.reset()

  // --- SISTEMA DE GAME FEEL / JUICE ---
  let cameraTrauma = 0
  let targetFov = 50
  const targetColorInside = new THREE.Vector3(1.0, 0.376, 0.188)
  const targetColorOutside = new THREE.Vector3(0.106, 0.224, 0.518)

  const randomizeColors = () => {
    targetColorInside.set(Math.random(), Math.random(), Math.random())
    targetColorOutside.set(Math.random(), Math.random(), Math.random())

    cameraTrauma = 0.8
    camera.fov = 35
    camera.updateProjectionMatrix()

    for (let i = 0; i < 4; i++) {
      if (dancers[i] && dancers[i].model) {
        // CORRECCIÓN: Apuntamos al .model
        dancers[i].model.scale.set(0.2, 1.8, 0.2)
      }
    }
  }

  // Arreglo de posiciones objetivo (Vector3) para cada uno de los 4 modelos
  const dancerTargets = [
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
  ]

  // Usamos el Timer importado
  const clock = new THREE.Timer()

  // FRAME LOOP ------------------------------------------------------------
  renderer.setAnimationLoop(() => {
    clock.update() // Timer REQUIERE que llames a update() al inicio del loop
    const delta = clock.getDelta()

    // --- 1. RESOLVER FEEDBACKS DE CÁMARA ---
    camera.fov += (targetFov - camera.fov) * 0.1
    camera.updateProjectionMatrix()

    if (cameraTrauma > 0.01) {
      const shakeX = (Math.random() - 0.5) * cameraTrauma
      const shakeY = (Math.random() - 0.5) * cameraTrauma
      orbit.target.set(shakeX, shakeY, 0)
      cameraTrauma *= 0.85
    } else {
      orbit.target.lerp(new THREE.Vector3(0, 0, 0), 0.1)
    }

    // --- 2. TRANSICIÓN DE COLORES ---
    params.colorInside.value.lerp(targetColorInside, 0.05)
    params.colorOutside.value.lerp(targetColorOutside, 0.05)

    // --- 3. ACTUALIZAR MODELOS ---
    for (let i = 0; i < 4; i++) {
      if (dancers[i] && dancers[i].model) {
        // CORRECCIÓN: Usamos .model.position y .model.scale
        dancers[i].model.position.lerp(dancerTargets[i], 0.05)
        dancers[i].model.scale.lerp(new THREE.Vector3(1, 1, 1), 0.15)
        dancers[i].mixer.update(delta)
      }
    }

    if (!paused) simulation.stepSimulation()
    orbit.update()
    renderer.render(scene, camera)
  })
}

main().catch((error) => {
  console.error(error)
  const pre = document.createElement('pre')
  pre.style.cssText =
    'position:fixed;inset:16px;white-space:pre-wrap;color:#fff;z-index:50'
  pre.textContent = String(error?.stack || error)
  document.body.append(pre)
})
