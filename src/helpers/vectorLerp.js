import { Vector3 } from "three";
import { lerp } from "three/src/math/MathUtils";

const vectorLerp = (a, b, rate)=>{
    let x = lerp(a.x, b.x, rate);
    let y = lerp(a.y, b.y, rate);
    let z = lerp(a.z, b.z, rate);
    return new Vector3(x,y,z);
}   
export default vectorLerp;