const express = require("express");
const { getLists, getLazyTree } = require("../controllers/commonController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/products", authenticateToken, getLists);
router.get("/getLazyTree", authenticateToken, getLazyTree);

module.exports = router;
