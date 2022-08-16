import "./style.css"
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';
import * as dat from 'dat.gui';
import gsap from "gsap";
import { RoundedBoxBufferGeometry } from 'three/examples/jsm/geometries/RoundedBoxBufferGeometry.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as Parts from './JS/Parts'
import * as Physics from './JS/physics'
import { Vector_Addition, Y_Projection } from "./JS/Vectors";
import { AxesHelper, Group, Clock, Mesh, Vector3 } from "three";
import * as Lscene from './JS/launch_scene'
/////////////////
const canvas = document.querySelector('.webgl')  //fetch data from dom (html file)

const rocket = new THREE.Group()
//rocket.position.y = -3
const ip = Parts.getIp()
var frontFinOption = null

//Scene


const scene = new THREE.Scene()

//some lights
var light2 = new THREE.DirectionalLight(0x999999);
var light = new THREE.HemisphereLight('white', 'green', 1);
light2.position.set(1, 2, 3).normalize();

var light3 = new THREE.DirectionalLight(0x999999);
var light33 = new THREE.HemisphereLight('white', 'green', 1);
light3.position.set(1, 2, -3).normalize();
scene.add((light3, light33))






// var launchingPad = Lscene.drawLaunchingPad()
// scene.add(launchingPad)

//Plane
// const grassTexture = new THREE.TextureLoader().load(ip + '/images/grass.jpg')
// const planeGeometry = new THREE.BoxGeometry(150, 75, 1)
// const planeMaterial = new THREE.MeshBasicMaterial({ map: grassTexture })
// const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
// planeMesh.rotation.x = Math.PI * -0.5
// planeMesh.position.y = -0.5
// //scene.add(planeMesh)
//Plane
var scale = 5


scene.add(rocket)
//Earth & LaunchPad

// new Parts.LaunchArea()
var earth = Lscene.drawEarth()

rocket.position.y = 0.2
// rocket.scale.y = 2
// rocket.scale.z = 2
// rocket.scale.x = 2

var pad = new THREE.Group()
const gltfLoader = new GLTFLoader()
gltfLoader.load(
    Parts.getIp() + '/models/station/scene.gltf',
    (gltf, XZScale, Yscale) => {
        gltf.scene.scale.x = 0.5
        gltf.scene.scale.z = 0.5
        gltf.scene.scale.y = 0.3
        gltf.scene.position.set(0, 6.8, -11)
        gltf.scene.name = 'Pad'
        pad.add(gltf.scene)
    },

)

scene.add(earth)
scene.add(pad)


let firemixer = null
let flame
var fireaction
gltfLoader.load(
    Parts.getIp() + '/models/fire2/scene.gltf',
    (gltf) => {
        firemixer = new THREE.AnimationMixer(gltf.scene)
        const action = firemixer.clipAction(gltf.animations[0])
        action.play()
        fireaction = action
        action.setDuration(0.3)
        gltf.scene.scale.set(0.2, 0.2, 0.2);
        gltf.scene.rotation.x = Math.PI
        // gltf.scene.
        flame = gltf.scene
        scene.add(flame)
        flame.position.set(rocket.position.x, rocket.position.y + 2, rocket.position.z)
        // fire.add(gltf.scene)
    },

)


function setFireStrength(strength) {
    if (strength == 0) {
        flame.visible = false
        //flame.scale.set(1, 1, 1)
    }
    else {
        flame.visible = true
        //flame.scale.set(strength * 10, 1, 1)
    }

    //fireaction.setDuration(1.5 - strength)
}


//Engine Options
var engineParameters = {
    'width': 1,
    'height': 1,
    'scale': 4,
    'yscale': 0,
    'weight': 1,
    'thrust': 0,
    'mass': 50,
    'engineType': 'Engine-1',
    'added': false,
    'add': () => {
        switch (engineParameters.engineType) {
            case 'Engine-1':
                if (rocket.getObjectByName('Engine') != null)
                    rocket.remove(rocket.getObjectByName('Engine'))
                var engine1 = new Parts.Engine1()
                engine1.name = 'Engine'
                engine1.scale.set(engineParameters.width / scale, engineParameters.height / scale, engineParameters.width / scale)
                engine1.position.y = engineParameters.height / engineParameters.scale
                engineParameters.yscale = engine1.scale.y
                engineParameters.added = true
                //Added
                //console.log(earth.getObjectByName('Pad'));
                pad.scale.x = (engineParameters.width / scale) * 2.5
                pad.scale.z = (engineParameters.width / scale) * 2.5
                pad.scale.y = (engineParameters.height / scale) * 2.5
                //
                if (rocket.getObjectByName('Body') != null) {
                    bodyParameters.y = engine1.position.y
                    rocket.getObjectByName('Body').position.y = bodyParameters.y + (bodyParameters.height * 0.5) + (engineParameters.height / engineParameters.scale) + (engineParameters.yscale) * 1.5
                    bodyParameters.y = rocket.getObjectByName('Body').position.y
                }
                if (rocket.getObjectByName('Nose') != null) {
                    if (noseParameters.noseType == 'conical') {
                        rocket.getObjectByName('Nose').position.y = bodyParameters.y + (bodyParameters.height / 2) + (noseParameters.height / 2)
                    } else if (noseParameters.noseType == 'ogiv') {
                        rocket.getObjectByName('Nose').position.y = bodyParameters.y + (bodyParameters.height / 2) + ((noseParameters.height / 4) / 1.85) + 0.08
                    }
                    else {
                        rocket.getObjectByName('Nose').position.y = bodyParameters.y + (bodyParameters.height / 2) + ((noseParameters.height / 2) / 2) + 0.08
                    }
                    noseParameters.y = rocket.getObjectByName('Nose').position.y
                }


                if (rocket.getObjectByName('Fin-1') != null)
                    rocket.getObjectByName('Fin-1').position.y = bodyParameters.y - (bodyParameters.height * 0.3)
                if (rocket.getObjectByName('Fin-2') != null)
                    rocket.getObjectByName('Fin-2').position.y = bodyParameters.y - (bodyParameters.height * 0.3)
                if (rocket.getObjectByName('Fin-3') != null)
                    rocket.getObjectByName('Fin-3').position.y = bodyParameters.y - (bodyParameters.height * 0.3)
                if (rocket.getObjectByName('Fin-4') != null)
                    rocket.getObjectByName('Fin-4').position.y = bodyParameters.y - (bodyParameters.height * 0.3)


                rocket.add(engine1)
                break
            case 'Engine-2':
                if (rocket.getObjectByName('Engine') != null)
                    rocket.remove(rocket.getObjectByName('Engine'))
                var engine2 = new Parts.Engine2()
                engine2.name = 'Engine'
                engine2.scale.set(engineParameters.width / scale, engineParameters.height / scale, engineParameters.width / scale)
                engine2.position.y = engineParameters.height / engineParameters.scale
                engineParameters.yscale = engine2.scale.y
                engineParameters.added = true
                //Added
                pad.scale.x = (engineParameters.width / scale) * 2.5
                pad.scale.z = (engineParameters.width / scale) * 2.5
                pad.scale.y = (engineParameters.width / scale) * 2.5
                //
                if (rocket.getObjectByName('Body') != null) {
                    bodyParameters.y = engine2.position.y
                    rocket.getObjectByName('Body').position.y = bodyParameters.y + (bodyParameters.height * 0.5) + (engineParameters.height / engineParameters.scale) + (engineParameters.yscale) * 1.5
                    bodyParameters.y = rocket.getObjectByName('Body').position.y
                }
                if (rocket.getObjectByName('Nose') != null) {
                    if (noseParameters.noseType == 'conical') {
                        rocket.getObjectByName('Nose').position.y = bodyParameters.y + (bodyParameters.height / 2) + (noseParameters.height / 2)
                    } else if (noseParameters.noseType == 'ogiv') {
                        rocket.getObjectByName('Nose').position.y = bodyParameters.y + (bodyParameters.height / 2) + ((noseParameters.height / 4) / 1.85) + 0.08
                    }
                    else {
                        rocket.getObjectByName('Nose').position.y = bodyParameters.y + (bodyParameters.height / 2) + ((noseParameters.height / 2) / 2) + 0.08
                    }
                    noseParameters.y = rocket.getObjectByName('Nose').position.y
                }
                if (rocket.getObjectByName('Fin-1') != null)
                    rocket.getObjectByName('Fin-1').position.y = bodyParameters.y - (bodyParameters.height * 0.3)
                if (rocket.getObjectByName('Fin-2') != null)
                    rocket.getObjectByName('Fin-2').position.y = bodyParameters.y - (bodyParameters.height * 0.3)
                if (rocket.getObjectByName('Fin-3') != null)
                    rocket.getObjectByName('Fin-3').position.y = bodyParameters.y - (bodyParameters.height * 0.3)
                if (rocket.getObjectByName('Fin-4') != null)
                    rocket.getObjectByName('Fin-4').position.y = bodyParameters.y - (bodyParameters.height * 0.3)
                rocket.add(engine2)

                break
            default:
                alert('Please add engine type first')
        }

        console.log('Engine Wegiht ' + Physics.getEngineMass(engineParameters.width, engineParameters.height, engineParameters.mass)
        );
    }
}



//Body Parameters
var bodyParameters = {
    'width': 0.5,
    'height': 2,
    'newWidth': 0,
    'newHeight': 0,
    'weight': 200,
    'massPerM': 50,
    'added': false,
    'y': 0,
    'add': () => {
        if (bodyParameters.added)
            rocket.remove(rocket.getObjectByName('Body'))
        var body = new Parts.FRTube(bodyParameters.height, bodyParameters.width)
        bodyParameters.weight = Physics.getBodyWeight(bodyParameters.height, bodyParameters.width, bodyParameters.massPerM)
        console.log('Body Weight: ' + bodyParameters.weight);
        body.name = 'Body'
        bodyParameters.y = rocket.getObjectByName('Engine').position.y
        body.position.y = bodyParameters.y + (bodyParameters.height * 0.5) + (engineParameters.height / engineParameters.scale) + (engineParameters.yscale) * 1.5
        bodyParameters.y = body.position.y
        //Added
        pad.scale.x = (bodyParameters.width / scale) * 4
        pad.scale.z = (bodyParameters.width / scale) * 4
        pad.scale.y = (bodyParameters.height / scale) * 1.5

        // earth.getObjectByName('Pad').scale.x = (bodyParameters.width / scale) * 0.7
        // earth.getObjectByName('Pad').scale.z = (bodyParameters.width / scale) * 0.7
        // earth.getObjectByName('Pad').scale.y = (bodyParameters.height / scale) * 0.7
        //
        if (rocket.getObjectByName('Nose') != null) {
            if (noseParameters.noseType == 'conical') {
                noseParameters.add()
                //rocket.getObjectByName('Nose').position.y = bodyParameters.y + (bodyParameters.height / 2) + (noseParameters.height / 2)
            } else if (noseParameters.noseType == 'ogiv') {
                noseParameters.add()
                //rocket.getObjectByName('Nose').position.y = bodyParameters.y + (bodyParameters.height / 2) + ((noseParameters.height / 4) / 1.85) + 0.08
            }
            else {
                noseParameters.add()
                //rocket.getObjectByName('Nose').position.y = bodyParameters.y + (bodyParameters.height / 2) + ((noseParameters.height / 2) / 2) + 0.08
            }
            noseParameters.y = rocket.getObjectByName('Nose').position.y
            if (rocket.getObjectByName('Fin-1') != null) {
                noseParameters.add()
            }
        }
        if (finsParameters.added) {

            for (let i = 0; i < 4; i++) {
                switch (i) {
                    case 0:
                        if (rocket.getObjectByName('Fin-1') != null) {
                            if (finsParameters.finType == 'Fin-1')
                                rocket.getObjectByName('Fin-1').position.x = bodyParameters.width + bodyParameters.width * 0.25
                            else
                                rocket.getObjectByName('Fin-1').position.x = bodyParameters.width
                            rocket.getObjectByName('Fin-1').position.y = bodyParameters.y / 3
                        }
                        continue
                    case 1:
                        if (rocket.getObjectByName('Fin-2') != null) {
                            if (finsParameters.finType == 'Fin-1')
                                rocket.getObjectByName('Fin-2').position.x = (bodyParameters.width + bodyParameters.width * 0.25) * -1
                            else
                                rocket.getObjectByName('Fin-2').position.x = bodyParameters.width * -1
                            rocket.getObjectByName('Fin-2').position.y = bodyParameters.y / 3
                        }
                        continue
                    case 2:
                        if (rocket.getObjectByName('Fin-3') != null) {
                            if (finsParameters.finType == 'Fin-1')
                                rocket.getObjectByName('Fin-3').position.z = (bodyParameters.width + bodyParameters.width * 0.25) * -1
                            else
                                rocket.getObjectByName('Fin-3').position.z = bodyParameters.width * -1
                            rocket.getObjectByName('Fin-3').position.y = bodyParameters.y / 3

                        }
                        continue
                    case 3:
                        if (rocket.getObjectByName('Fin-4') != null) {
                            if (finsParameters.finType == 'Fin-1')
                                rocket.getObjectByName('Fin-4').position.z = bodyParameters.width + bodyParameters.width * 0.25
                            else
                                rocket.getObjectByName('Fin-4').position.z = bodyParameters.width
                            rocket.getObjectByName('Fin-4').position.y = bodyParameters.y / 3
                        }
                        continue


                }
            }
        }
        rocket.add(body)
        bodyParameters.added = true
    }
}



//Nose Parameters
var noseParameters = {
    'height': 1,
    'noseType': 'conical',
    'mass': 50,
    'weight': 0,
    'y': 0,
    'added': false,
    'add': () => {

        switch (noseParameters.noseType) {
            case 'conical':
                console.log(noseParameters.height);
                if (rocket.getObjectByName('Nose') != null)
                    rocket.remove(rocket.getObjectByName('Nose'))
                var nose = new Parts.ConicalNose(bodyParameters.width, noseParameters.height)
                nose.name = 'Nose'
                nose.position.y = bodyParameters.y + (bodyParameters.height / 2) + (noseParameters.height / 2)
                noseParameters.y = nose.position.y
                console.log(nose.position.y);
                rocket.add(nose)
                noseParameters.added = true
                noseParameters.noseType = 'conical'
                break
            case 'ogiv':
                if (rocket.getObjectByName('Nose') != null)
                    rocket.remove(rocket.getObjectByName('Nose'))
                var nose = new Parts.OgiveNose(bodyParameters.width, noseParameters.height)
                nose.name = 'Nose'
                nose.position.y = bodyParameters.y + (bodyParameters.height / 2) + (noseParameters.height / 2)
                noseParameters.y = nose.position.y
                rocket.add(nose)
                noseParameters.added = true
                noseParameters.noseType = 'ogiv'
                break
            case 'parabolic':
                if (rocket.getObjectByName('Nose') != null)
                    rocket.remove(rocket.getObjectByName('Nose'))
                var nose = new Parts.ParabolicNose(bodyParameters.width, noseParameters.height)
                nose.name = 'Nose'
                nose.position.y = bodyParameters.y + (bodyParameters.height / 2) + (noseParameters.height / 2)
                noseParameters.y = nose.position.y
                rocket.add(nose)
                noseParameters.added = true
                noseParameters.noseType = 'parabolic'
                break
        }

        console.log(Physics.getNoseMass(noseParameters.height, bodyParameters.width, noseParameters.mass, noseParameters.noseType)
        );

    }
}
var angle = 0
//Fins Parameters
var finsParameters = {
    'height': 1,
    'width': 0.5,
    'finsNumber': 2,
    'mass': 50,
    'added': false,
    'front': false,
    'mass': 50,
    'finType': 'Fin-1',
    'add': () => {

        if (finsParameters.added) {
            rocket.remove(rocket.getObjectByName('Fin-1'))
            rocket.remove(rocket.getObjectByName('Fin-2'))
            rocket.remove(rocket.getObjectByName('Fin-3'))
            rocket.remove(rocket.getObjectByName('Fin-4'))
        }
        switch (finsParameters.finType) {
            case 'Fin-1':
                for (let i = 0; i < finsParameters.finsNumber; i++) {
                    finsParameters.added = true
                    switch (i) {
                        case 0:
                            var fin0 = new Parts.Fin1(finsParameters.width, finsParameters.height)
                            fin0.name = 'Fin-1'
                            fin0.position.x = (finsParameters.width * 0.5) + bodyParameters.width
                            fin0.position.y = bodyParameters.y - (bodyParameters.height * 0.3)
                            fin0.scale.y = 0.5
                            pad.scale.x = (finsParameters.width / scale) * 4.5
                            pad.scale.z = (finsParameters.width / scale) * 4.5
                            pad.scale.y = (finsParameters.height / scale) * 3
                            rocket.add(fin0)
                            continue
                        case 1:
                            var fin1 = new Parts.Fin1(finsParameters.width, finsParameters.height)
                            fin1.name = 'Fin-2'
                            fin1.position.x = ((finsParameters.width * 0.5) + bodyParameters.width) * -1
                            fin1.rotation.y = Math.PI
                            fin1.position.y = bodyParameters.y - (bodyParameters.height * 0.3)
                            fin1.scale.y = 0.5
                            rocket.add(fin1)
                            continue
                        case 2:
                            var fin2 = new Parts.Fin1(finsParameters.width, finsParameters.height)
                            fin2.name = 'Fin-3'
                            fin2.position.z = ((finsParameters.width * 0.5) + bodyParameters.width) * -1
                            fin2.position.y = bodyParameters.y - (bodyParameters.height * 0.3)
                            fin2.rotation.y = Math.PI / 2
                            fin2.scale.y = 0.5
                            rocket.add(fin2)
                            continue
                        case 3:
                            var fin3 = new Parts.Fin1(finsParameters.width, finsParameters.height)
                            fin3.name = 'Fin-4'
                            fin3.position.z = (finsParameters.width * 0.5) + bodyParameters.width
                            fin3.position.y = bodyParameters.y - (bodyParameters.height * 0.3)
                            fin3.rotation.y = -Math.PI / 2
                            fin3.scale.y = 0.5
                            rocket.add(fin3)
                            continue

                    }
                }
                break
            //Fin-2
            case 'Fin-2':
                for (let i = 0; i < finsParameters.finsNumber; i++) {
                    finsParameters.added = true
                    switch (i) {
                        case 0:
                            var fin0 = new Parts.Fin2(finsParameters.width, finsParameters.height)
                            fin0.name = 'Fin-1'
                            fin0.position.x = bodyParameters.width
                            fin0.position.y = bodyParameters.y - (bodyParameters.height * 0.3)
                            fin0.scale.y = 0.5
                            pad.scale.x = (finsParameters.width / scale) * 4.5
                            pad.scale.z = (finsParameters.width / scale) * 4.5
                            pad.scale.y = (finsParameters.height / scale) * 3
                            rocket.add(fin0)
                            continue
                        case 1:
                            var fin1 = new Parts.Fin2(finsParameters.width, finsParameters.height)
                            fin1.name = 'Fin-2'
                            fin1.position.x = bodyParameters.width * -1
                            fin1.rotation.y = Math.PI
                            fin1.position.y = bodyParameters.y - (bodyParameters.height * 0.3)
                            fin1.scale.y = 0.5
                            rocket.add(fin1)
                            continue
                        case 2:
                            var fin2 = new Parts.Fin2(finsParameters.width, finsParameters.height)
                            fin2.name = 'Fin-3'
                            fin2.position.z = bodyParameters.width * -1
                            fin2.position.y = bodyParameters.y - (bodyParameters.height * 0.3)
                            fin2.rotation.y = Math.PI / 2
                            fin2.scale.y = 0.5
                            rocket.add(fin2)
                            continue
                        case 3:
                            var fin3 = new Parts.Fin2(finsParameters.width, finsParameters.height)
                            fin3.name = 'Fin-4'
                            fin3.position.z = bodyParameters.width
                            fin3.position.y = bodyParameters.y - (bodyParameters.height * 0.3)
                            fin3.rotation.y = -Math.PI / 2
                            fin3.scale.y = 0.5
                            rocket.add(fin3)
                            continue
                    }

                }
                break
        }

        if (finsParameters.finsNumber == 3) {
            if (frontFinOption != null) {
                finsOptions.remove(frontFinOption)
                frontFinOption = null
                finsParameters.front = false
            }
            frontFinOption = finsOptions.add(finsParameters, 'front').name('Front').onChange((value) => {
                if (value) {
                    if (finsParameters.finType == 'Fin-2') {
                        rocket.getObjectByName('Fin-3').position.z = bodyParameters.width
                        rocket.getObjectByName('Fin-3').rotation.y = -Math.PI / 2
                    }
                    else {
                        rocket.getObjectByName('Fin-3').position.z = (bodyParameters.width + bodyParameters.width * 0.25)
                        rocket.getObjectByName('Fin-3').rotation.y = -Math.PI / 2
                    }

                }
                else {
                    if (finsParameters.finType == 'Fin-2') {
                        rocket.getObjectByName('Fin-3').position.z = bodyParameters.width * -1
                        rocket.getObjectByName('Fin-3').rotation.y = Math.PI / 2
                    }
                    else {
                        rocket.getObjectByName('Fin-3').position.z = (bodyParameters.width + bodyParameters.width * 0.25) * -1
                        rocket.getObjectByName('Fin-3').rotation.y = Math.PI / 2
                    }

                }
            })
        }
        else {
            if (frontFinOption != null) {
                finsOptions.remove(frontFinOption)
                frontFinOption = null
                finsParameters.front = false
                finsParameters.front = false
            }
        }

    }
}




//Rocket Parameters
var rocketparameters = {
    'angle_of_attack': 90,
    'propellant_mass': 0,
    'payload_mass': 0,
    'mass_flow_rate': 0
}


//Base

const rocketBase = new Parts.RocketBase()

const gui = new dat.GUI();
gui.width = 400
const Options = gui.addFolder('Options')


const addObjects = Options.addFolder('Add Objects')
addObjects.open()
const objectsOptions = Options.addFolder('Objects Options')


var selectedParts = {
    'Engine': false,
    'Body': false,
    'Nose': false,
    'Fins': false,
    'Material': false
}

//Rocket_Material
var materialparameters = {
    'material': "",
    'density': 0,
    'added': false,
    'add': () => {
        switch (materialparameters.material) {
            case 'Titanium':
                if (rocket.getObjectByName('Material') != null)
                    rocket.remove(rocket.getObjectByName('Material'))
                materialparameters.material = "Titanium"
                materialparameters.density = 4420
                materialparameters.added = true
                break
            case 'Aluminium':
                if (rocket.getObjectByName('Material') != null)
                    rocket.remove(rocket.getObjectByName('Material'))
                materialparameters.material = "Aluminum"
                materialparameters.density = 2710
                materialparameters.added = true
                break
            default:
                alert('Please add Material type first')
        }
    }

}
addObjects.add(selectedParts, 'Material').onChange((value) => {
    if (value) {
        const materialoptions = objectsOptions.addFolder('Material')
        objectsOptions.open()
        materialoptions.open()
        materialoptions.add(materialparameters, 'material', { Titanium: "Titanium", Aluminium: "Aluminium" }).name('Material Type').onFinishChange((value) => {
            materialparameters.material = value
        })
        materialoptions.add(materialparameters, 'add').name('Add Material')
    }
    else {
        if (objectsOptions.__folders.Material != null)
            objectsOptions.removeFolder(objectsOptions.__folders.Material)
        materialparameters.added = false
    }
})


addObjects.add(selectedParts, 'Engine').onChange((value) => {
    if (value) {
        const engineOptions = objectsOptions.addFolder('Engine')
        objectsOptions.open()
        engineOptions.open()
        engineOptions.add(engineParameters, 'width', engineParameters.width, engineParameters.width + 9, 1).name('Width')
            .onFinishChange((value) => {
                engineParameters.width = value
            })
        engineOptions.add(engineParameters, 'height', engineParameters.height, engineParameters.height + 9, 1).name('Height')
            .onFinishChange((value) => {
                engineParameters.height = value
            })
        engineOptions.add(engineParameters, 'engineType', { Engine_1: 'Engine-1', Engine_2: 'Engine-2' }).name('Engine type').onFinishChange((value) => {
            engineParameters.engineType = value

        })
        engineOptions.add(engineParameters, 'mass', engineParameters.mass, engineParameters.mass + 450).name('Mass').name("Mass ( Kg/m³ )")
        engineOptions.add(engineParameters, 'add').name('Add Engine')
    }
    else {
        if (objectsOptions.__folders.Engine != null)
            objectsOptions.removeFolder(objectsOptions.__folders.Engine)
        if (rocket.getObjectByName('Engine'))
            rocket.remove(rocket.getObjectByName('Engine'))
        engineParameters.added = false
    }
})

addObjects.add(selectedParts, 'Body').onChange((value) => {
    console.log(selectedParts.Engine);
    if (value && engineParameters.added == false) {
        selectedParts.Body = false
        alert('Please add enging first')
    }
    else if (value && engineParameters.added == true) {
        const bodyOptions = objectsOptions.addFolder('Body')
        objectsOptions.open()
        bodyOptions.open()
        bodyOptions.add(bodyParameters, 'width', bodyParameters.width, bodyParameters.width + 10, 0.5).name('Width')
            .onFinishChange((value) => {
                bodyParameters.width = value
            })
        bodyOptions.add(bodyParameters, 'height', bodyParameters.height, bodyParameters.height + 20, 1).name('Height')
            .onFinishChange((value) => {
                bodyParameters.height = value
            })

        bodyOptions.add(bodyParameters, 'massPerM', bodyParameters.weightperM, bodyParameters.weightperM + 400).name("Mass ( Kg/m³ )")
        bodyOptions.add(bodyParameters, 'add').name('Add body')
    }
    else {
        if (objectsOptions.__folders.Body != null)
            objectsOptions.removeFolder(objectsOptions.__folders.Body)
        if (rocket.getObjectByName('Body'))
            rocket.remove(rocket.getObjectByName('Body'))
        bodyParameters.added = false

    }
})
addObjects.add(selectedParts, 'Nose').onChange((value) => {
    if (value && engineParameters.added == false) {

        selectedParts.Nose = false
        alert('Please add enging first')

    } else if (value && bodyParameters.added == false) {
        selectedParts.Nose = false
        alert('Please add body first')
    }
    else if (value && engineParameters.added == true && bodyParameters.added == true) {
        const noseOptions = objectsOptions.addFolder('Nose')
        objectsOptions.open()
        noseOptions.open()
        noseOptions.add(noseParameters, 'height', noseParameters.height, noseParameters.height + 20, 1).name('Height').onChange((value) => { noseParameters.height = value })
        noseOptions.add(noseParameters, 'noseType', { Conical: 'conical', Ogiv: 'ogiv', Parabolic: 'parabolic' }).onFinishChange((value) => {
            noseParameters.noseType = value
        })
        noseOptions.add(noseParameters, 'mass', noseParameters.mass, noseParameters.mass + 450).name('Mass ( Kg/m³ )')

        noseOptions.add(noseParameters, 'add').name('Add nose')

    }
    else {
        if (objectsOptions.__folders.Nose != null)
            objectsOptions.removeFolder(objectsOptions.__folders.Nose)
        if (rocket.getObjectByName('Nose'))
            rocket.remove(rocket.getObjectByName('Nose'))
        noseParameters.added = false

    }
})
var finsOptions
addObjects.add(selectedParts, 'Fins').onChange((value) => {
    if (value && bodyParameters.added == false) {
        selectedParts.Fins = false
        alert('Please add body first')
    } else if (value && bodyParameters.added == true) {
        finsOptions = objectsOptions.addFolder('Fins')
        objectsOptions.open()
        finsOptions.open()
        finsOptions.add(finsParameters, 'width', finsParameters.width, finsParameters.width + 5, 0.5).name('Width').onFinishChange((value) => {
            finsParameters.width = value
        })
        finsOptions.add(finsParameters, 'height', finsParameters.height, finsParameters.height + 5, 0.5).name('Height').onFinishChange((value) => {
            finsParameters.height = value
        })
        finsOptions.add(finsParameters, 'finType', { Fin_1: 'Fin-1', Fin_2: 'Fin-2' }).onChange((value) => {
            finsParameters.finType = value
        }).name('Fins type')
        finsOptions.add(finsParameters, 'finsNumber', 2, 4, 1).name('Fins number').onChange((value) => {
            finsParameters.finsNumber = value

        })
        finsOptions.add(finsParameters, 'mass', finsParameters.mass, finsParameters.mass + 450).name('Mass ( Kg/m³ )')

        finsOptions.add(finsParameters, 'add').name('Add Fins')

    }
    else {
        if (objectsOptions.__folders.Fins != null)
            objectsOptions.removeFolder(objectsOptions.__folders.Fins)
        rocket.remove(rocket.getObjectByName('Fin-1'))
        rocket.remove(rocket.getObjectByName('Fin-2'))
        rocket.remove(rocket.getObjectByName('Fin-3'))
        rocket.remove(rocket.getObjectByName('Fin-4'))
    }
})


var isLaunched = false
const controlFunctions = {

    //Added
    'add_standard_rocket': () => {
        engineParameters.engineType = 'Engine-1'
        engineParameters.add()
        engineParameters.added = true

        bodyParameters.add()
        bodyParameters.added = true

        noseParameters.noseType = 'conical'
        noseParameters.add()
        noseParameters.added = true

        finsParameters.finType = 'Fin-1'
        finsParameters.add()
        finsParameters.added = true
    },
    'launch': () => {
        isLaunched = true
        Options.close()
    },
    'stop': () => {
        isLaunched = false
        Options.open()

    },
    // 'restart': () => {
    //     renderer.clear();
    //     // renderer.render(scene, camera);
    //     // renderer.clearDepth(); // optional
    //     // renderer.render(scene, camera);
    // },

}
addObjects.add(controlFunctions, 'add_standard_rocket').name('Add standard rocket')

//Added


//Physics

var physicsFolder = Options.addFolder('Physics')

physicsFolder.add(Physics.physicsOptions, 'Thrust', 0).name('Thrust ( Newton ) ').onChange(() => {
    Physics.physicsOptions.newThrust = Physics.physicsOptions.Thrust * (Physics.physicsOptions.throttle / 100)

})
//physicsFolder.add(Physics.physicsOptions, 'Velocity',).name('Velocity ( m/s ) ')
//physicsFolder.add(Physics.physicsOptions, 'Drag', 0)
physicsFolder.add(Physics.physicsOptions, 'Air Velocity', 0)
//physicsFolder.add(Physics.physicsOptions, 'Specific Impulse', 0)
// physicsFolder.add(Physics.physicsOptions, 'Exhaust Pressure', 0)
// physicsFolder.add(Physics.physicsOptions, 'Exhaust Velocity').name('Exhaust Velocity ( m/s ) ')
// physicsFolder.add(Physics.physicsOptions, 'Atmospheric Pressure', 0)
physicsFolder.add(Physics.physicsOptions, 'Angle of attack', 0).name(' Angle of attack ( degree ) ')
physicsFolder.add(Physics.physicsOptions, 'Payload mass', 0)
// physicsFolder.add(Physics.physicsOptions, 'Mass flow rate', 0)
physicsFolder.add(Physics.physicsOptions, 'Start gravity')
physicsFolder.add(Physics.physicsOptions, 'temp', -273, 273)
physicsFolder.add(Physics.physicsOptions, 'Lift Coefficient')
physicsFolder.add(Physics.physicsOptions, 'Drag Coeffiecient')

//physicsFolder.add(Physics.physicsOptions, 'Angle', -10, 10).name('Angle ( - Left | + Right ) ')




//Gas
var gases = physicsFolder.addFolder('Gas')

// gases.add(Physics.gasSpec, 'GasType',
//     { Petrol: 'petrol', Hydrogen: 'hydrogen', Kerosene: 'kerosene', Diesel: 'diesel' }).name('Gas Type')

//Rocket
gases.add(Physics.gasSpec, 'Specific Impulse', 0)
gases.add(Physics.gasSpec, 'Propellant mass', 0).name('Propellant mass ( kg ) ').onChange((value) => {
    Physics.gasSpec["Remain propellant mass"] = value
})

/////



const groupOptions = Options.addFolder('Group Options')
//groupOptions.open()
groupOptions.add(rocket.position, 'y', rocket.position.y, rocket.position.y + 20).name('Up-Down')
groupOptions.add(rocket.position, 'x', rocket.position.x - 20, rocket.position.x + 20).name('Left-Right')
groupOptions.add(rocket.position, 'z', rocket.position.z - 20, rocket.position.z + 20).name('Backward-Forward')

/*
groupOptions.add(rocket.scale, 'x', 0.5, rocket.scale.x + 5).onChange((value) => {
    rocket.scale.z = value
}).name('Width')
groupOptions.add(rocket.scale, 'y', 0.5, rocket.scale.y + 5).name('Height')

*/

const control = Options.addFolder('Control')
control.add(controlFunctions, 'launch').name('Launch')
control.add(controlFunctions, 'stop').name('Stop')
// control.add(controlFunctions, 'restart').name('Restart')

controlFunctions.add_standard_rocket()

//Sizes

const sizes = {
    width: window.innerWidth,

    height: window.innerHeight
}

//Resizing
window.addEventListener('resize', () => {
    //Update Sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    //Update Camera 
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    //Renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(window.devicePixelRatio >= 2 ? window.devicePixelRatio : 2)
    //renderer.sortObjects = false
})

//Fullscreen

var full_Screen = false
//fullScreen
function requestFullScreen(element) {
    // Supports most browsers and their versions.
    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

    if (requestMethod) {
        requestMethod.call(element);
        full_Screen = true
    }
    else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}
window.addEventListener('dblclick', (e) => {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
    var elem = document.body // Make the body go full screen.
    requestFullScreen(elem)
    if (full_Screen)
        if (document.exitFullscreen)
            document.exitFullscreen()
        else if (document.webkitExitFullscreen)
            document.exitFullscreen()
})
//endFullScreen

//Cursor 
const cursor = {
    x: 0,
    y: 0
}
window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = -(event.clientY / sizes.height - 0.5)

})


//Keyboard 

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 87) {
        if (Physics.physicsOptions.throttle != 100) {
            Physics.physicsOptions.throttle += 1;
            Physics.physicsOptions.newThrust = Physics.physicsOptions.Thrust * (Physics.physicsOptions.throttle / 100)
        }

    } else if (keyCode == 83) {
        if (Physics.physicsOptions.throttle != 0) {
            Physics.physicsOptions.throttle -= 1;
            Physics.physicsOptions.newThrust = Physics.physicsOptions.Thrust * (Physics.physicsOptions.throttle / 100)

        }
    }
    else if (keyCode == 76) {
        isLaunched = true
    }
    else if (keyCode == 32) {
        isLaunched = false
    }
    else if (keyCode == 82) {
        if (orbitControls.autoRotate == true)
            orbitControls.autoRotate = false
        else
            orbitControls.autoRotate = true
    } else if (keyCode == 37) {
        if (Physics.physicsOptions.Angle > -10)
            Physics.physicsOptions.Angle--
    } else if (keyCode == 39) {
        if (Physics.physicsOptions.Angle < 10)
            Physics.physicsOptions.Angle++
    }
};
// 


//Camera 
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000000000000000)
camera.position.z = 10
camera.position.y = rocket.position.y + 5



//Orbit Controls
const orbitControls = new OrbitControls(camera, canvas)
orbitControls.autoRotate = false
orbitControls.autoRotateSpeed = 5



//Renderer
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

scene.add(camera)
var oldPosition = rocket.position.y
//var weight = 20000
var newPosition = 0
var oldSpeed = 0




var center_of_gravity = { x: 0, y: 1, z: 0 }
var rocket_thrust = { x: 0, y: 10000, z: 0 }
var rocket_weight = { x: 0, y: -7350, z: 0 }
var empty_mass = 250
var propellant_mass = 500
var mass_flow_rate = 10
var accelaration
var rocket_speed
var current_position = center_of_gravity
var angle
var velocity
var time = 0
var segma_F = new Vector3()
var rocket_mass = 1
var gravity

//Added
var t = [];
var CurrentFPS = 0

// var frameSpeed = {
//     'speed': 1
// }

//Options.add(frameSpeed, 'speed', 0.1, 4).name('Simulation Speed')
//Added
let previousTime = 0
//new ParticleSystemDemo()
function tick(now) {

    rocket.getObjectByName('Engine').rotation.z = Physics.physicsOptions.Angle * (Math.PI / 180)
    //     console.log(rocket_weight.y)
    //     console.log(gravity)
    //     console.log( "")
    //     gravity = Physics.calcG(center_of_gravity.y)
    //     rocket_weight.y = Physics.getRocketWeight(rocket_mass, gravity)
    //     segma_F = Vector_Addition(rocket_thrust,rocket_weight)
    //     if(rocket_mass > 0)
    // {    rocket_mass = empty_mass + (propellant_mass - (mass_flow_rate *time))}
    //     accelaration = Y_Projection(center_of_gravity,segma_F) / rocket_mass
    //     velocity = accelaration * time
    //     center_of_gravity.y += velocity * time
    //     segma_F.y +=velocity *time
    //     time++
    //     console.log(segma_F)
    //     console.log(rocket_mass)
    //     console.log(accelaration)
    //     console.log(velocity)
    //     console.log(center_of_gravity)
    //     console.log("")

    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime
    if (firemixer != null) {

        firemixer.update(deltaTime)
        var firestrength = Lscene.calcFire(Physics.physicsOptions.Thrust, Physics.physicsOptions.newThrust)
        setFireStrength(firestrength)

    }

    updateUI()
    //Added
    t.unshift(now);
    if (t.length > 10) {
        var t0 = t.pop();
        var fps = Math.floor(10000 / (now - t0));
        CurrentFPS = fps
    }
    //Added
    if (isLaunched) {

        //CurrentFPS *= frameSpeed.speed
        oldSpeed += Physics.getAcc(200, Physics.getRocketWeight(getRocketMass(),
            Physics.calcG(Physics.physicsOptions.Height)),
            Physics.physicsOptions.newThrust, getRocketMass()) / CurrentFPS
        if (Physics.gasSpec["Propellant mass"] == 0 && (newPosition == 0.2 || newPosition == 0)) {
            newPosition = 0.2
            Physics.physicsOptions.Velocity = 0
            oldSpeed = 0
        }
        Physics.physicsOptions.Velocity = oldSpeed

        if (Physics.gasSpec["Remain propellant mass"] == 0 && (newPosition == 0.2 || newPosition == 0)) {
            console.log('Called');
            //newPosition = 0.2
            Physics.physicsOptions.Velocity = 0
            //oldSpeed = 0
            Physics.physicsOptions.Acc = 0
        }


        newPosition = oldPosition + oldSpeed
        if (newPosition < 0)
            newPosition = 0.2



        oldPosition = newPosition


        Physics.physicsOptions.Height = newPosition
        Physics.physicsOptions.Acc = Physics.getAcc(200, Physics.getRocketWeight(getRocketMass(), Physics.calcG(Physics.physicsOptions.Height)), Physics.physicsOptions.newThrust, getRocketMass())

        if (Physics.physicsOptions.throttle != 0 && Physics.physicsOptions.newThrust != 0) {
            rocket.rotation.z = (Physics.physicsOptions.Angle * (Math.PI / 180)) * -1
            rocket.position.x += Physics.physicsOptions.newThrust * Number(Math.sin((Physics.physicsOptions.Angle * (Math.PI / 180))).toFixed(3))
            rocket.position.y += Physics.physicsOptions.newThrust * Number(Math.cos((Physics.physicsOptions.Angle * (Math.PI / 180)) * -1).toFixed(3))
            //rocket.matrixAutoUpdate
            //scene.rotateZ = (Physics.physicsOptions.Angle * (Math.PI / 180)) * -1
            //rocket.rotateOnWorldAxis(new Vector3(0, 0, 1), (Physics.physicsOptions.Angle * (Math.PI / 180)) * -1)
        }
        rocket.position.y = newPosition
        flame.position.set(rocket.position.x, rocket.position.y + 2, rocket.position.z)

        if (camera.position.y - rocket.position.y != 5)
            camera.position.y = newPosition + 5
        //console.log('Dsitance: ' + newPosition + ' meters');
        camera.position.x = rocket.position.x
        camera.lookAt(rocket.position)

        Physics.decreasePropellantMass(Physics.physicsOptions.newThrust, Physics.calcG(Physics.physicsOptions.Height), Physics.gasSpec["Specific Impulse"], CurrentFPS)
        //console.log('Massss:' + Physics.gasSpec["Propellant mass"])



    }


    orbitControls.target = rocket.position
    //Update Control
    orbitControls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}
var clock = new Clock()

var air_density = 1.225

function updateUI() {

    if (Physics.physicsOptions.Height > Physics.physicsOptions["Max height"]) {
        Physics.physicsOptions["Max height"] = Physics.physicsOptions.Height
        document.getElementById('max-height-value').innerHTML = Physics.physicsOptions["Max height"].toFixed(1)
    }

    if (Physics.physicsOptions.Velocity > Physics.physicsOptions["Max Velocity"]) {
        Physics.physicsOptions["Max Velocity"] = Physics.physicsOptions.Velocity
        document.getElementById('max-speed-value').innerHTML = Physics.physicsOptions.Velocity.toFixed(1)
    }
    if (isLaunched)
        document.getElementById('time-value').innerHTML = clock.getElapsedTime().toFixed(2)

    document.getElementById('thrust-value').innerHTML = (Physics.physicsOptions.newThrust / 9806.65).toFixed(4)
    //console.log('Thrust: ' + Physics.physicsOptions.newThrust);

    var drag = Physics.drag(Physics.physicsOptions["Air Velocity"], Physics.physicsOptions.Angle, Physics.getCG(Physics.getRocketWeight(getRocketMass(), Physics.calcG(Physics.physicsOptions.Height)), [bodyParameters.width, bodyParameters.width, engineParameters.width], [bodyParameters.height, noseParameters.height, engineParameters.height]))
    document.getElementById('Drag-value').innerHTML = Math.sqrt(Math.pow(drag.x, 2) + Math.pow(drag.y, 2) + Math.pow(drag.z, 2))
    // getRocketDrag(1, 2 * Math.PI * Math.pow(bodyParameters.width, 2), air_density, Physics.physicsOptions.Velocity)
    document.getElementById('height-value').innerHTML = Physics.physicsOptions.Height.toFixed(1)

    document.getElementById('amount-value').innerHTML = Physics.gasSpec.Quantity

    document.getElementById('amount-left-value').innerHTML = Physics.gasSpec["Remain Quantity"]

    document.getElementById('gravity-value').innerHTML = Physics.calcG(Physics.physicsOptions.Height).toFixed(2)

    document.getElementById('speed-value').innerHTML = Physics.physicsOptions.Velocity.toFixed(1)

    document.getElementById('mass-value').innerHTML = (getRocketMass() / 1000).toFixed(3)

    document.getElementById('Throttle-value').innerHTML = Physics.physicsOptions.throttle
    //console.log('New Thrust ' + Physics.physicsOptions.newThrust)

    document.getElementById('Acc-value').innerHTML = Physics.physicsOptions.Acc.toFixed(2)

    document.getElementById('Weight-value').innerHTML = (Physics.getRocketWeight(getRocketMass() / 1000, Physics.calcG(Physics.physicsOptions.Height))).toFixed(3)


    //console.log('G: ' + Physics.calcG(0));
    //Escape
    if (Physics.isEscaped(Physics.calcG(0), Physics.physicsOptions.Velocity, Physics.physicsOptions.Height)) {
        document.getElementById("isEscape").style = "color : rgb(61, 241, 61) ; box-shadow: inset 0 0 6px 1px rgb(61, 241, 61);"
    }
    else {
        document.getElementById("isEscape").style = "red ; box-shadow: inset 0 0 6px 1px red;"
    }


    var fallx = Physics.fallingX(Physics.physicsOptions["Max height"],
        -1000200, Physics.isEscaped(Physics.calcG(Physics.physicsOptions.Height),
            Physics.physicsOptions.Velocity, Physics.physicsOptions.Height)
        , Physics.physicsOptions.Velocity)  //-1000200 should be change

    if (isNaN(fallx)) {
        document.getElementById("fall-x-value").innerHTML = fallx;
    }
    else {
        document.getElementById("fall-x-value").innerHTML = fallx.toFixed(2);
    }


    // document.getElementById('fall-x-value').innerHTML = Physics.fallingX(400000,
    // -1000200,Physics.isEscaped(Physics.calcG(Physics.physicsOptions.Height),
    // Physics.physicsOptions.Velocity,Physics.physicsOptions.Height)
    // ,5000)

    document.getElementById('thrust-to-weight-value').innerHTML = (Physics.physicsOptions.newThrust / Physics.getRocketWeight(getRocketMass(), Physics.calcG(Physics.physicsOptions.Height))).toFixed(4)

    document.getElementById('amount-value').innerHTML = Physics.gasSpec["Propellant mass"]
    document.getElementById('amount-left-value').innerHTML = Physics.gasSpec["Remain propellant mass"].toFixed(2)
    document.getElementById('X-value').innerHTML = rocket.position.x
    //console.log('Mass flow rate: ' + Physics.MassFlowRate(Physics.physicsOptions.newThrust, Physics.calcG(Physics.physicsOptions.Height), Physics.gasSpec["Specific Impulse"]) / CurrentFPS)
    console.log(rocket.position.x);

}
tick()

function getRocketMass() {
    return Physics.getRocketMass(engineParameters.width, engineParameters.height, engineParameters.mass,
        bodyParameters.width, bodyParameters.height, bodyParameters.massPerM,
        noseParameters.height, bodyParameters.width, noseParameters.mass, noseParameters.noseType,
        finsParameters.width, finsParameters.height, finsParameters.finType, finsParameters.mass, finsParameters.finsNumber)
}


