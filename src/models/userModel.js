const db = require("./db"); // 数据库连接模块

const getUserByUsername = async (username) => {
  try {
    // console.log("username:", username);

    const result = await db.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);

    // console.log("查询结果:", result[0]);
    return result[0]; // 返回查询结果
  } catch (error) {
    console.error("数据库查询失败:", error);
    throw error;
  }
};

// 创建用户
const createUser = async (username, hashedPassword, role_id) => {
  try {
    const result = await db.query(
      "INSERT INTO users (username, password, role_id) VALUES (?, ?, ?)",
      [username, hashedPassword, role_id]
    );
    return result.insertId; // 返回新插入用户的ID
  } catch (error) {
    throw error;
  }
};

module.exports = { getUserByUsername, createUser };
