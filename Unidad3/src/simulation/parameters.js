import * as THREE from 'three/webgpu'
import { uniform } from 'three/tsl'

// Uniforms are CPU-side values that TSL exposes to the GPU.
// Changing .value does not rebuild the compute shader.
export function createParameters() {
  return {
    dt: uniform(1 / 60),
    timeScale: uniform(1.0),
    initialSpeed: uniform(0.35),
    maxSpeed: uniform(5.0),
    boundsSize: uniform(new THREE.Vector3(10.0, 10.0, 10.0)),
    particleSize: uniform(0.035),

    windEnabled: uniform(0.0),
    wind: uniform(new THREE.Vector3(0.0, 0.0, 0.0)),

    radialEnabled: uniform(1.0),
    attractor: uniform(new THREE.Vector3(0.0, 0.0, 0.0)),
    radialStrength: uniform(2.2),
    softening: uniform(0.35),

    vortexEnabled: uniform(1.0),
    vortexStrength: uniform(1.4),

    dragEnabled: uniform(1.0),
    dragCoefficient: uniform(0.12),

    galaxyRadius: uniform(6.0),
    galaxyBranches: uniform(3.0),
    galaxySpin: uniform(1.0),
    randomness: uniform(0.2),
    randomnessPower: uniform(3.0),

    // NUEVO: Colores de la galaxia (convertidos a Vectores RGB)
    // El insideColor inicial '#ff6030'
    colorInside: uniform(new THREE.Vector3(1.0, 0.376, 0.188)),
    // El outsideColor inicial '#1b3984'
    colorOutside: uniform(new THREE.Vector3(0.106, 0.224, 0.518)),

    // Un multiplicador para controlar qué tan rápido ocurre la transición de color
    colorRadiusSpan: uniform(8.0),
  }
}
