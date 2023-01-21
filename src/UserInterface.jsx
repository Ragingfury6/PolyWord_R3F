import cameraAnimation from "./helpers/cameraAnimation";
import { Quaternion, Vector3, Euler } from "three";
import { useContext } from "react";
import { lettersContext } from "./LettersContext";
function UserInterface({camera, controls, lettersState}) {
  return (
    <div style={{ position: "absolute", top: '3rem', left: '-30rem', transform:'translateY(-50%)' }}>
            <p className="zoom__text" onClick={()=>{
              controls.enabled = false;
              const from = camera.quaternion.clone();
              const to = new Quaternion()
                .setFromEuler(new Euler(-Math.PI / 2 + Math.atan(0), 0, 0))
                .normalize();
              let lastPlayedTile = lettersState.lastLetterPosition || new Vector3(0,0,0);
              cameraAnimation(from, to, new Vector3(lastPlayedTile.x,25,lastPlayedTile.z),1.5,0,true, true, false,null,null,camera,controls,0);
            }}>Zoom to Board</p>
            <p className="zoom__text" onClick={()=>{
              controls.enabled = false;
              const from = camera.quaternion.clone();
              const to = new Quaternion().setFromEuler(new Euler(-Math.PI / 2 + Math.atan(30 / 15), 0, 0));
              cameraAnimation(from, to, new Vector3(0,15,30),1.5,0,true, true, false,null, null,camera,controls,30);
            }}>Default Zoom</p>
            <p className="zoom__text" onClick={()=>{
              controls.enabled = false;
              const from = camera.quaternion.clone();
              const to = new Quaternion()
                .setFromEuler(new Euler(-Math.PI / 2 + Math.atan(0), 0, 0))
                .normalize();
              cameraAnimation(from, to, new Vector3(0,15,15),1.5,0,true, true, false,null,null,camera,controls,0);
            }}>Zoom to Tiles</p>
        </div>
  )
}

export default UserInterface