import app from "./app.js";
import { createAdminUser } from "./libs/createUser.js";
import "./database.js";
import http from "http";
import { Server as SocketIOServer } from "socket.io";

async function main() {
  await createAdminUser();
  const server = http.createServer(app);
  const io = new SocketIOServer(server);

  // Map para almacenar los ID de sala de los escritores conectados
  const writerSockets = new Map();
  const roomUsersCount = new Map();

  io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado');

    // Manejar el evento 'joinRoom' para que el escritor se una a su sala correspondiente
    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      writerSockets.set(socket.id, roomId);
      // Incrementar el número de usuarios conectados a la sala
      if (roomUsersCount.has(roomId)) {
        roomUsersCount.set(roomId, roomUsersCount.get(roomId) + 1);
      } else {
        roomUsersCount.set(roomId, 1);
      }
      // Enviar el número de usuarios conectados al cliente que se ha unido a la sala
    socket.emit('updateRoomUsersCount', roomUsersCount.get(roomId));
    const message = 'El escritor ha finalizado su capítulo, gracias por verlo';

    // Enviar el número de usuarios conectados a todos los clientes en la sala
    io.to(roomId).emit('updateRoomUsersCount', roomUsersCount.get(roomId));
    io.to(roomId).emit('finStream', { message });

    });

    // Manejar el evento 'textChange' para enviar el cambio de texto a otros escritores en la misma sala
    socket.on('textChange', (data) => {
      const roomId = writerSockets.get(socket.id);
      socket.to(roomId).emit('textChange', data.text);
    });

    // Maneja la desconexión del cliente y lo saca de la sala
    socket.on('disconnect', () => {
      console.log('Un usuario se ha desconectado');
      // Obtener el ID de la sala del usuario que se desconectó
      const roomId = writerSockets.get(socket.id);
      if (roomId) {
        // Decrementar el número de usuarios conectados a la sala
        roomUsersCount.set(roomId, roomUsersCount.get(roomId) - 1);
        // Enviar el número de usuarios conectados a todos los clientes en la sala
        io.to(roomId).emit('updateRoomUsersCount', roomUsersCount.get(roomId));
      }
      writerSockets.delete(socket.id);
      socket.leave(roomId);
    });
  });

  server.listen(app.get("port"), "0.0.0.0");
  console.log("Server on port", app.get("port"));
  console.log("Environment:", process.env.NODE_ENV);
}

main();
