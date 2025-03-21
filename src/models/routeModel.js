const db = require("./db");

const getRoutesByRole = async (role_id) => {
  try {
    const result = await db.query(
      `SELECT r.path, r.name FROM routes r
      JOIN role_routes rr ON r.id = rr.route_id
      WHERE rr.role_id = ?`,
      [role_id]
    );
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = { getRoutesByRole };
