import gsap from "gsap";
const objectAnimation = (object, toPos, duration, rotate=false) => {
    const tl = gsap.timeline();
          tl.to(object.position, {
              x: toPos.x,
              y: toPos.y,
              z: toPos.z,
            duration: duration,
          });
          if(rotate){
            tl.to(object.rotation,{
                x:rotate.x,
                y:rotate.y,
                z:rotate.z,
                duration:1
            },`-=${duration}`)
          }
};

export default objectAnimation;