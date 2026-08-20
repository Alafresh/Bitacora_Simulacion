import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

export const crearModelo = (scene) => {
  const loader = new GLTFLoader()

  const estado = { mixer: null }

  const dinoMaterials = { face: null, body: null }

  let animations = []

  // * Carga De Modelos y Obtener Materiales
  loader.load(
    '/bailando.glb',
    (gltf) => {
      console.log(gltf)
      scene.add(gltf.scene)
      // Mixer para animaciones
      estado.mixer = new THREE.AnimationMixer(gltf.scene)

      animations = gltf.animations
      // Animaciones
      if (animations.length > 0) {
        // const action = estado.mixer.clipAction(gltf.animations[2]);
        // action.play();
        modelParams.animUpdate()
      }

      gltf.scene.traverse((node) => {
        if (node.isMesh) {
          // Obtener materiales
          const materials = Array.isArray(node.material)
            ? node.material
            : [node.material]

          materials.forEach((mat) => {
            if (mat.name.includes('M_Face_01')) {
              //console.log(`Material: ${mat.name} | Textura: ${mat.map.name}`);
              dinoMaterials.face = mat
            }
            if (mat.name.includes('M_Dino_Shark_00')) {
              dinoMaterials.body = mat
            }
          })
        }
      })
    },
    () => {
      // console.log('progress');
    },
    (error) => {
      console.log('Error cargando..:', error)
    },
  )

  return estado
}
