const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// 🌍 Store players in memory
let players = {};

app.get("/", (req, res) => {
  res.send("GALAXION MULTIPLAYER ONLINE 🚀");
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // 👤 when player joins
  socket.on("join", (name) => {
    players[socket.id] = {
      id: socket.id,
      name: name || "Explorer"
    };

    io.emit("players", players);
  });

  // ❌ when player leaves
  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("players", players);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server running on", PORT);
});