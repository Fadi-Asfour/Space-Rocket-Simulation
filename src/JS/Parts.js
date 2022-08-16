import * as THREE from 'three'
import { DoubleSide, Face3, Group, Mesh } from 'three';
import { RoundedBoxBufferGeometry } from 'three/examples/jsm/geometries/RoundedBoxBufferGeometry.js';


export function getIp() {
    return 'http://192.168.43.60:5555'
}
const materialTexture = new THREE.TextureLoader().load(getIp() + '/images/rocketMaterial2.jpg')


//E1 nozzel
class E1nozzel extends THREE.Mesh {
    constructor() {
        const nozzelpoints = [];
        for (let i = 0; i < 9; i++) {
            nozzelpoints.push(new THREE.Vector2(Math.sin(i * 0.2) * 10 + 5, (i - 5) * 2));
        }

        const nozzel = super(
            new THREE.LatheBufferGeometry(nozzelpoints, 30),
            new THREE.MeshPhongMaterial({
                //color: 0x00ff00, side: THREE.DoubleSide,    // red (can also use a CSS color string here)
                shininess: 100,
                //metalness: 1,
                map: materialTexture,
                //emissive: 0xffff00,
                emissiveIntensity: 0.5
            })
        )
    }
}
//E2 nozzel
class E2nozzel extends THREE.Mesh {
    constructor() {
        const e2nozzel = super(
            new THREE.CylinderBufferGeometry(0.5, 1.4, 3, 40, 10, true),
            new THREE.MeshPhongMaterial({
                // color: 0x00ff00, side: THREE.DoubleSide,    // red (can also use a CSS color string here)
                shininess: 80,
                //metalness: 1,
                map: materialTexture,
                //emissive: 0xffff00,
                emissiveIntensity: 0.5
            })
        )
    }
}
//Nozzel Connector
class Nozzelconector extends THREE.Mesh {
    constructor() {
        const nozzelconectorpoints = [];
        for (let i = 0; i < 3; i++) {
            nozzelconectorpoints.push(new THREE.Vector2(Math.sin(i * 0) * 1 + 5, (i - 5) * 2));
        }
        const Nozzelconector = super(
            new THREE.LatheBufferGeometry(nozzelconectorpoints, 30),
            new THREE.MeshPhongMaterial({
                //color: 0xff0000, side: THREE.DoubleSide,    // red (can also use a CSS color string here)
                shininess: 100,
                //metalness: 1,
                map: materialTexture,
                //emissive: 0xff0000,
                emissiveIntensity: 0.7
            })
        )
    }
}
//Nozel Top
class NozzelTop extends THREE.Mesh {
    constructor() {
        const nozzeltoppoints = [];
        for (let i = 0; i < 4; i++) {
            nozzeltoppoints.push(new THREE.Vector2(Math.sin(i * 0.9) * 1 + 5, (i - 5) * 2));
        }
        const nozzeltop = super(
            new THREE.LatheBufferGeometry(nozzeltoppoints, 30),
            new THREE.MeshPhongMaterial({
                // color: 0xfffaff, side: THREE.DoubleSide,    // red (can also use a CSS color string here)
                shininess: 100,
                //metalness: 1,
                map: materialTexture,
                //emissive: 0xfffaff,
                emissiveIntensity: 0.5
            })
        )
    }
}
//plane
class Plane extends THREE.Mesh {
    constructor() {
        const nozzelplane = super(
            new RoundedBoxBufferGeometry(2, 1, 1, 6, 0.1),
            new THREE.MeshPhongMaterial({
                //color: 0xff9ff0, side: THREE.DoubleSide,    // red (can also use a CSS color string here)
                shininess: 80,
                //metalness: 1,
                map: materialTexture,
                //emissive: 0xff9ff0,
                emissiveIntensity: 0.8
            }))
    }
}
//Cylinders
class Cylinder1 extends THREE.Mesh {
    constructor() {
        const cylinder1 = super(
            new THREE.CylinderBufferGeometry(0.2, 0.1, 1, 20, 10, true),
            new THREE.MeshPhongMaterial({
                //color: 0xffff00, side: THREE.DoubleSide,    // red (can also use a CSS color string here)
                shininess: 80,
                //metalness: 1,
                map: materialTexture,
                //emissive: 0xffff00,
                emissiveIntensity: 0.7
            }))
    }
}
class Cylinder2 extends THREE.Mesh {
    constructor() {
        super(
            new THREE.CylinderBufferGeometry(0.1, 0.1, 0.5, 20, 10, true),
            new THREE.MeshPhongMaterial({
                //color: 0xffff00, side: THREE.DoubleSide,    // red (can also use a CSS color string here)
                shininess: 80,
                //metalness: 1,
                map: materialTexture,
                //emissive: 0xffff00,
                emissiveIntensity: 0.7
            }))
    }
}
//Tours
class Tours extends THREE.Mesh {
    constructor() {
        super(
            new THREE.TorusBufferGeometry(0.1, 0.05, 30, 80),
            new THREE.MeshPhongMaterial({
                //color: 0xff0000, side: THREE.DoubleSide,    // red (can also use a CSS color string here)
                shininess: 80,
                //metalness: 1,
                map: materialTexture,
                //emissive: 0xff0000,
                emissiveIntensity: 0.5
            }))
    }
}



// Rocket Parts
class Engine1 {
    constructor() {
        const engine1 = new THREE.Group()

        //nozel
        const nozzel = new E1nozzel()
        nozzel.rotateZ(Math.PI)
        nozzel.scale.set(0.1, 0.18, 0.1)

        //nozelconnector
        const nozzelconector = new Nozzelconector()
        nozzelconector.scale.set(0.1, 0.1, 0.1)
        nozzelconector.position.set(0, 2.8, 0)


        //nozelTop
        const nozzeltop = new NozzelTop()
        nozzeltop.scale.set(0.1, 0.1, 0.1)
        nozzeltop.position.set(0, 3.2, 0)

        //plane
        const nozzelplane = new Plane()
        nozzelplane.scale.set(2, 0.2, 1.2)
        nozzelplane.position.set(0, 2.8, 0)

        //tube1
        const tube1 = new THREE.Group()
        const cylinder1 = new Cylinder1()

        const cylinder2 = new Cylinder2()
        cylinder2.position.set(0.12, -0.65, 0)
        cylinder2.rotateZ(10)

        const c2torus1 = new Tours()
        c2torus1.position.set(0.015, -0.5, 0)
        c2torus1.rotateY(80)
        c2torus1.rotateX(2)

        const cylinder3 = new Cylinder2()
        cylinder3.position.set(0.45, -0.91, 0)
        cylinder3.rotateZ(1.2)

        const c3torus2 = new Tours()
        c3torus2.position.set(0.25, -0.81, 0)
        c3torus2.rotateY(80)
        c3torus2.rotateX(2.4)
        tube1.add(cylinder1, cylinder2, c2torus1, cylinder3, c3torus2)
        tube1.position.set(1, 2.25, 0)

        //tube2
        const tube2 = new THREE.Group()
        const t2cylinder1 = new Cylinder1()

        const t2cylinder2 = new Cylinder2()
        t2cylinder2.position.set(0.12, -0.65, 0)
        t2cylinder2.rotateZ(10)

        const t2c2torus1 = new Tours()
        t2c2torus1.position.set(0.015, -0.5, 0)
        t2c2torus1.rotateY(80)
        t2c2torus1.rotateX(2)

        const t2cylinder3 = new Cylinder2()
        t2cylinder3.position.set(0.45, -0.91, 0)
        t2cylinder3.rotateZ(1.2)

        const t2c3torus2 = new Tours()
        t2c3torus2.position.set(0.25, -0.81, 0)
        t2c3torus2.rotateY(80)
        t2c3torus2.rotateX(2.4)

        tube2.add(t2cylinder1, t2cylinder2, t2c2torus1, t2cylinder3, t2c3torus2)
        tube2.position.set(-1, 2.25, 0)
        tube2.rotateY(3)
        return engine1.add(nozzel, nozzelconector, nozzeltop, nozzelplane, tube1, tube2)
    }
}
//Engine 2
class Engine2 {
    constructor() {
        const engine2 = new THREE.Group()
        let e2nozzel = new E2nozzel()
        e2nozzel.position.set(0, 0.3, 0)

        //nozelconnector

        const e2nozzelconector = new Nozzelconector()
        e2nozzelconector.scale.set(0.1, 0.1, 0.1)
        e2nozzelconector.position.set(0, 2.8, 0)


        //nozelTop

        const e2nozzeltop = new NozzelTop()
        e2nozzeltop.scale.set(0.1, 0.1, 0.1)
        e2nozzeltop.position.set(0, 3.2, 0)

        //plane
        const e2nozzelplane = new Plane()
        e2nozzelplane.scale.set(2, 0.2, 1.2)
        e2nozzelplane.position.set(0, 2.8, 0)

        //tube1
        const e2tube1 = new THREE.Group()
        const e2cylinder1 = new Cylinder1()

        const e2cylinder2 = new Cylinder2()
        e2cylinder2.position.set(0.12, -0.65, 0)
        e2cylinder2.rotateZ(10)

        const e2c2torus1 = new Tours()
        e2c2torus1.position.set(0.015, -0.5, 0)
        e2c2torus1.rotateY(80)
        e2c2torus1.rotateX(2)

        e2tube1.position.set(1, 2.25, 0)
        e2tube1.add(e2cylinder1, e2cylinder2, e2c2torus1)

        //tube2
        const e2tube2 = new THREE.Group()
        const e2t2cylinder1 = new Cylinder1()

        const e2t2cylinder2 = new Cylinder2()
        e2t2cylinder2.position.set(0.12, -0.65, 0)
        e2t2cylinder2.rotateZ(10)

        const e2t2c2torus1 = new Tours()
        e2t2c2torus1.position.set(0.015, -0.5, 0)
        e2t2c2torus1.rotateY(80)
        e2t2c2torus1.rotateX(2)


        e2tube2.add(e2t2cylinder1, e2t2cylinder2, e2t2c2torus1)
        e2tube2.position.set(-1, 2.25, 0)
        e2tube2.rotateY(3)
        return engine2.add(e2nozzel, e2nozzelconector, e2nozzeltop, e2nozzelplane, e2tube1, e2tube2)
    }
}
//Full Rocket Tube
class FRTube extends THREE.Mesh {
    constructor(Hight = 2, Width = 1) {
        materialTexture.wrapS = THREE.RepeatWrapping;
        materialTexture.wrapT = THREE.RepeatWrapping;
        materialTexture.repeat.set(4, 1);
        const FRTube = super(
            new THREE.CylinderBufferGeometry(Width, Width, Hight, 80, 80, false),
            new THREE.MeshPhongMaterial({
                color: 0xa0a0a0,
                side: THREE.DoubleSide,    // red (can also use a CSS color string here)
                map: materialTexture,
                shininess: 100,
                //metalness: 1,
                emissive: 0x808080,
                emissiveIntensity: 0.7,
            }))
    }
}
class Player extends THREE.Mesh {
    constructor() {
        const ee = new THREE.Group()
        let e = super(new THREE.BoxGeometry(2, 2, 2),
            new THREE.MeshBasicMaterial({
                color: 0x0d6a02
            }));
        e.position.set(2, 1, 1)
        const e3 = new Player2()
        e3.position.set(-1, 0, 1)
        return ee.add(e, e3)
    }
}
class Player2 extends THREE.Mesh {
    constructor() {
        super(new THREE.BoxGeometry(2, 5, 2),
            new THREE.MeshBasicMaterial({
                color: 0xff0000
            }));
    }
}
//Noses
class MainCylinder extends THREE.Mesh {
    constructor(Top = 1, Bottom = 1, Hight = 1, R1 = 20, R2 = 20, Open = false, Color = 0xFFFFF0F, Opacity = 1) {
        super(new THREE.CylinderBufferGeometry(Top, Bottom, Hight, R1, R2, Open),
            new THREE.MeshPhongMaterial({
                //color: Color,// side: THREE.DoubleSide,   
                shininess: 100,
                //metalness: 1,
                //emissive: Color,
                emissiveIntensity: 0.7,
                opacity: Opacity,
                transparent: true,
                map: materialTexture
            }))
    }
}
class ParabolicNose extends THREE.Mesh {
    constructor(width, height) {
        const nozel1 = new THREE.Group()
        const sphere = super(new THREE.SphereBufferGeometry(width * 0.3, 64, 32),
            new THREE.MeshPhongMaterial({
                //color: 0xff0000,// side: THREE.DoubleSide,   
                shininess: 100,
                //metalness: 1,
                //emissive: 0xff0000,
                color: 0xc0c0c0,
                emissive: 0xa0a0a0,
                emissiveIntensity: 0.7,
                map: materialTexture
            }))
        sphere.position.set(0, 0.5 * height, 0)
        let Base = new MainCylinder(width * 0.3, width, height, 40, 40, false, 0xff0000)
        return nozel1.add(Base, sphere)
    }
}
class ConicalNose extends THREE.Mesh {
    constructor(radius, height) {
        const nose2 = super(new THREE.ConeGeometry(radius, height, 64, 32),
            new THREE.MeshPhongMaterial({
                //color: 0xff0000,// side: THREE.DoubleSide,   
                color: 0xa0a0a0,
                shininess: 100,
                //metalness: 1,
                emissive: 0x808080,
                emissiveIntensity: 0.7,
                map: materialTexture
            }))
        return nose2
    }
}
class OgiveNose extends THREE.Mesh {
    constructor(width, height) {
        const nozel1 = new THREE.Group()
        const sphere = super(new THREE.SphereBufferGeometry(width * 0.5, 64, 32),
            new THREE.MeshPhongMaterial({
                //color: 0xff0000, side: THREE.DoubleSide,
                shininess: 100,
                //metalness: 1,
                //emissive: 0xff0000,
                color: 0xa0a0a0,
                emissive: 0x808080,
                emissiveIntensity: 0.7,
                map: materialTexture
            }))
        //sphere.scale.y = height
        sphere.position.set(0, 0.5 * height, 0)
        let Base = new MainCylinder(width * 0.5, width, height, 40, 40, false, 0xff0000)
        return nozel1.add(Base, sphere)
    }
}
//Fins
//Rectangle

class Rectangle extends THREE.Mesh {
    constructor(X = 3, Y = 1) {
        const positionsArray = new Float32Array([
            0, 0, 0,
            0, Y, 0,
            X, 0, 0,
        ])
        const positionsAtttribute = new THREE.BufferAttribute(positionsArray, 3)
        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', positionsAtttribute)
        const material = new THREE.MeshBasicMaterial({
            //color: 0x1100ff, side: THREE.DoubleSide,
            color: 0xc0c0c0, side: THREE.DoubleSide,
            map: materialTexture
        })
        const mesh = super(geometry, material)

        return mesh
    }
}
class Fin1 extends THREE.Mesh {
    constructor(Width = 3, Hight = 1) {
        const Fin = new THREE.Group()
        let Top, Bottom
        const mid = super(new THREE.PlaneBufferGeometry(Width, Hight),

            new THREE.MeshPhongMaterial({
                //color: 0x1100ff, side: THREE.DoubleSide,
                color: 0xc0c0c0, side: THREE.DoubleSide,
                shininess: 100,
                //metalness: 1,
                emissive: 0x1100ff,
                emissiveIntensity: 0.7,
                map: materialTexture
            })
        )
        if (Hight > 1.5) {
            Bottom = new Rectangle(Width, Hight * 0.75)
            Top = new Rectangle(Width, Hight * 0.75)
        }
        else {
            Bottom = new Rectangle(Width)
            Top = new Rectangle(Width)
        }
        Top.position.set(-0.5 * Width, 0.5 * Hight, 0)
        Bottom.position.set(0.5 * Width, -0.5 * Hight, 0)
        Bottom.rotateZ(Math.PI)
        return Fin.add(Top, mid, Bottom)
    }
}
class Fin2 {
    constructor(Width = 3, Hight = 1) {
        const fin = new Rectangle(Width, Hight)
        return fin
    }
}

class Base extends THREE.Mesh {
    constructor(width = 200, height = 100) {

        const baseTexture = new THREE.TextureLoader().load(getIp() + '/images/body.jpg')
        const baseG = new THREE.BoxGeometry(width, height, 4)

        const baseM = new THREE.MeshBasicMaterial({ map: baseTexture })
        const mesh = super(baseG, baseM)

        return mesh
    }
}

class RocketBase extends THREE.Mesh {
    constructor() {
        const fullBase = new THREE.Group

        const base = new Base(150, 50)
        base.rotation.x = Math.PI * 0.495
        base.position.y = 3
        base.position.x = -22

        const upbase = new Base(150, 50)
        upbase.rotation.x = Math.PI * 0.495
        upbase.position.y = 200
        upbase.position.x = -22
        upbase.name = 'UpBase'

        const wall = new Base(50, 200)
        wall.position.y = 103
        wall.rotation.y = Math.PI / 2
        wall.position.x = 50



        return fullBase.add(base, wall, upbase)


    }
}
//exports
export { Player, Engine1, Engine2, FRTube, ParabolicNose, ConicalNose, OgiveNose, Fin1, Fin2, RocketBase };