// websocket/chat.js
module.exports = function handleChat(io, socket) {
  socket.on("chat:message", (msg) => {
    console.log(`收到消息: ${msg}`);

    // 只广播给其他客户端，不包括自己
    socket.broadcast.emit("chat:message", msg);
  });
};
