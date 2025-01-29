const { Server } = require('socket.io');
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);

const socketSetUp = () => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  // Store admin socket ID and online users
  let adminSocketId = null;
  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle user or admin connection
    socket.on('user-connected', (userId, role) => {
      console.log(role)
      if (role === 'admin') {
        adminSocketId = socket.id;
        console.log('Admin connected:', adminSocketId);
      } else {
        onlineUsers.set(socket.id, userId);
        console.log('User connected:', userId);
      }
      console.log(onlineUsers)
    });

    // Handle user messages sent to admin
    socket.on('sendMessage', ({ message, userId }) => {
      console.log(`User (${userId}) sent a message: ${message}`);

      if (adminSocketId) {
        io.to(adminSocketId).emit('receiveMessage', {
          senderId: userId,
          userId,
          message,
          timestamp: new Date().toISOString(),
        });
        console.log(`Message forwarded to admin: ${message} from ${userId}`);
      } else {
        console.log('Admin is not connected, message cannot be delivered');
      }
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
      if (socket.id === adminSocketId) {
        console.log('Admin disconnected');
        adminSocketId = null;
      } else if (onlineUsers.has(socket.id)) {
        const userId = onlineUsers.get(socket.id);
        onlineUsers.delete(socket.id);
        console.log(`User (${userId}) disconnected`);
      }
    });
  });
};

// Start the server
server.listen(4001, () => {
  console.log('Socket.io server running on port 4001');
});

module.exports = socketSetUp;
