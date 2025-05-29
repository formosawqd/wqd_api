module.exports = function handleChart(io, socket) {
  console.log("Chart模块连接:", socket.id);

  const sendChartData = () => {
    const data = Array.from({ length: 5 }, () =>
      Math.floor(Math.random() * 100)
    );
    socket.emit("chart:data", data);
  };

  // 连接后立即发送一次数据
  sendChartData();

  // 每2秒发送一次模拟数据
  const interval = setInterval(sendChartData, 2000);

  socket.on("disconnect", () => {
    clearInterval(interval);
    console.log("Chart模块断开:", socket.id);
  });
};
