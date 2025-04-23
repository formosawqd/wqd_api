const express = require("express");
const router = express.Router();

const {
  uploadMiddleware,
  handleUpload,
} = require("../controllers/uploadController"); // 你之前的上传逻辑

const {
  getUploadedFiles,
  downloadFile,
} = require("../controllers/uploadController"); // 新增的查询和下载逻辑

router.post("/upload", uploadMiddleware.single("file"), handleUpload);

router.get("/list", getUploadedFiles);

router.get("/download/:filename", downloadFile);

module.exports = router;
