import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

/**
 * House
 */
const house = new THREE.Group()
scene.add(house) 

const houseBase = new THREE.Mesh(
    new THREE.BoxGeometry(4, 3.2, 4),
    new THREE.MeshStandardMaterial({color: "#b08968"})
)
//raise the walls above the floor
houseBase.position.y = houseBase.geometry.parameters.height * 0.5
house.add(houseBase)

const roof = new THREE.Mesh(
    new THREE.ConeBufferGeometry(3.5, 1.5, 4),
    new THREE.MeshStandardMaterial({color: "#9c6644"})
)
roof.position.y = houseBase.geometry.parameters.height + (roof.geometry.parameters.height * 0.5)
roof.rotation.y = Math.PI * 0.25 //rotate quarter of a turn
house.add(roof)

const door = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1.5, 2.3),
    new THREE.MeshStandardMaterial({color: "#9c6644"})
)
door.position.z = (houseBase.geometry.parameters.width * 0.5) + 0.01
door.position.y = door.geometry.parameters.height * 0.5
house.add(door)

//Bushes - we create one geometry and one material and reuse them for all the bushes in our scene
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const BushMaterial = new THREE.MeshStandardMaterial({color: "#3d7d00"})

const bush1 = new THREE.Mesh(bushGeometry, BushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(1.066, 0.399, 2.241)

const bush2 = new THREE.Mesh(bushGeometry, BushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.608, 0.182, 2.132)


const bush3 = new THREE.Mesh(bushGeometry, BushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-1, 0.29, 2.133)


const bush4 = new THREE.Mesh(bushGeometry, BushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-1.33, 0.074, 2.35)
gui.add(bush4.position, "x").min(- 5).max(5).step(0.001)
gui.add(bush4.position, "y").min(- 5).max(5).step(0.001)
gui.add(bush4.position, "z").min(- 5).max(5).step(0.001)

house.add(bush1, bush2, bush3, bush4)


//Graveyard - loop and place randomly
const graveyard = new THREE.Group()
scene.add(graveyard)

const graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({color: "#6c757d"})

for (let i = 0; i < 50; i++) {
    const grave = new THREE.Mesh(
        graveGeometry,
        graveMaterial
    )

    //create full circle
    const angle = Math.random() * (Math.PI * 2) 
    const radius = 3.4 + Math.random() * 6.5

    
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
    new THREE.MeshStandardMaterial({ color: '#a9c388' })
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001).name("AmbientLight intensity")
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#ffffff', 0.5)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001).name("MoonLight intensity")
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

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
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()