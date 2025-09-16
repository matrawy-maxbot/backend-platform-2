// src/modules/api/v1/websocket/controllers/websocket.controller.js
export function handleConnection(socket) {
     console.log('New client connected');
     socket.on('message', (message) => {
       console.log('Message received:', message);
       socket.emit('response', 'Message received');
     });
   }