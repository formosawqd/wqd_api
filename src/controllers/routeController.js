const { getRoutesByRole } = require("../models/routeModel");

const getRoutes = async (req, res) => {
  const { role_id } = req.user; // 解析 Token 获取角色 ID

  try {
    const routes = await getRoutesByRole(role_id);
    res.json({ status: "success", routes });
  } catch (error) {
    res.status(500).json({ status: "error", message: "服务器错误" });
  }
};

module.exports = { getRoutes };
