import * as THREE from 'three'
const textureLoader = new THREE.TextureLoader()

const mossColorTexture = textureLoader.load('/textures/moss/color.jpg')
const mossAmbientOcclusionTexture = textureLoader.load('/textures/moss/ambientOcclusion.jpg')
const mossNormalTexture = textureLoader.load('/textures/moss/normal.jpg')
const mossRoughnessTexture = textureLoader.load('/textures/moss/roughness.jpg')
const mossHeightTexture = textureLoader.load('/textures/moss/displacement.jpg')

export {
    mossColorTexture,
    mossAmbientOcclusionTexture,
    mossNormalTexture,
    mossRoughnessTexture,
    mossHeightTexture
}