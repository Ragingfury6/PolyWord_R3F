import gsap from "gsap";
import { Vector3 } from "three";
const cameraAnimation = (
  fromQ,
  toQ,
  toPos,
  duration,
  animationOffset = 0,
  updateControls = false,
  reenableControls = false,
  updateDrag = false,
  dispatch,
  type,
  camera,
  controls,
  lookDisplacement
) => {
    const tl = gsap.timeline();
    tl.to(camera.position, {
      x: toPos.x,
      y: toPos.y,
      z: toPos.z,
      duration: duration,
      delay: animationOffset,
      onComplete: () => {
        if (updateDrag) {
          dispatch({
            index: type,
            draggable: true,
            augment: [0, 0, 0],
          });
        }
      },
    });
    tl.to(
      {},
      {
        duration: 1.5,
        onUpdate: () => {
          camera.quaternion.copy(fromQ).slerp(toQ, tl.progress());
        },
        onComplete: () => {
          if (updateControls && controls) {
            controls.target = new Vector3(
              toPos.x,
              0,
              toPos.z - lookDisplacement
            );
            controls.target0 = new Vector3(
              toPos.x,
              0,
              toPos.z - lookDisplacement
            );
          }
          if (reenableControls) {
            controls.enabled = true;
          }
        },
      },
      "-=1.5"
    );
};
export default cameraAnimation;
