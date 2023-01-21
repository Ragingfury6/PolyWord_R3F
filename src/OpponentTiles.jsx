import { useEffect } from "react";
import { forwardRef } from "react";
import { useContext, useRef } from "react";
import { Vector3 } from "three";
import objectAnimation from "./helpers/objectAnimation";
import Letter from "./Letter";
import { lettersContext } from "./LettersContext";
import { socket } from "./SocketConnection";

const OpponentTiles = forwardRef((props, ref) => {
  const { lettersState, lettersDispatch } = useContext(lettersContext);
  const tiles = useRef([]);

  useEffect(() => {
    socket.on("LETTER_RECEIVED", (data) => {
      console.log(data);
      console.log(tiles);
      lettersDispatch({
        type: "TURN_UPDATE",
        vec3: data.vec3,
        letter: data.letter,
        POSITION_ID: data.POSITION_ID,
        user: "opponent",
      });
      const pos = new Vector3(
        data.POSITION_ID.x,
        data.POSITION_ID.y,
        -data.POSITION_ID.z
      );
      const tileToAnimate = tiles.current.find((c) =>
        c.POSITION_ID.equals(pos)
      );
      objectAnimation(tileToAnimate, data.vec3, 1, new Vector3(0, 0, 0));
    });

    socket.on("LETTER_REMOVED_CLIENT", (data) => {
      console.log(lettersState);
      lettersDispatch({ type: "REMOVE_LETTER", position: data.vec3 });
      lettersDispatch({ type: "REMOVE_EMPTY_SPACE", user: "opponent" });
      const pos = new Vector3(
        data.POSITION_ID.x,
        data.POSITION_ID.y,
        -data.POSITION_ID.z
      );
      const tileToAnimate = tiles.current.find((c) =>
        c.POSITION_ID.equals(pos)
      );
      let posToMove = data.posToMove;
      posToMove.z = -posToMove.z;
      objectAnimation(tileToAnimate, posToMove, 1, new Vector3(0, -Math.PI, 0));
      console.log(lettersState.userLetterHolder);
    });

    socket.on("SPACE_REMOVED_CLIENT", () => {
      lettersDispatch({ type: "REMOVE_EMPTY_SPACE", user: "opponent" });
    });

    socket.on("CLIENT_LETTERS_ADD", (data) => {
      console.log("Opponent Tiles Add");
      console.log(data);
      lettersDispatch({
        type: "TILES_INIT",
        userTiles: data.opponentTiles,
        opponentTiles: data.userTiles,
      });
    });

    socket.on("FACTORY_ADD_CLIENT", (data) => {
      console.log(data);
      lettersDispatch({
        type: "ADD_FACTORY",
        user: "opponent",
        factoryType: data.type,
        position: data.position,
      });
    });
  }, []);

  return (
    <group ref={ref}>
      {/* {lettersState.opponentLetterHolder.map(
        (letter, idx) => {
          if(letter){
            let zPos = Math.floor(idx/10) - 15;
            let xPos = 5 - ((Math.ceil(idx/10)*10) - idx);
            return (
              <Letter
                key={idx}
                position={[xPos, 0.7, zPos]}
                letters={[letter.tile]}
                type={null}
                ref={(el) => (tiles.current[idx] = {...el, LETTER: letter.tile, POSITION_ID:new Vector3(xPos, 0.7, zPos)})}
                dispatch={() => {}}
                draggable={false}
                defaultLocked={true}
                isUser={false}
              />
            );
          }
          return null;
        }
      )} */}
      {lettersState.opponentTiles.map(
        ({ letter, startingPos, animatingFrom }, idx) => {
          let startingPosID = [
            -2 + idx - 10 * Math.floor(idx / 10),
            1,
            -15 - Math.floor(idx / 10),
          ];
          // if(lettersState.opponentEmptySpaces.length > 0){
          //   if((lettersState.opponentEmptySpaces[0].z <= 15 + Math.floor(idx/10)) && (lettersState.opponentEmptySpaces[0].x <= -2 + idx)){
          //     startingPos = lettersState.opponentEmptySpaces[0];
          //     lettersDispatch({type:"REMOVE_EMPTY_SPACE", user:"opponent"});
          //   }
          // }
          return (
            <Letter
              key={idx}
              position={startingPosID}
              animatingFrom={animatingFrom}
              // startingPos = {startingPos ? [startingPos.x, startingPos.y, startingPos.z] : [-2 + idx, 1, -15 - Math.floor(idx/10)]}
              startingPos={startingPos || startingPosID}
              letters={[letter]}
              type={idx}
              ref={(el) =>
                (tiles.current[idx] = {
                  ...el,
                  LETTER: letter,
                  POSITION_ID: new Vector3().fromArray(startingPosID),
                })
              }
              dispatch={() => {}}
              draggable={false}
              defaultLocked={true}
              isUser={false}
              defaultAnimated={animatingFrom ? false : true}
            />
          );
        }
      )}
    </group>
  );
});

export default OpponentTiles;
