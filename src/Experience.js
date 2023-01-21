import { BakeShadows, Html, OrbitControls, Sky } from "@react-three/drei";
import { Perf } from "r3f-perf";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import PhysicsObjects from "./PhysicsObjects";
import { useContext, useEffect, useRef, useState } from "react";
import { lettersContext } from "./LettersContext";
import endTurn from "./helpers/endTurn";
import { socket } from "./SocketConnection";
import UserInterface from "./UserInterface";
import { useFrame, useThree } from "@react-three/fiber";
import { generateTiles } from "./helpers/randomLetters";
import { Euler, Quaternion, Vector3 } from "three";
import cameraAnimation from "./helpers/cameraAnimation";
import gsap from "gsap";
import { SlowMo } from "gsap/all";
import startingAnimation from "./helpers/startingAnimation";
import Factory from "./Factory";

export default function Experience() {
  const { lettersState, lettersDispatch } = useContext(lettersContext);
  const [gameStarted, setGameStarted] = useState(false);
  const roundSlider = useRef();
  const overlay = useRef();

  const { camera, controls } = useThree();

  const handleGameStart = (opponentTiles, userTiles, isStartingUser) => {
    gsap.to(overlay.current.children[0], { opacity: 0 }).then(() => {
      overlay.current.children[0].classList.add("hidden");
      setGameStarted(true);

      startingAnimation(camera, controls, roundSlider, overlay, isStartingUser, lettersDispatch);

      if (opponentTiles && userTiles) {
        lettersDispatch({
          type: "TILES_INIT",
          userTiles: userTiles,
          opponentTiles: opponentTiles,
        });
      } else {
        const startingTilesUser = generateTiles(10);
        const startingTilesOpponent = generateTiles(10);
        lettersDispatch({
          type: "TILES_INIT",
          userTiles: startingTilesUser,
          opponentTiles: startingTilesOpponent,
        });
        socket.emit("TILES_INIT", {
          userTiles: startingTilesUser,
          opponentTiles: startingTilesOpponent,
        });
      }
    });
  };

  useEffect(() => {
    socket.on("TURN_SWITCH_CLIENT", ({ user }) => {
      lettersDispatch({ type: "TURN_SWITCH", turn: user });
    });
    socket.on("TILES_INIT_CLIENT", ({ userTiles, opponentTiles }) => {
      handleGameStart(userTiles, opponentTiles, false);
    });

    return () => {
      socket.off("TURN_SWITCH_CLIENT");
      socket.off("TILES_INIT_CLIENT");
    };
  }, [controls]);

  return (
    <>
      <EffectComposer>
        <Vignette
          eskil={false}
          offset={0.1}
          darkness={1.1}
          opacity={0.7}
          blendFunction={BlendFunction.SOFT_LIGHT}
        />
        <Bloom mipmapBlur />
      </EffectComposer>

      <Sky sunPosition={[1, 0.9, 3]} />

      <BakeShadows />

      <Perf position="top-left" />

      <OrbitControls
        makeDefault
        enablePan={false}
        enabled={true}
        autoRotate={!gameStarted}
        autoRotateSpeed={0.5}
      />

      <directionalLight
        castShadow
        position={[1, 0.9, 3]}
        intensity={1.5}
        shadow-mapSize={[512, 512]}
        shadow-camera-far={20}
        shadow-camera-near={-20}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <ambientLight intensity={0.3} />

      <Html transform position={[0, 5, -20]}>
        <UserInterface
          camera={camera}
          controls={controls}
          lettersState={lettersState}
        />
      </Html>

        <Html fullscreen wrapperClass="start__menu" ref={overlay} style={{transform:`translateY(${lettersState.showOverlay ? '0px' : '200vh'})`}}>
          <div className="centered start__menu__content">
            <ul>
              <li onClick={() => handleGameStart()}>Start</li>
              <li>Instructions</li>
              <li>Quit</li>
            </ul>
          </div>
          <div className="centered round__slider" ref={roundSlider}>
            <p className="turn">Your Turn</p>
            <p className="round">Round {lettersState.round}</p>
          </div>
        </Html>
      <PhysicsObjects roundSlider={roundSlider} overlay={overlay} />
    </>
  );
}
