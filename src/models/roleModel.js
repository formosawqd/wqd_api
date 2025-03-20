const db = require("../config/dbConfig");

const createRole = async (name) => {
  const [result] = await db.query("INSERT INTO roles (name) VALUES (?)", [
    name,
  ]);
  return result.insertId;
};

module.exports = { createRole };
