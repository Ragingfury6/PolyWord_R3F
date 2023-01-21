import './style.css'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience.js'
import { lettersContext, Provider as LettersProvider} from './LettersContext'
import {SocketConnection} from "./SocketConnection";
import UserInterface from './UserInterface'
import { Html } from '@react-three/drei'

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
    <StrictMode>
    <LettersProvider>
    <Canvas
        shadows
        camera={ {
            fov: 45,
            near: 0.1,
            far: 200,
            position: [ - 4, 3, 6 ]
        } }
    >
        <Experience />
    </Canvas>
    
    <SocketConnection/>
    </LettersProvider>
    </StrictMode>
)