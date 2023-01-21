import { letterValues } from "./constants";

const calculateMoney = (word) => {
    let overallValue = word.reduce((a,e)=>{
        return a + letterValues.find(v=>v.letter==e).value;
    },0);
    // overallValue = overallValue**2
    // if(word.length >= 4) overallValue*= (1 + ((2 * Math.sqrt(word.length))/10));
    if(word.length >= 4) overallValue*=(Math.sqrt(word.length) * 1.4);
    return Math.floor(overallValue);
};

export default calculateMoney;