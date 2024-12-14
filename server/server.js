const cors = require("cors");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const port = 3000;

const client_url = "http://localhost:5173";

// Update CORS to allow frontend URL
app.use(
  cors({
    origin: client_url,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// Serve the static files for the admin UI
app.use(express.static(path.join(__dirname, "public")));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: client_url,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  },
});

// Data structure to track rooms and clients
const rooms = {};

io.on("connection", (socket) => {
  console.log("Client connected with id: " + socket.id);

  socket.on("cursor-move", ({ roomId, position }) => {
    socket.broadcast
      .to(roomId)
      .emit("cursor-update", { id: socket.id, position });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected: " + socket.id);

    // Remove client from rooms
    for (const roomId in rooms) {
      rooms[roomId] = rooms[roomId].filter((client) => client.id !== socket.id);
      if (rooms[roomId].length === 0) delete rooms[roomId];
    }

    // Notify all connected clients about the updated rooms
    io.emit("rooms", rooms);
  });

  socket.on("join", ({ name, roomId }) => {
    // Create the room if it doesn't exist
    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }

    // Add client to the room
    rooms[roomId].push({ id: socket.id, name });

    socket.join(roomId);
    socket.emit("message", {
      user: "admin",
      text: `${name}, welcome to room ${roomId}!`,
    });
    socket.broadcast
      .to(roomId)
      .emit("message", { user: "admin", text: `${name} has joined the room!` });

    // Notify all connected clients about the updated rooms
    io.emit("rooms", rooms);
  });

  // Send updated room info on client connection
  io.emit("rooms", rooms);
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
