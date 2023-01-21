import { Clone, Float, useAnimations, useGLTF } from "@react-three/drei";
import { useContext, useRef } from "react";
import { useEffect } from "react";
import { Vector3 } from "three";
import { LoopOnce, LoopPingPong } from "three";
import createNewTile from "./helpers/createNewTile";
import { lettersContext } from "./LettersContext";
import { socket } from "./SocketConnection";
function Factory({ type, position, user, round }) {
  const factory = useGLTF("./mill.glb");
  const groupRef = useRef();
  const animations = useAnimations(factory.animations, groupRef);
  const { lettersState, lettersDispatch } = useContext(lettersContext);
  useEffect(() => {
    const windmillSpin = animations.actions["propellerAction.003"];
    console.log(animations, windmillSpin);
    windmillSpin.play();
  }, [animations]);

  useEffect(() => {
    socket.on("OPEN_FACTORY", (data) => {
      console.log(position, data.position);
      if (new Vector3(position.x, position.y, position.z).equals(data.position)) {
        console.log("equal");
        const openTop = animations.actions.EmptyAction;
        openTop.loop = LoopPingPong;
        openTop.repetitions = 2;
        openTop.reset().play();
      }
    });
  }, []);
  useEffect(()=>{
    if(round !== lettersState.round){
        console.log(round, lettersState.round);
        const openTop = animations.actions.EmptyAction;
        openTop.loop = LoopPingPong;
        openTop.repetitions = 2;
        openTop.reset().play();
        socket.emit("OPEN_FACTORY", { position });
        createNewTile(
          lettersState,
          lettersDispatch,
          socket,
          [position.x, position.y + 0.25, position.z]
        );
    }
  },[lettersState.round]);

//   const handleClick = () => {
//     const openTop = animations.actions.EmptyAction;
//     openTop.loop = LoopPingPong;
//     openTop.repetitions = 2;
//     openTop.reset().play();
//     socket.emit("OPEN_FACTORY", { position });
//     createNewTile(
//       lettersState,
//       lettersDispatch,
//       socket,
//       [position.x, position.y + 0.25, position.z]
//     );
//   };
  return (
    <Float
      rotationIntensity={0}
      floatIntensity={0}
      onClick={() => handleClick()}
    >
      <Clone
        object={factory.scene}
        scale={[3, 3, 3]}
        rotation-y={Math.PI / 2}
        position={
          user == "opponent"
            ? [-position.x, position.y, position.z]
            : [position.x, position.y, position.z]
        }
        ref={groupRef}
      />
    </Float>
  );
}
useGLTF.preload("./mill.glb");
export default Factory;
