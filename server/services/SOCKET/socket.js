const socketSetUp = (server) => {
  const { Server } = require("socket.io");
  
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_PORT || "*",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  const users = new Map(); // userId -> {socketId, role, name, status, department}
  const activeChats = new Map(); // chatId -> {customerId, agentId, messages, status, department}
  const chatQueue = new Map(); // department -> [{customerId, timestamp, priority}]

  let adminId = null; // Store the admin ID (only one admin allowed)

  // Utility Functions
  const createChatId = () => `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Socket Connection Handler
  io.on("connection", (socket) => {
    console.log(`New connection: ${socket.id}`);

    // User registration
    socket.on("register", ({ userId, role, name, department }) => {
      if (role === "admin") {
        if (adminId) {
          return socket.emit("error", { message: "Admin is already registered." });
        }
        adminId = userId;
      }

      users.set(userId, {
        socketId: socket.id,
        role,
        name,
        department,
        status: role === "admin" ? "active" : "available"
      });

      io.emit("userUpdate", {
        admin: adminId ? users.get(adminId) : null,
        agents: Array.from(users.values()).filter((u) => u.role === "agent")
      });
    });

    // Start chat request
    socket.on("startChat", ({ customerId, department, query }) => {
      const chatId = createChatId();
      activeChats.set(chatId, {
        customerId,
        agentId: adminId, // Assign all chats to the admin
        messages: [],
        status: "active",
        department,
        startTime: Date.now()
      });

      const adminSocket = adminId ? users.get(adminId).socketId : null;
      if (adminSocket) {
        io.to(adminSocket).emit("newChat", { chatId, customerId });
      }

      socket.emit("chatAssigned", { chatId, adminId });
    });

    // Message handling
    socket.on("sendMessage", ({ chatId, message }) => {
      const chat = activeChats.get(chatId);
      if (!chat) return;

      const messageData = {
        sender: users.get(socket.id)?.role === "admin" ? adminId : chat.customerId,
        message,
        timestamp: Date.now()
      };

      chat.messages.push(messageData);

      const recipientId = messageData.sender === adminId ? chat.customerId : adminId;
      const recipientSocket = users.get(recipientId)?.socketId;

      if (recipientSocket) {
        io.to(recipientSocket).emit("receiveMessage", { chatId, ...messageData });
      }
    });

    // Disconnect handling
    socket.on("disconnect", () => {
      const userId = Array.from(users.entries())
        .find(([_, data]) => data.socketId === socket.id)?.[0];

      if (userId === adminId) {
        adminId = null;
      }

      users.delete(userId);
      io.emit("userUpdate", {
        admin: adminId ? users.get(adminId) : null,
        agents: Array.from(users.values()).filter((u) => u.role === "agent")
      });
    });
  });
};

module.exports = socketSetUp;
