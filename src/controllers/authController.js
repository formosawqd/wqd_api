const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getUserByUsername, createUser } = require("../models/userModel");
require("dotenv").config();
const CryptoJS = require("crypto-js");

// 注册接口
const register = async (req, res) => {
  const { username, password, role_id = 2 } = req.body;

  try {
    // 检查用户名是否已存在
    const existingUser = await getUserByUsername(username);
    console.log("existingUser:", existingUser);

    if (existingUser.length) {
      return res.status(200).json({ status: "error", message: "用户名已存在" });
    }
    const secretKey = "wqdjwtsecret"; // 与前端一致的密钥
    const decryptedPassword = CryptoJS.AES.decrypt(
      password,
      secretKey
    ).toString(CryptoJS.enc.Utf8);

    // 对密码进行二次加密
    const saltRounds = 10; // 加密强度
    const hashedPassword = bcrypt.hashSync(decryptedPassword, saltRounds);
    // 直接存储加密后的密码（假设前端已加密）
    console.log("hashedPassword", hashedPassword);

    await createUser(username, hashedPassword, role_id);

    res.status(201).json({ status: "success", message: "注册成功" });
  } catch (error) {
    console.log("error", error);

    res.status(500).json({ status: "error", message: "服务器错误" });
  }
};

// 登录接口
const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    // 解密前端加密的密码
    const secretKey = "wqdjwtsecret";
    const decryptedPassword = CryptoJS.AES.decrypt(
      password,
      secretKey
    ).toString(CryptoJS.enc.Utf8);
    console.log("decryptedPassword", decryptedPassword);

    // 查询用户
    const user = await getUserByUsername(username);
    console.log("user:", user);

    if (!user) {
      return res
        .status(200)
        .json({ status: "error", message: "用户名或密码错误" });
    }

    // 比对密码
    const isPasswordValid = bcrypt.compareSync(
      decryptedPassword,
      user[0].password
    );
    if (!isPasswordValid) {
      return res
        .status(200)
        .json({ status: "error", message: "用户名或密码错误" });
    }

    // 生成 JWT Token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ status: "success", message: "登录成功", token });
  } catch (error) {
    res.status(500).json({ status: "error", message: "服务器错误" });
  }
};

module.exports = { register, login };
