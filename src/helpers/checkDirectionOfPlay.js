function checkDirectionOfPlay(p1, p2){
    if(p1.x === p2.x) return 'z';
    if(p1.z === p2.z) return 'x';
    return 'Invalid Inputs';
}
export default checkDirectionOfPlay;