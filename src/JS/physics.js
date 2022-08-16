import { Vector3 } from "three"


const earth_radius = 6371009
const gravitational_constant = 6.67430 * Math.pow(10, -11)
const earth_mass = 5.972 * Math.pow(10, 24)
// var mass_flow_rate
// var exhaust_pressure
// var exhaust_velocity
// var atmospheric_pressure
// var nozzle_area
// var specific_impulse
// var equivalent_velocity
// var rocket_thrust

export function calcG(Height) {
    var Height2 = earth_radius / (earth_radius + Height)
    var newGravity = physicsOptions["Start gravity"] * Math.pow(Height2, 2)
    return newGravity
}


export function getBodyWeight(height, width, mass) {
    return height * (width * 2) * mass
}

export function getNoseMass(height, width, mass, noseType) {

    if (noseType == 'conical') {
        return ((1 / 3) * (Math.PI * Math.pow(width, 2) * height)) * mass
    }
    else if (noseType == 'ogiv') {
        var cylinder = (1 / 3) * Math.PI * ((Math.pow(width, 2) + (width * (width * 0.5)) + Math.pow(width * 0.5, 2))) * height
        cylinder *= mass
        console.log(cylinder);
        console.log((getSphereMass(width * 0.5, mass)) * 0.5);
        return cylinder + (getSphereMass(width * 0.5, mass)) * 0.5
    }
    else {
        var cylinder2 = (1 / 3) * Math.PI * ((Math.pow(width, 2) + (width * (width * 0.3)) + Math.pow(width * 0.3, 2))) * height
        cylinder2 *= mass
        console.log(cylinder2);
        console.log((getSphereMass(width * 0.3, mass)) * 0.5);
        return cylinder2 + (getSphereMass(width * 0.3, mass)) * 0.5
    }


}

export function getSphereMass(width, mass) {

    return ((4 / 3) * Math.PI * Math.pow(width, 3)) * mass

}

export function getEngineMass(width, height, mass) {
    return ((width * width * height) * mass) * 0.3
}

export function getAcc(drag, weight, thrust, mass) {

    return (thrust - (weight + drag)) / mass
}


export function getRocketWeight(rocket_mass, instantaneous_gravity) {
    var weight = rocket_mass * instantaneous_gravity
    return weight
}
//Rocket Thrust
export function getRocketThrust(
    mass_flow_rate, exhaust_pressure,
    exhaust_velocity, atmospheric_pressure,
    nozzle_area, specific_impulse //477
    ,
    equivalent_velocity, rocket_thrust
) {

    var rocket_thrust = (mass_flow_rate * exhaust_velocity) + (nozzle_area * (exhaust_pressure - atmospheric_pressure))
    return rocket_thrust
}

//Rocket Drag
export function getRocketDrag(drag_coefficient, rocket_area, air_density, rocket_speed) {
    var rocket_drag = drag_coefficient * rocket_area * Math.pow(rocket_speed, 2) * air_density / 2
    return rocket_drag

}

//Specific Impulse
export function getSpecificImpulse(rocket_mass, equivalent_velocity) {
    var specific_impulse = equivalent_velocity / rocket_mass
    return specific_impulse
}
//Equivalent Velocity
export function getEquivalentVelocity(specific_impulse, instantaneous_gravity) {
    var equivalent_velocity = specific_impulse * instantaneous_gravity
    return equivalent_velocity
}
//Rocket Lift
export function getRocketLift(finArea, air_density) {
    var rocket_lift = (air_density / 2) * finArea
    return rocket_lift
}

export function getCPofNose(noseType, noseHeight) {
    switch (noseType) {
        case 'conical':
            return (2 / 3) * noseHeight
            break
        case 'ogive':
            return 0.466 * noseHeight
            break
        case ' parabolic':
            return noseHeight * 0.5
            break

    }
}

export function getCPBody(height) {
    return height / 2
}

export function getCPNozzel(d2, d1, Xcs, l) {

    return Xcs + (l / 3) * (1 + ((1 - (d1 / d2)) / 1 - (Math.pow(d1 / d2, 2))))
}
export function getCNANozzel(d2, d1, bodyDiameter) {
    return 2 * (Math.pow(d2 / d, 2) - Math.pow(d1 / d, 2))
}

export function getCP(bodyHeight, d2, d1, Xcs, l, bodyDiameter, noseType) {
    return ((getCNANozzel(d2, d1, bodyDiameter) * getCPNozzel(d2, d1, Xcs, l)) + (2 * getCPofNose(noseType)) + getCPBody(bodyHeight)) / (getCNANozzel(d2, d1, bodyDiameter) + 2)
}


export function getBodyArea(diameter, height) {

    return body = 2 * Math.PI * diameter * (diameter + height)
}

export function getRocketArea() {

}
export function getTV(rocket_weight, air_density, stageHeight) {

    return Math.sqrt((2 * rocket_weight * calcG(stageHeight)) / air_density * getRocketArea())

}
export function getCG(rocket_weight, partsW, partsD) {

    var sum = 0
    // console.log(partsWD.length);

    // for (let i = 0; i < partsWD.length; i++) {
    //     console.log(partsWD.at(i));
    //     sum += partsWD.at(i).weight * (partsWD.at(i).Height / 2)

    // }
    // //partsWD.forEach((e) => { })

    for (let i = 0; i < partsW.length; i++) {

        sum += partsW[i] * partsD[i]

    }
    console.log(sum);
    return sum / rocket_weight
    // parts.forEach((e) => { e.Width })

}

// export function getFinArea(finType, height, width) {
//     var area = 0
//     if (finType == 'Fin-1') {

//         area = (height + (height * 0.75)) * width
//     }
//     else {
//         area = (height * width) / 2
//     }
//     return area
// }


export function mass_ratio(payload_mass, structural_mass, propellant_mass) {
    return Math.log2((payload_mass + structural_mass + propellant_mass) / (payload_mass + structural_mass))
}

export function rocketSpeed1(specific_impulse, instantaneous_gravity, rocket_mass) {
    return specific_impulse * instantaneous_gravity * Math.log2(rocket_mass)
}

export function rocketSpeed2(specific_impulse, instantaneous_gravity, rocket_mass) {
    return specific_impulse * instantaneous_gravity * Math.log2(rocket_mass)
}
function getSphereArea(radius) {
    return (4 * Math.PI * Math.pow(radius, 2))
}

export function getNoseArea(width, Height, NoseType) {
    switch (NoseType) {
        case 'cone':
            var r = 0.5 * width
            var l = Math.sqrt(Math.pow(Height, 2) + Math.pow(r, 2))
            return ((Math.PI * Math.pow(r, 2)) + (Math.PI * r * l))
        case 'ogive':
            var r1 = (0.5 * width)
            var r2 = r1 * 0.6
            var SA = getSphereArea(r2)
            return (((Math.PI * (r1 + r2)) * (Math.sqrt((Math.pow(r1 - r2, 2)) + Math.pow(Height, 2)))) + 0.5 * SA)
        case 'parabolic':
            var r1 = (0.5 * width)
            var r2 = r1 * 0.3
            var SA = getSphereArea(r2)
            return (((Math.PI * (r1 + r2)) * (Math.sqrt((Math.pow(r1 - r2, 2)) + Math.pow(Height, 2)))) + 0.5 * SA)
        default:
            return
    }
}
export function getFinArea(Width, Hight, FinType) {
    switch (FinType) {
        case 'Fin-1':
            if (Hight > 1.5) {
                Hight = Hight + 0.75 * Hight
                return (Width * Hight)
            }
            else {
                Hight = Hight * 2
                return (Width * Hight)
            }
        case 'Fin-2':
            return ((Width * Hight) / 2)
    }

}

///Edited ///
export function getFinMass(Width, Hight, FinType, Mass, finsNumber) {
    var Area = getFinArea(Width, Hight, FinType)
    return (Area * Mass) * finsNumber
}

export function isEscaped(Gravity, Velocity, Height) {
    var Vesc = Math.sqrt(2 * Gravity * (earth_radius - Height))
    // console.log("v :" + Vesc);
    if (Velocity >= Vesc || Height > earth_radius)
        return true
    return false
}
//You need to give X when y = MaxHeight
export function heat(P, Velocity) {
    var Mach = Velocity * 0.002915
    console.log("MAch : " + Mach)
    var S = Mach * Math.sqrt(1.4 / 2)
    console.log("S : " + S)

    return ((1 / 2) * P * Math.pow(Velocity, 2) * (1 + (1 / 2 * Math.PI * S)))
}

export function fallingX(Height, X, isEsc, Velocity) {

    let fallingX = X * 2
    if (Height == 0) {
        return 0
    }
    if (fallingX < (Math.PI * earth_radius * 2) && Velocity >= 4825 && Height > 40000)
        fallingX = 'Burned into atmosphere'
    console.log("dsada : " + Math.PI * earth_radius * 2)
    if (fallingX < (Math.PI * earth_radius * 2) + 40000 && fallingX > (Math.PI * earth_radius * 2) && Velocity >= 4825) {
        fallingX = 'Burned into atmosphere'
    }

    if (fallingX >= (Math.PI * earth_radius * 2) + 40000 || isEsc ||
        fallingX < (Math.PI * earth_radius * 2) + 40000 && fallingX > (Math.PI * earth_radius * 2) && Velocity < 4825) { // out of earth atmosphere or not escape
        fallingX = 'OUT'
    }
    return fallingX
}
export function fallingYonX(fallingX, MaxHeight, Y) {
    return ((MaxHeight - Y) * fallingX / 100)
}


export var gasSpec = {
    'Specific Impulse': 200,
    'GasType': 'petrol',
    'Propellant mass': 2000,
    'Remain propellant mass': 2000,
}

export var physicsOptions = {
    'Thrust': 3000,
    'Velocity': 0,
    'Drag': 0,
    'Lift': 0,
    'Air Velocity': 0,
    //'Specific Impulse': 0,
    'Exhaust Pressure': 0,
    'Exhaust Velocity': 0,
    'Atmospheric Pressure': 0,
    'throttle': 0,
    'newThrust': 0,
    'Angle of attack': 90,
    'Payload mass': 0,
    'Mass flow rate': 0,
    'Max height': 0,
    'Max Velocity': 0,
    'Height': 0,
    'Start gravity': 9.81,
    'Acc': 0,
    'temp': 0,
    'Angle': 0,
    'Lift Coefficient': 0,
    'Drag Coeffiecient': 0
}



export function getRocketMass(engineWidth, engineHeight, engineMass,
    bodyWidth, bodyHeight, bodyMass,
    noseHeight, noseWidth, noseMass, noseType,
    finWidth, finHeight, finType, finMass, finsNumber
) {
    return getEngineMass(engineWidth, engineHeight, engineMass) + getBodyWeight(bodyWidth, bodyHeight, bodyMass)
        + getNoseMass(noseHeight, noseWidth, noseMass, noseType) + getFinMass(finWidth, finHeight, finType, finMass, finsNumber)
    //finsNumber edited in finMass function
}


export function getTorque(arm, force, angle) {
    return arm * force * Math.cos(angle)
}

export function getAnguarAccelartion(torques, inertia) {
    var sum = 0
    torques.forEach(element => {
        sum += element
    });
    return sum / inertia
}
export function MassFlowRate(Thrust, Gravity, Isp) {
    console.log('Mass flow rate: ' + Thrust / (Gravity * Isp));
    return Thrust / (Gravity * Isp)
}


export function decreasePropellantMass(Thrust, Gravity, Isp, FrameRate) {

    if ((gasSpec['Remain propellant mass'] - (MassFlowRate(Thrust, Gravity, Isp) / FrameRate)) <= 0) {
        gasSpec['Remain propellant mass'] = 0
        physicsOptions.throttle = 0
        physicsOptions.newThrust = physicsOptions.Thrust * (physicsOptions.throttle / 100)
        return
    }

    gasSpec['Remain propellant mass'] = gasSpec['Remain propellant mass'] - (MassFlowRate(Thrust, Gravity, Isp) / FrameRate)

}





var lift_coefficient = 0.7
var air_density = 1.225
var fin_area = 10
var rocket_area = Math.PI * Math.pow(5, 2)
export function lift(air_velocity, angle, cp) {

    var rlift = lift_coefficient * 0.5 * air_density * fin_area * Math.pow(air_velocity, 2)
    console.log("Here " + rlift)
    var new_angle = angle + (Math.PI / 2)
    var vector = new Vector3()
    vector.x = cp.x + (Math.cos(new_angle) * rlift)
    vector.y = cp.y + (Math.sin(new_angle) * rlift)
    vector.z = cp.z
    return vector
}

var drag_coeffiecient = 0.5
export function drag(air_velocity, angle, cp) {
    var rdrag = drag_coeffiecient * 0.5 * air_density * rocket_area * Math.pow(air_velocity, 2)
    var new_angle = Math.PI + angle
    var vector = new Vector3()
    vector.x = cp.x + (Math.cos(new_angle) * rdrag)
    vector.y = cp.y + (Math.sin(new_angle) * rdrag)
    vector.z = cp.z
    return vector
}