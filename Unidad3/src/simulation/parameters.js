import * as THREE from 'three/webgpu'
import { uniform } from 'three/tsl'

export function createParameters() {
  return {
    dt: uniform(1 / 60),
    timeScale: uniform(0.5),
    time: uniform(0.0),
    initialSpeed: uniform(0.35),
    maxSpeed: uniform(5.0),
    boundsSize: uniform(new THREE.Vector3(10.0, 10.0, 10.0)),
    particleSize: uniform(0.1),

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
    colorRadiusSpan: uniform(8.0),

    // --- NUEVO: POSICIONES E INFLUENCIA DE LAS 4 NAVES ---
    shipPos0: uniform(new THREE.Vector3()),
    shipPos1: uniform(new THREE.Vector3()),
    shipPos2: uniform(new THREE.Vector3()),
    shipPos3: uniform(new THREE.Vector3()),
    shipInfluence: uniform(2.0),
  }
}
