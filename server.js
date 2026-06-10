const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

let players = {};

app.get("/", (req, res) => {
  res.send("GALAXION MOVEMENT SYSTEM ONLINE 🚀");
});

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  socket.on("join", (name) => {
    players[socket.id] = {
      id: socket.id,
      name: name || "Explorer",
      x: 0,
      y: 0
    };

    io.emit("playersUpdate", players);
  });

  socket.on("move", (direction) => {
    let player = players[socket.id];
    if (!player) return;

    if (direction === "up") player.y -= 1;
    if (direction === "down") player.y += 1;
    if (direction === "left") player.x -= 1;
    if (direction === "right") player.x += 1;

    io.emit("playersUpdate", players);
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("playersUpdate", players);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server running on", PORT);
});