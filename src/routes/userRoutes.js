const express = require("express");
const {
  getProfile,
  getUserRoutes,
  getUserMenu,
} = require("../controllers/userController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", authenticateToken, getProfile);
router.get("/getRoutes", authenticateToken, getUserRoutes);
router.get("/getMenu", authenticateToken, getUserMenu);

module.exports = router;
