const mysql = require("mysql2");
require("dotenv").config(); // 如果使用 .env，确保引入 dotenv

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "wqd_db",
});

console.log("数据库连接信息:", {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD ? "********" : "未设置",
  database: process.env.DB_NAME,
});

module.exports = db.promise();
