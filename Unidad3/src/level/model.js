import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js'

export const crearModelo = (scene, dancersArray, onNaveLoaded) => {
  const loader = new GLTFLoader()

  // 1. Cargar los 4 bailarines (/bailando.glb)[cite: 11]
  loader.load(
    '/bailando.glb',
    (gltf) => {
      const originalScene = gltf.scene
      const animations = gltf.animations

      // Crear 4 clones del modelo original[cite: 11]
      for (let i = 0; i < 4; i++) {
        const clone = SkeletonUtils.clone(originalScene)
        scene.add(clone)

        // Mixer independiente para cada clon[cite: 11]
        const mixer = new THREE.AnimationMixer(clone)

        if (animations.length > 0) {
          const action = mixer.clipAction(animations[0])
          action.play()
        }

        // Guardamos el clon, su mixer y su referencia en el arreglo[cite: 11]
        dancersArray.push({
          model: clone,
          mixer: mixer,
          position: clone.position,
        })
      }
    },
    undefined,
    (error) => {
      console.log('Error cargando bailando.glb:', error)
    },
  )

  // 2. Cargar la nueva nave espacial (/Nave1.glb)
  loader.load(
    '/Nave1.glb',
    (gltf) => {
      const nave = gltf.scene
      // Posición inicial en el espacio fuera del centro
      nave.position.set(2, 5, 0)
      nave.scale.set(0.005, 0.005, 0.005) // Ajusta si la escala del modelo es muy grande o pequeña

      scene.add(nave)

      // Si pasamos una función, enviamos la nave lista a main.js
      if (onNaveLoaded) {
        onNaveLoaded(nave)
      }
    },
    undefined,
    (error) => {
      console.log('Error cargando Nave1.glb:', error)
    },
  )
}
