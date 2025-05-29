const handleChat = require("./chat");
const handleNotification = require("./notification");
const handleChart = require("./chart"); // 新增

module.exports = function registerSocketModules(io) {
  io.on("connection", (socket) => {
    console.log("客户端连接:", socket.id);

    handleChat(io, socket); // 注册聊天模块事件
    handleNotification(io, socket); // 注册通知模块事件
    handleChart(io, socket); // 注册chart模块

    socket.on("disconnect", () => {
      console.log("客户端断开:", socket.id);
    });
  });
};
