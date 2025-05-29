module.exports = function handleNotification(io, socket) {
  socket.on("notify:push", (data) => {
    console.log("收到通知推送:", data);
    io.emit("notify:receive", data);
  });
};
