const express = require("express");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const commonRoutes = require("./commonRoutes.js");

const router = express.Router();

// 挂载不同的模块
router.use("/auth", authRoutes); // /api/auth/...
router.use("/user", userRoutes); // /api/user/...
router.use("/common", commonRoutes); // /api/common/...

module.exports = router;
