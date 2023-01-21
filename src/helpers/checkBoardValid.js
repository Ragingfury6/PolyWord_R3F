import { Vector3 } from "three";

const checkBoardValid = (board, pos) => {
    return !(board.some(letterPosition=>{
        const vec3 = new Vector3(letterPosition.vec3.x, letterPosition.vec3.y, letterPosition.vec3.z);
        return vec3.equals(pos);
    }))
}
export default checkBoardValid;