const { getUserById, getUserPermissions } = require("../models/userModel");

// 获取用户个人信息接口
const getProfile = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user)
      return res.status(404).json({ status: "error", message: "用户不存在" });

    res.json({
      status: "success",
      data: {
        id: user.id,
        username: user.username,
        role_id: user.role_id,
      },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "服务器错误" });
  }
};

// 获取用户可访问的路由接口
const getUserRoutes = async (req, res) => {
  try {
    const permissions = await getUserPermissions(req.user.role_id);
    res.json({ status: "success", routes: permissions });
  } catch (error) {
    res.status(500).json({ status: "error", message: "服务器错误" });
  }
};

module.exports = { getProfile, getUserRoutes };
