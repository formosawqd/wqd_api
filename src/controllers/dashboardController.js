const { getUserPermissions } = require("../models/userModel");

// 获取仪表盘数据接口
const getDashboardData = async (req, res) => {
  try {
    const permissions = await getUserPermissions(req.user.role_id);
    if (!permissions.includes("/dashboard")) {
      return res.status(403).json({ status: "error", message: "无权限访问" });
    }

    res.json({
      status: "success",
      message: "欢迎来到仪表盘",
      data: {
        stats: { users: 100, sales: 5000, orders: 300 },
      },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "服务器错误" });
  }
};

module.exports = { getDashboardData };
