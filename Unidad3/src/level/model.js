import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js'

export const crearModelo = (scene, dancersArray, navesArray) => {
  const loader = new GLTFLoader()

  // 1. Cargar las 4 bailarinas (/bailando.glb)[cite: 11]
  loader.load(
    '/bailando.glb',
    (gltf) => {
      const originalScene = gltf.scene
      const animations = gltf.animations

      for (let i = 0; i < 4; i++) {
        const clone = SkeletonUtils.clone(originalScene)
        scene.add(clone)

        const mixer = new THREE.AnimationMixer(clone)
        if (animations.length > 0) {
          const action = mixer.clipAction(animations[0])
          action.play()
        }

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

  // 2. Cargar y clonar las 4 naves (/Nave1.glb)
  loader.load(
    '/Nave1.glb',
    (gltf) => {
      const originalNave = gltf.scene

      for (let i = 0; i < 4; i++) {
        const naveClone = SkeletonUtils.clone(originalNave)
        naveClone.scale.set(0.004, 0.004, 0.004) // Ajusta la escala si sigue muy grande/pequeña

        // Asegurar el espacio de color correcto en WebGPU
        naveClone.traverse((child) => {
          if (child.isMesh && child.material) {
            if (child.material.map)
              child.material.map.colorSpace = THREE.SRGBColorSpace
            if (child.material.emissiveMap)
              child.material.emissiveMap.colorSpace = THREE.SRGBColorSpace
            child.material.needsUpdate = true
          }
        })

        scene.add(naveClone)
        navesArray.push(naveClone)
      }
    },
    undefined,
    (error) => {
      console.log('Error cargando Nave1.glb:', error)
    },
  )
}
