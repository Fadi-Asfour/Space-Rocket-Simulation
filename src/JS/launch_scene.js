import * as THREE from 'three'
import { DoubleSide } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as Parts from './Parts'


export function drawEarth() {
    const loadingManager = new THREE.LoadingManager()

    const textureLoader = new THREE.TextureLoader(loadingManager)
    const colorTexture = textureLoader.load(Parts.getIp() + '/images/earth.jpg',
    )
    const sphere = new THREE.SphereBufferGeometry(6371000, 64, 32)
    //console.log(sphere.attributes.uv)
    const spherematerial = new THREE.MeshBasicMaterial({
        map: colorTexture,
    })
    const earth = new THREE.Mesh(sphere, spherematerial)
    earth.position.y = -6371002
    //earth.rotation.z = Math.PI / 4
    const LaunchArea = new THREE.Group()
    LaunchArea.add(earth)

    //LaunchArea.name = 'LaunchArea'
    return LaunchArea
}

export function calcFire(initialThrust, currentThrust) {
    return currentThrust / initialThrust
}


