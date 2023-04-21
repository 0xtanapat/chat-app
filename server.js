const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "/public")));

io.on("connection", socket => {
  socket.on("newUser", username => {
    socket.broadcast.emit("update", username + " has joined the chat");
  });
  socket.on("exitChat", username => {
    socket.broadcast.emit("update", username + " has left the chat");
  });
  socket.on("chat", message => {
    socket.broadcast.emit("chat", message);
  });
});

server.listen(3000);
