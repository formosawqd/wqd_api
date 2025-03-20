const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getUserByUsername, createUser } = require("../models/userModel");
require("dotenv").config();

// 注册接口
const register = async (req, res) => {
  const { username, password, role_id } = req.body;

  try {
    // 检查用户名是否已存在
    const existingUser = await getUserByUsername(username);
    console.log("existingUser:", existingUser);

    if (existingUser.length) {
      return res.status(400).json({ status: "error", message: "用户名已存在" });
    }

    // 直接存储加密后的密码（假设前端已加密）
    await createUser(username, password, role_id);

    res.status(201).json({ status: "success", message: "注册成功" });
  } catch (error) {
    res.status(500).json({ status: "error", message: "服务器错误" });
  }
};

// 登录接口
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // 检查用户是否存在
    const user = await getUserByUsername(username);
    if (!user)
      return res
        .status(400)
        .json({ status: "error", message: "用户名或密码错误" });

    // 使用 bcrypt 比较加密密码
    const isPasswordValid = bcrypt.compareSync(password, user.password); // 比对加密的密码
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ status: "error", message: "用户名或密码错误" });
    }

    // 生成 JWT Token
    const token = jwt.sign(
      { id: user.id, username: user.username, role_id: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token 过期时间为 1 小时
    );

    res.json({ status: "success", message: "登录成功", token });
  } catch (error) {
    res.status(500).json({ status: "error", message: "服务器错误" });
  }
};

module.exports = { register, login };
