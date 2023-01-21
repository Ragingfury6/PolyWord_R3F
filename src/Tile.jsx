import { Color, TextureLoader, Vector3 } from "three";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useRef, useState, useContext, useReducer, useMemo } from "react";
import Letter from "./Letter";
import vectorLerp from "./helpers/vectorLerp";
import { lettersContext } from "./LettersContext";
import checkBoardValid from "./helpers/checkBoardValid";
import { socket } from "./SocketConnection";
import { useEffect } from "react";
import OpponentTiles from "./OpponentTiles";
import { Html } from "@react-three/drei";
import endTurn from "./helpers/endTurn";
import gsap from "gsap";
import startingAnimation from "./helpers/startingAnimation";
import { generateTiles } from "./helpers/randomLetters";
import createNewTile from "./helpers/createNewTile";
import Shop from "./Shop";
import Factory from "./Factory";

function Tile({ roundSlider, overlay }) {
  const { lettersState, lettersDispatch } = useContext(lettersContext);
  const moveable = useRef([]);
  const opponentTiles = useRef([]);
  const [oneMore, setOneMore] = useState(false);
  const { camera, controls } = useThree();

  useEffect(() => {
    socket.on("END_TURN_CLIENT", () => {
      lettersDispatch({ type: "BOARD_UPDATE" });
      console.log("Client End Turn");
      lettersDispatch({ type: "TURN_SWITCH", turn: socket.id });
      if(lettersState.round >= 5){
        overlay.current.children[1].innerHTML = `<p className="turn">Game Over!</p>`;
        controls.enabled=false;
      }
      startingAnimation(
        camera,
        controls,
        roundSlider,
        overlay,
        true,
        lettersDispatch
      );

      createNewTile(lettersState, lettersDispatch, socket,null, 1);
      setOneMore(true);
      if(lettersState.round >= 5){controls.enabled=false;}
    });

    return () => socket.off("END_TURN_CLIENT");
  }, [controls, lettersState]);

  useEffect(()=>{
    if(oneMore){
      createNewTile(lettersState, lettersDispatch, socket,null, 1);
      setOneMore(false);
    }
  },[lettersState]);

  let initialDraggable = [];
  const draggableReducer = (state, action) => {
    let tempArr = [...state];
    if (action.type == "MATERIAL") {
      tempArr[action.index].material = action.material;
      return [...tempArr];
    }
    tempArr[action.index] = {
      draggable: action.draggable,
      augment: action.augment,
    };
    return [...tempArr];
  };
  const [state, dispatch] = useReducer(draggableReducer, initialDraggable);

  const [ao, arm, bump, map, disp, nor, rough] = useLoader(TextureLoader, [
    "/Nature/textures/grass_path_3_ao_2k.jpg",
    "/Nature/textures/grass_path_3_arm_2k.jpg",
    "/Nature/textures/grass_path_3_bump_2k.jpg",
    "/Nature/textures/grass_path_3_diff_2k.jpg",
    "/Nature/textures/grass_path_3_disp_2k.png",
    "/Nature/textures/grass_path_3_nor_dx_2k.jpg",
    "/Nature/textures/grass_path_3_rough_2k.jpg",
  ]);

  const handlePointerMove = (e) => {
    for (let i = 0; i < state.length; i++) {
      if (state[i] !== undefined) {
        if (state[i].draggable) {
          const roundedPosition = new Vector3(
            Math.round(moveable.current[i].position.x),
            -0,
            Math.round(moveable.current[i].position.z)
          );
          moveable.current[i].position.set(e.point.x, e.point.y, e.point.z);
        }
      }
    }
  };

  const purchaseFactory = () => {
    console.log("Purchased!");
    const position = new Vector3(-12, 5, (Math.random() - 0.5) * 10);
    lettersDispatch({
      type: "ADD_FACTORY",
      user: "user",
      factoryType: "Normal",
      position,
      round: lettersState.round
    });
    socket.emit("FACTORY_ADD", { type: "Normal", position, round:lettersState.round });
  };

  const handleEndTurn = () => {
    const turnResult = endTurn(lettersState, lettersDispatch);
    console.log(turnResult.vectors);
    const opponentObjects = opponentTiles.current.children.map(
      (i) => i.children[0]
    );
    const lettersToAnimate = opponentObjects
      .concat(moveable.current)
      .filter((i) => turnResult.vectors.find((l) => l.equals(i.position)));
    console.log(lettersToAnimate);
    for (let letter of lettersToAnimate) {
      const tl = gsap.timeline();
      tl.to(letter.material.color, {
        r: turnResult.status ? 0 : 2,
        g: turnResult.status ? 2 : 0,
        b: 0,
        duration: 0.25,
      });
      tl.to(letter.material.color, {
        r: 0.277,
        g: 0.292,
        b: 0.305,
        duration: 0.25,
        delay: 1,
      });
    }
    if (turnResult.status) {
      lettersDispatch({ type: "ROUND_INCREMENT" });
      socket.emit("END_TURN");
    }
  };

  return (
    <>
      <RigidBody type="static">
        <mesh
          rotation-x={-Math.PI / 2}
          receiveShadow
          castShadow
          onPointerMove={(e) => handlePointerMove(e)}
        >
          <planeGeometry args={[25, 25]} />
          <meshStandardMaterial
            aoMap={ao}
            metalnessMap={arm}
            bumpMap={bump}
            map={map}
            displacementMap={disp}
            normalMap={nor}
            roughnessMap={rough}
          />
        </mesh>
      </RigidBody>

      {lettersState.userTiles.map(
        ({ letter, startingPos, animatingFrom }, idx) => {
          let startingPosID = [
            -2 + idx - 10 * Math.floor(idx / 10),
            1,
            15 + Math.floor(idx / 10),
          ];

          return (
            <Letter
              key={idx}
              position={startingPosID}
              // startingPos = {startingPos ? [startingPos.x, startingPos.y, startingPos.z] : [-2 + idx, 1, 15 + Math.floor(idx/10)]}
              startingPos={startingPos || startingPosID}
              animatingFrom={animatingFrom}
              letters={[letter]}
              type={idx}
              ref={(el) =>
                (moveable.current[idx] = {
                  ...el,
                  LETTER: letter,
                  POSITION_ID: new Vector3().fromArray(startingPosID),
                })
              }
              dispatch={dispatch}
              draggable={
                state.length > 0
                  ? state[idx]
                    ? state[idx].draggable
                    : false
                  : false
              }
              defaultLocked={false}
              isUser={true}
              defaultAnimated={animatingFrom ? false : true}
            />
          );
        }
      )}
      <OpponentTiles ref={opponentTiles} />

      {/* {lettersState.userFactories.map((i, idx) => {
        return (
          <Factory key={idx} type={i.type} position={i.position} user="user" round={i.round} />
        );
      })}
      {lettersState.opponentFactories.map((i, idx) => {
        return (
          <Factory
            key={idx}
            type={i.type}
            position={i.position}
            user="opponent"
            round={i.round}
          />
        );
      })} */}

      <Html transform position={[0, 5, -20]}>
        <div style={{ position: "absolute", top: "-12rem", left: "-30rem" }}>
          <button
            onClick={() =>
              (lettersState.turn === null || lettersState.turn === socket.id) &&
              handleEndTurn()
            }
            className="endTurn"
          >
            End Turn
          </button>
        </div>
        <div style={{ position: "absolute", top: "-17rem", left: "0rem" }}>
          <p className="money__text">${lettersState.money}</p>
        </div>
        {/* <Shop purchaseFactory={purchaseFactory} /> */}
      </Html>
    </>
  );
}

export default Tile;
