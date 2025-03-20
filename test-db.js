const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "formosa",
  database: "wqd_db",
});

connection.connect((err) => {
  if (err) {
    console.error("❌ 数据库连接失败:", err);
  } else {
    console.log("✅ 数据库连接成功");
  }
  connection.end();
});
