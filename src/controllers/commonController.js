const db = require("../models/db.js");

// 获取分页数据
const getLists = async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query; // 默认每页10条数据，page为当前页
  try {
    const offset = (page - 1) * pageSize;

    // 查询数据库中的数据
    const [products] = await db.query(
      "SELECT * FROM products LIMIT ? OFFSET ?",
      [Number(pageSize), Number(offset)]
    );

    // 获取总数，计算总页数
    const [[{ total }]] = await db.query(
      "SELECT COUNT(*) AS total FROM products"
    );
    const totalPages = Math.ceil(total / pageSize);

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

// 懒加载树节点
const getLazyTree = async (req, res) => {
  const { parentId = null } = req.query;

  try {
    // 查询指定父节点下的所有子节点
    const [rows] = await db.query(
      "SELECT id, name FROM categories WHERE parent_id " +
        (parentId === null ? "IS NULL" : "= ?"),
      parentId === null ? [] : [parentId]
    );

    // 判断每个节点是否有子节点
    const nodesWithLeaf = await Promise.all(
      rows.map(async (item) => {
        const [[{ count }]] = await db.query(
          "SELECT COUNT(*) AS count FROM categories WHERE parent_id = ?",
          [item.id]
        );
        return {
          title: item.name,
          key: item.id,
          isLeaf: count === 0,
        };
      })
    );

    res.json({
      status: "success",
      data: nodesWithLeaf,
    });
  } catch (error) {
    console.error("懒加载树失败:", error);
    res.status(500).json({ status: "error", message: "服务器错误" });
  }
};

module.exports = { getLists, getLazyTree };
