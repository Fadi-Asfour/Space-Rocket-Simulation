import { Vector3 } from "three"

export function Vector_Addition(vec1,vec2)
{
    var res = new Vector3()
    
    res.x = vec1.x+vec2.x
    res.y = vec1.y+vec2.y
    res.z = vec1.z+vec2.z
    return res
}

export function Vector_Subtraction(x1,x2,y1,y2,z1,z2)
{
    return vec1 - vec2
}

export function X_Projection(vec_begin , vec_end)
{
    return vec_end.x - vec_begin.x
}

export function Y_Projection(vec_begin , vec_end)
{
    return vec_end.y - vec_begin.y
}

export function Z_Projection(vec_begin , vec_end)
{
    return vec_end.z - vec_begin.z
}

export function getAngle(X_Proj,Y_Proj)
{
    return Math.atan(Y_Proj,X_Proj)
}

export function getTarget(X_Proj,Y_Proj,Z_Proj, center_of_gravity)
{
    var vec = new Vector3()
    vec.x = center_of_gravity.x + X_Proj
    vec.y = center_of_gravity.y + Y_Proj
    vec.z = center_of_gravity.z + Z_Proj
    return vec
}

