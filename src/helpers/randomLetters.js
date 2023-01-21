import { letterFrequenciesRandomized } from "./constants";
const generateTiles = (count, startingPos=null, animatingFrom=null) =>{
    const tiles = [];
    for(let i =0; i < count; i++){
        const randomLetter = letterFrequenciesRandomized[Math.floor(Math.random()*letterFrequenciesRandomized.length)];
        tiles.push({letter:randomLetter, startingPos, animatingFrom});
    }
    return tiles;
}

export {generateTiles};