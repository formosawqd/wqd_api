const express = require("express");
const { getProfile, getUserRoutes } = require("../controllers/userController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", authenticateToken, getProfile);
router.get("/getRoutes", authenticateToken, getUserRoutes);

module.exports = router;
