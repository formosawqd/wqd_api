const multer = require("multer");
const path = require("path");
const fs = require("fs");
const iconv = require("iconv-lite");
const uploadsDir = path.resolve(__dirname, "../uploads");

// 查询文件列表
const getUploadedFiles = (req, res) => {
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ status: "error", message: "读取文件失败" });
    }
    const fileList = files.map((filename) => ({
      name: filename,
      url: `/api/uploads/download/${filename}`,
    }));
    res.json({ status: "success", data: fileList });
  });
};

// 下载接口
const downloadFile = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsDir, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ status: "error", message: "文件不存在" });
  }

  // 设置 Content-Type，确保文件能被正确识别
  const fileExtension = path.extname(filename).toLowerCase();
  let contentType = "application/octet-stream"; // 默认类型是二进制流

  // 根据文件扩展名设置 MIME 类型
  if (fileExtension === ".jpg" || fileExtension === ".jpeg") {
    contentType = "image/jpeg";
  } else if (fileExtension === ".png") {
    contentType = "image/png";
  } else if (fileExtension === ".gif") {
    contentType = "image/gif";
  }

  res.setHeader("Content-Type", contentType);
  res.download(filePath, filename);
};

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
    const name = iconv.decode(Buffer.from(file.originalname, "latin1"), "utf8");
    cb(null, name); // 如果你需要编码后存储
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
    filePath: `/uploads/${req.file.originalname}`,
  });
};

module.exports = {
  uploadMiddleware,
  handleUpload,
  getUploadedFiles,
  downloadFile,
};
