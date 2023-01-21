const findStart = (board, startingLetter, direction) =>{
  const oppositeDirection = direction==="z" ? "x" : "z";
  const constantValue = startingLetter.vec3[oppositeDirection];
  let sortedBoard = board.filter(i=>i.vec3[oppositeDirection] == constantValue).sort((a,b)=>{
    if(a.vec3[direction] < b.vec3[direction]) return -1;
    return 1;
  });
  console.log(sortedBoard)
  let counter = startingLetter.vec3[direction];
  while(true){
    if(!sortedBoard.find(i=>i.vec3[direction] == counter)) break;
    counter--;
  }
  console.log(startingLetter)
  console.log(counter);
  sortedBoard = sortedBoard.filter(i=>i.vec3[direction] > counter);
  console.log(sortedBoard)
  return sortedBoard;
}
export default findStart;