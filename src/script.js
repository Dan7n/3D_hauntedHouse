import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'


/**
 * Base
 */
// Debug
const gui = new dat.GUI()
gui.close();
dat.GUI.toggleHide();




// Canvas
const canvas = document.querySelector('canvas.webgl')


// Scene
const scene = new THREE.Scene()

//Fog
const fog = new THREE.Fog("#2b2d42", 0.5, 13)
scene.fog = fog


/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

//wood
const roofColorTexture = textureLoader.load("./textures/wood/color.jpg")

//door textures
import {
    doorColorTexture,
    doorAlphaTexture,
    doorAmbientOcclusionTexture,
    doorHeightTexture,
    doorNormalTexture,
    doorMetalnessTexture,
    doorRoughnessTexture
} from "./textures/door"

//brick textures
import {
    bricksColorTexture,
    bricksAmbientOcclusionTexture,
    bricksNormalTexture,
    bricksRoughnessTexture
} from "./textures/bricks"


//grass textures 
import {grassColorTexture,
    grassAmbientOcclusionTexture,
    grassNormalTexture,
    grassRoughnessTexture} from "./textures/grass"

//moss textures for the bushes
import {
    mossColorTexture,
    mossAmbientOcclusionTexture,
    mossNormalTexture,
    mossRoughnessTexture,
    mossHeightTexture
} from "./textures/moss"

//rock texture for the tombstomes
import {
    rocksColorTexture, rocksRoughnessTexture, rockHeightTexture
} from "./textures/rock"



//ghost lights
const ghost1 = new THREE.PointLight('#ff00ff', 1.2, 3)

const ghost2 = new THREE.PointLight('#00ffff', 1.2, 3)

const ghost3 = new THREE.PointLight('#ffff00', 1.2, 3)
scene.add(ghost1, ghost2, ghost3)/**
 * House
 */
const house = new THREE.Group()
scene.add(house) 

const houseBase = new THREE.Mesh(
    new THREE.BoxGeometry(4, 3.2, 4),
    new THREE.MeshStandardMaterial({
        map: bricksColorTexture,
        aoMap: bricksAmbientOcclusionTexture,
        aoMapIntensity: 4,
        normalMap: bricksNormalTexture,
        roughnessMap: bricksRoughnessTexture
    })
)
houseBase.castShadow = true
houseBase.geometry.setAttribute(
    "uv2",
    new THREE.Float32BufferAttribute(houseBase.geometry.attributes.uv.array, 2))

//raise the walls above the floor
houseBase.position.y = houseBase.geometry.parameters.height * 0.5
house.add(houseBase)

const roof = new THREE.Mesh(
    new THREE.ConeBufferGeometry(3.5, 1.5, 4),
    new THREE.MeshStandardMaterial({
        color: "#6D472F",
        map: roofColorTexture
})
)
roof.position.y = houseBase.geometry.parameters.height + (roof.geometry.parameters.height * 0.5)
roof.rotation.y = Math.PI * 0.25 //rotate quarter of a turn
house.add(roof)

const door = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2, 2.5, 80, 80),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        aoMapIntensity: 2,
        displacementMap: doorHeightTexture, //heighs and lows of the mesh
        displacementScale: 0.2,
        normalMap: doorNormalTexture, //adds details to the door
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture
    })
)

door.geometry.setAttribute(
    "uv2",
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
)


door.position.z = (houseBase.geometry.parameters.width * 0.5) + 0.01
door.position.y = door.geometry.parameters.height * 0.5 - 0.1
house.add(door)

//Bushes - we create one geometry and one material and reuse them for all the bushes in our scene
const bushGeometry = new THREE.SphereGeometry(1, 20, 20)
const bushMaterial = new THREE.MeshStandardMaterial({
    map: mossColorTexture,
    aoMap: mossAmbientOcclusionTexture,
    aoMapIntensity: 1,
    normalMap: mossNormalTexture,
    roughnessMap: mossRoughnessTexture,
    displacementMap: mossHeightTexture
})
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.4, 0.4, 0.4)
bush1.position.set(1.066, 0.399, 2.241)
bush1.receiveShadow = true
bush1.geometry.setAttribute(
    "uv2",
    new THREE.Float32BufferAttribute(bush1.geometry.attributes.uv.array, 2)
)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.608, 0.182, 2.132)
bush2.castShadow = true
bush2.geometry.setAttribute(
    "uv2",
    new THREE.Float32BufferAttribute(bush2.geometry.attributes.uv.array, 2)
)


const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.3, 0.3, 0.3)
bush3.position.set(-1, 0.29, 2.133)
bush3.castShadow = true
bush3.geometry.setAttribute(
    "uv2",
    new THREE.Float32BufferAttribute(bush3.geometry.attributes.uv.array, 2)
)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.1, 0.1, 0.1)
bush4.position.set(-1.33, 0.074, 2.35)
bush4.geometry.setAttribute(
    "uv2",
    new THREE.Float32BufferAttribute(bush4.geometry.attributes.uv.array, 2)
)

house.add(bush1, bush3, bush4)


//Graveyard - loop and place randomly
const graveyard = new THREE.Group()
scene.add(graveyard)

const graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({
    map: rocksColorTexture,
    roughnessMap: rocksRoughnessTexture,
})

for (let i = 0; i < 60; i++) {
    const grave = new THREE.Mesh(
        graveGeometry,
        graveMaterial
    )

    //create full circle
    const angle = Math.random() * (Math.PI * 2) 
    const radius = 3.4 + Math.random() * 6.5

    grave.castShadow = true
    
    const x = Math.sin(angle) * radius
    const y = grave.geometry.parameters.height * 0.5
    const z = Math.cos(angle) * radius

    grave.position.set(x, y, z)
    grave.rotation.z = (Math.random() - 0.5) * 0.35
    grave.rotation.y = (Math.random() - 0.5) * 0.35
    grave.position.y = grave.position.y
    graveyard.add(grave)
}

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ 
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        aoMapIntensity: 3,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture
    })
)
floor.geometry.setAttribute(
    "uv2",
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
)
floor.receiveShadow = true
console.log(floor.receiveShadow)



floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001).name("AmbientLight intensity")
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d', 0.2)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001).name("MoonLight intensity")

scene.add(moonLight)

const doorLight = new THREE.PointLight("#ff7d46", 1.2, 0, 2)
scene.add(doorLight)
const lightHelper = new THREE.PointLightHelper(doorLight)

doorLight.position.set(0.074, 3.217, 2.783)



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4.188
camera.position.y = 2.465
camera.position.z = 7.902
scene.add(camera)

gui.add(camera.position, "x").min(-10).max(10).step(0.001)
gui.add(camera.position, "y").min(-10).max(10).step(0.001)
gui.add(camera.position, "z").min(-10).max(10).step(0.001)


// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor("#2b2d42")

renderer.shadowMap.type = THREE.PCFSoftShadowMap

//Shadows
renderer.shadowMap.enabled = true
moonLight.castShadow = true
doorLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

moonLight.shadow.mapSize.width = 256
moonLight.shadow.mapSize.height = 256
moonLight.shadow.camera.far = 15

// ...
doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

// ...
ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7

// ...
ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7

// ...
ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{


    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    //animate ghosts
    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.x = Math.cos(ghost1Angle) * 7
    ghost1.position.z = Math.sin(ghost1Angle) * 7
    ghost1.position.y = Math.sin(elapsedTime * 3)

    const ghost2Angle = - elapsedTime * 0.32
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.sin(elapsedTime * 2.1) + Math.sin(elapsedTime * 1.2)

    const ghost3Angle = - elapsedTime * 0.134
    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.42))
    ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.3))
    ghost3.position.y = Math.sin(elapsedTime * 3) + Math.sin(elapsedTime * 2.34)



    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()