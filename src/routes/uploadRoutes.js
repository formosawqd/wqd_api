const express = require("express");
const router = express.Router();
const {
  uploadMiddleware,
  handleUpload,
} = require("../controllers/uploadController");

// 这里出错：说明 handleUpload 是 undefined
router.post("/upload", uploadMiddleware.single("file"), handleUpload);

module.exports = router;
