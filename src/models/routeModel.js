const db = require("./db");

const getRoutesByRole = async (role_id) => {
  try {
    const [rows] = await db.query(
      `SELECT r.path, r.name, r.label, r.folder, r.file, r.component 
      FROM routes r
      JOIN role_routes rr ON r.id = rr.route_id
      WHERE rr.role_id = ?`,
      [role_id]
    );
    return rows; // 直接返回查询结果
  } catch (error) {
    throw error;
  }
};

const getMenuByRole = async (role_id) => {
  try {
    // 查询该角色可访问的所有路由
    const [routes] = await db.query(
      `SELECT r.id, r.path, r.label AS menuName, r.folder, r.file, r.component, r.parent_id, r.icon
       FROM routes r
       JOIN role_routes rr ON r.id = rr.route_id
       WHERE rr.role_id = ?`,
      [role_id]
    );
    // 用 id 作为键存储所有路由
    console.log("routes", routes);

    const routeMap = {};
    routes.forEach((route) => {
      routeMap[route.id] = {
        path: route.path,
        menuName: route.menuName,
        icon: route.icon, // 默认图标
        children: [],
      };
    });

    // 创建最终的菜单结构
    const menu = [];

    // 遍历所有路由，正确分配到父级
    routes.forEach((route) => {
      if (route.parent_id === null) {
        // 顶级菜单
        menu.push(routeMap[route.id]);
      } else {
        // 子菜单，正确匹配父级
        routeMap[route.parent_id]?.children.push(routeMap[route.id]);
      }
    });

    return menu;
  } catch (error) {
    console.error("获取菜单失败:", error);
    throw error;
  }
};

module.exports = { getRoutesByRole, getMenuByRole };
