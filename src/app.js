const express = require("express");
const cors = require("cors");
const routes = require("./routes"); // 统一管理路由
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", routes); // 这里只需要挂载 `/api`，所有子路由在 `routes/index.js` 内定义

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
