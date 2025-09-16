// src/modules/api/v1/websocket/routes/websocket.routes.js
import { Server } from 'ws';
import { handleConnection } from '../controllers/websocket.controller';

const wss = new Server({ port: 8080 });

wss.on('connection', handleConnection);

export default wss;