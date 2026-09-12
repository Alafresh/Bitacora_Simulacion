import * as THREE from 'three'

// 1. Configuración Base
const canvas = document.querySelector('.webgl')
const scene = new THREE.Scene()
scene.fog = new THREE.FogExp2('05050a', 0.02)

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
)
camera.position.z = 50

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// 2. Parámetros de Población
const countBase = 150 // Nodos de Experiencia (Generación Saliente)
const countAgile = 800 // Nodos Ágiles (Generación Entrante)

// 3. Geometrías y Materiales
const geometryBase = new THREE.IcosahedronGeometry(0.8, 1)
const materialBase = new THREE.MeshBasicMaterial({
  color: 0x445566,
  wireframe: true,
})

const geometryAgile = new THREE.SphereGeometry(0.2, 8, 8)
const materialAgile = new THREE.MeshBasicMaterial({ color: 0xffaa00 })

// 4. Instanced Meshes (Para rendimiento masivo)
const instancedBase = new THREE.InstancedMesh(
  geometryBase,
  materialBase,
  countBase,
)
const instancedAgile = new THREE.InstancedMesh(
  geometryAgile,
  materialAgile,
  countAgile,
)

// Posicionamiento inicial aleatorio en forma de esfera (El "Cascarón")
const dummy = new THREE.Object3D()

for (let i = 0; i < countBase; i++) {
  const phi = Math.acos(-1 + (2 * i) / countBase)
  const theta = Math.sqrt(countBase * Math.PI) * phi
  dummy.position.setFromSphericalCoords(15, phi, theta) // Radio 15
  dummy.updateMatrix()
  instancedBase.setMatrixAt(i, dummy.matrix)
}

for (let i = 0; i < countAgile; i++) {
  // Las partículas ágiles nacen concentradas en el núcleo
  dummy.position.set(
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10,
  )
  dummy.updateMatrix()
  instancedAgile.setMatrixAt(i, dummy.matrix)
}

scene.add(instancedBase, instancedAgile)

// 5. Redimensionamiento
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// 6. Bucle de Render
// 6. Bucle de Render
const timer = new THREE.Timer()

function animate() {
  requestAnimationFrame(animate)

  const elapsedTime = timer.getElapsed()

  // Rotación leve para percibir la profundidad
  scene.rotation.y = elapsedTime * 0.05
  scene.rotation.x = elapsedTime * 0.02

  renderer.render(scene, camera)
}

animate()
