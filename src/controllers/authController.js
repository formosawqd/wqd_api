const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getUserByUsername, createUser } = require("../models/userModel");
require("dotenv").config();
const CryptoJS = require("crypto-js");

// 注册接口
const register = async (req, res) => {
  const { username, password, role_id = 1 } = req.body;

  try {
    // 1. 检查用户名是否已存在
    const existingUser = await getUserByUsername(username);
    if (existingUser.length) {
      return res.status(200).json({ status: "error", message: "用户名已存在" });
    }

    // 2. 解密前端加密的密码
    const secretKey = process.env.SECRET_KEY || "wqdjwtsecret"; // 避免硬编码
    const decryptedPassword = CryptoJS.AES.decrypt(
      password,
      secretKey
    ).toString(CryptoJS.enc.Utf8);

    // 3. 对密码进行 bcrypt 加密
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(decryptedPassword, saltRounds);

    // 4. 创建用户
    const newUser = await createUser(username, hashedPassword, role_id);
    // console.log("newUser", newUser);

    if (!newUser) {
      return res.status(200).json({ status: "error", message: "用户创建失败" });
    }

    // 5. 只返回注册成功消息，不生成 token
    res.status(201).json({ status: "success", message: "注册成功，请登录" });
  } catch (error) {
    // console.error("注册错误:", error);
    res.status(500).json({ status: "error", message: "服务器错误" });
  }
};

// 登录接口
const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    // 1. 解密前端加密的密码
    const secretKey = process.env.SECRET_KEY || "wqdjwtsecret";
    const decryptedPassword = CryptoJS.AES.decrypt(
      password,
      secretKey
    ).toString(CryptoJS.enc.Utf8);

    // 2. 查询用户
    const user = await getUserByUsername(username);
    if (!user.length) {
      return res
        .status(200)
        .json({ status: "error", message: "用户名或密码错误" });
    }

    // 3. 比对密码
    const isPasswordValid = bcrypt.compareSync(
      decryptedPassword,
      user[0].password
    );
    if (!isPasswordValid) {
      return res
        .status(200)
        .json({ status: "error", message: "用户名或密码错误" });
    }

    // 4. 生成 Token
    const token = jwt.sign(
      { id: user[0].id, role_id: user[0].role_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ status: "success", message: "登录成功", token });
  } catch (error) {
    console.error("登录错误:", error);
    res.status(500).json({ status: "error", message: "服务器错误" });
  }
};

module.exports = { register, login };
