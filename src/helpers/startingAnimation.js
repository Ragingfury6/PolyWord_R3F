import gsap from "gsap";
import { SlowMo } from "gsap/all";
import { Euler, Quaternion, Vector3 } from "three";
import cameraAnimation from "./cameraAnimation";

const startingAnimation = (camera, controls, roundSlider, overlay, isStartingUser=true, lettersDispatch) => {
  lettersDispatch({type:"CHANGE_OVERLAY", value:true});
  gsap.to(overlay.current, {
    opacity: 1,
  });
  const from = camera.quaternion.clone();
  const to = new Quaternion().setFromEuler(
    new Euler(-Math.PI / 2 + Math.atan(30 / 15), 0, 0)
  );
  cameraAnimation(
    from,
    to,
    new Vector3(0, 15, 30),
    1.5,
    0,
    true,
    false,
    false,
    null,
    null,
    camera,
    controls,
    30
  );
  setTimeout(() => {
    if(isStartingUser){
    controls.enabled = false;
    gsap.fromTo(
      roundSlider.current,
      { x: "-200%", y: "-50%" },
      {
        x: "100%",
        y: "-50%",
        duration: 4,
        ease: SlowMo.ease.config(0.1, 0.9),
        onComplete: () => {
          controls.enabled = true;
          gsap.to(overlay.current, {
            opacity: 0,
            onComplete: () => lettersDispatch({type:"CHANGE_OVERLAY", value:false})
          });
        },
      }
    );
    }else{
        gsap.to(overlay.current, {
            opacity: 0,
            onComplete: () => lettersDispatch({type:"CHANGE_OVERLAY", value:false})
          });
    }
  }, 1500);
};
export default startingAnimation;