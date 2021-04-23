import * as THREE from 'three'
const textureLoader = new THREE.TextureLoader()

const rocksColorTexture = textureLoader.load('/textures/rock/color.jpg')
const rocksRoughnessTexture = textureLoader.load('/textures/rock/roughness.jpg')
const rockHeightTexture = textureLoader.load('/textures/rock/displacement.jpg')

export {
    rocksColorTexture, rocksRoughnessTexture, rockHeightTexture
}