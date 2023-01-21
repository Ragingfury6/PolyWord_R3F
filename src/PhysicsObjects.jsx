import React from 'react'
import Tile from './Tile'
import { Debug, Physics, RigidBody } from '@react-three/rapier'
import Nature from "./Nature";
import PlayerTilesHolder from './PlayerTilesHolder';


function PhysicsObjects({roundSlider, overlay}) {
  return (
    <>
    <Physics>

    <Tile roundSlider={roundSlider} overlay={overlay}/>

    <PlayerTilesHolder position-z={18}/>
    <PlayerTilesHolder position-z={-18}/>

        

        <Nature type={-1} count={100} randomWidth={25}/>

    {/* <Debug/> */}
    </Physics>
    </>
  )
}

export default PhysicsObjects