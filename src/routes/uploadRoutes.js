const express = require("express");
const router = express.Router();
const {
  uploadMiddleware,
  chunkUploadMiddleware,
  handleUpload,
  handleChunkUpload,
  mergeChunks,
  checkUploaded,
  getUploadedFiles,
  downloadFile,
} = require("../controllers/uploadController");
// 小文件
router.post("/upload", uploadMiddleware.single("file"), handleUpload);

// 分片
router.post(
  "/upload/chunk",
  chunkUploadMiddleware.single("file"),
  handleChunkUpload
);
router.post("/upload/merge", mergeChunks);
router.get("/upload/check", checkUploaded);
// 查询/下载
router.get("/list", getUploadedFiles);
router.get("/download/:filename", downloadFile);

module.exports = router;
