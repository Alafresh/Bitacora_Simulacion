import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
// NUEVO: Importamos SkeletonUtils para clonar modelos animados
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js'

export const crearModelo = (scene, dancersArray) => {
  const loader = new GLTFLoader()

  loader.load(
    '/bailando.glb',
    (gltf) => {
      const originalScene = gltf.scene
      const animations = gltf.animations

      // Crear 4 clones del modelo original
      for (let i = 0; i < 4; i++) {
        const clone = SkeletonUtils.clone(originalScene)
        scene.add(clone)

        // Mixer independiente para cada clon
        const mixer = new THREE.AnimationMixer(clone)

        if (animations.length > 0) {
          const action = mixer.clipAction(animations[0])
          action.play()
        }

        // Guardamos el clon, su mixer y su referencia de posición en el arreglo
        dancersArray.push({
          model: clone,
          mixer: mixer,
          position: clone.position,
        })
      }
    },
    undefined,
    (error) => {
      console.log('Error cargando..:', error)
    },
  )
}
