const db = require("../config/dbConfig");

const createPermission = async (route) => {
  const [result] = await db.query(
    "INSERT INTO permissions (route) VALUES (?)",
    [route]
  );
  return result.insertId;
};

module.exports = { createPermission };
