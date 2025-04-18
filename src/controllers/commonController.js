const db = require("../models/db.js");

// 获取分页数据
const getLists = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // 默认每页10条数据，page为当前页
  try {
    const offset = (page - 1) * limit;

    // 查询数据库中的数据
    const [products] = await db.query(
      "SELECT * FROM products LIMIT ? OFFSET ?",
      [Number(limit), Number(offset)]
    );

    // 获取总数，计算总页数
    const [[{ total }]] = await db.query(
      "SELECT COUNT(*) AS total FROM products"
    );
    const totalPages = Math.ceil(total / limit);

    res.json({
      page: Number(page),
      totalPages,
      totalItems: total,
      data: products,
    });
  } catch (error) {
    console.error("获取产品列表失败:", error);
    res.status(500).json({ status: "error", message: "服务器错误" });
  }
};
module.exports = { getLists };
