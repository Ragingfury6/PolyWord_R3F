import io from 'socket.io-client';
import { useState, useEffect } from 'react';

const socket = io('http://localhost:3001', {path:'/socket'});

function SocketConnection() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastPong, setLastPong] = useState(null);
  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('pong', () => {
      setLastPong(new Date().toISOString());
      console.log("pong!");
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
    };
  }, []);

  const sendPing = () => {
    socket.emit('ping');
  }
//   return <div style={{position:"absolute", left:"50%",top:"10%"}} onClick={()=>sendPing()}>SEND</div>;
return null;
}

export {SocketConnection, socket}