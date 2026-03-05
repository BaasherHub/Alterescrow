const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  socket.on("trade:join", (tradeId) => socket.join(`trade:${tradeId}`));
  socket.on("trade:message", ({ tradeId, message, sender }) => {
    io.to(`trade:${tradeId}`).emit("trade:message", { tradeId, message, sender, ts: Date.now() });
  });
  socket.on("trade:status", ({ tradeId, status }) => {
    io.to(`trade:${tradeId}`).emit("trade:status", { tradeId, status, ts: Date.now() });
  });
});

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`Realtime service listening on ${port}`);
});
