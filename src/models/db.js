const mysql = require("mysql2");
require("dotenv").config(); // 加载 .env 配置

const db = mysql
  .createPool({
    host: process.env.DB_HOST, // 'localhost'
    user: process.env.DB_USER, // 'root'
    password: process.env.DB_PASSWORD, // 'formosa'
    database: process.env.DB_NAME, // 'wqd_db'
  })
  .promise(); // 使用 promise 化的连接池

module.exports = db; // 导出连接池
