const { getUserById } = require("../models/userModel");
const { getRoutesByRole, getMenuByRole } = require("../models/routeModel");

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
  const { role_id } = req.user; // 解析 Token 获取角色 ID
  try {
    const routes = await getRoutesByRole(role_id);
    res.json({
      status: "success",
      code: 100,
      data: {
        routes,
      },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "服务器错误" });
  }
};

const getUserMenu = async (req, res) => {
  const { role_id } = req.user; // 解析 Token 获取角色 ID

  try {
    const menu = await getMenuByRole(role_id);
    res.json({
      status: "success",
      code: 100,
      data: {
        menu,
      },
    });
  } catch (error) {
    console.error("获取菜单失败:", error);
    res.status(500).json({ status: "error", message: "服务器错误" });
  }
};

module.exports = { getProfile, getUserRoutes, getUserMenu };
