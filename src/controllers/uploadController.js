const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 确保 uploads 文件夹存在
const uploadPath = path.resolve(__dirname, "../uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// 配置存储引擎
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const uploadMiddleware = multer({ storage });

// 上传接口处理函数
const handleUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ status: "error", message: "未上传文件" });
  }

  res.json({
    status: "success",
    message: "上传成功",
    filePath: `/uploads/${req.file.filename}`,
  });
};

module.exports = {
  uploadMiddleware,
  handleUpload,
};
