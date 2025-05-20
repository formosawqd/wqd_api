const multer = require("multer");
const path = require("path");
const fs = require("fs");
const iconv = require("iconv-lite");
const uploadsDir = path.resolve(__dirname, "../uploads");
const tmpDir = path.resolve(__dirname, "../tmp");

// 确保目录存在
[uploadsDir, tmpDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// 📁 查询文件列表
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

// 📥 小文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const name = iconv.decode(Buffer.from(file.originalname, "latin1"), "utf8");
    cb(null, name);
  },
});
const uploadMiddleware = multer({ storage });

// 上传接口处理函数
const handleUpload = (req, res) => {
  console.log(req.file);

  if (!req.file) {
    return res.status(400).json({ status: "error", message: "未上传文件" });
  }
  res.json({
    status: "success",
    message: "上传成功",
    filePath: `/uploads/${req.file.filename}`,
  });
};

// 📤 下载
const downloadFile = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsDir, filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ status: "error", message: "文件不存在" });
  }

  const fileExtension = path.extname(filename).toLowerCase();
  let contentType = "application/octet-stream";
  if (fileExtension === ".jpg" || fileExtension === ".jpeg")
    contentType = "image/jpeg";
  else if (fileExtension === ".png") contentType = "image/png";
  else if (fileExtension === ".gif") contentType = "image/gif";
  else if (fileExtension === ".pdf") contentType = "application/pdf";

  res.setHeader("Content-Type", contentType);
  res.download(filePath, filename);
};

// 实现处理 multipart/form-data 的中间件
const chunkStorage = multer.memoryStorage();
const chunkUploadMiddleware = multer({ storage: chunkStorage });

// 🧩 分片上传（接收分片）
const handleChunkUpload = (req, res) => {
  // console.log("req.body:", req.body);
  // console.log("req.file:", req.file);

  const { filename, chunkIndex, fileHash } = req.body;

  if (!filename || chunkIndex === undefined || !fileHash) {
    return res.status(400).json({ status: "error", message: "参数不完整" });
  }

  const chunkDir = path.join(tmpDir, fileHash);
  if (!fs.existsSync(chunkDir)) {
    fs.mkdirSync(chunkDir, { recursive: true });
  }

  const chunkPath = path.join(chunkDir, chunkIndex);
  const buffer = req.file.buffer;

  fs.writeFile(chunkPath, buffer, (err) => {
    if (err) {
      console.error("写入分片失败:", err);
      return res.status(500).json({ status: "error", message: "写入分片失败" });
    }
    res.json({ status: "success", message: `Chunk ${chunkIndex} uploaded` });
  });
};

// 🔄 合并分片
const mergeChunks = async (req, res) => {
  const { filename, totalChunks, fileHash } = req.body; // 新增 fileHash

  if (!fileHash) {
    return res
      .status(400)
      .json({ status: "error", message: "缺少 fileHash 参数" });
  }

  const chunkDir = path.join(tmpDir, fileHash);
  const targetPath = path.join(uploadsDir, filename);
  try {
    const writeStream = fs.createWriteStream(targetPath);

    for (let i = 0; i < totalChunks; i++) {
      const chunkPath = path.join(chunkDir, String(i));
      if (!fs.existsSync(chunkPath)) {
        throw new Error(`缺少第${i}个分片`);
      }
      // 读取当前分片，写入目标文件
      const data = fs.readFileSync(chunkPath);
      writeStream.write(data);
    }

    writeStream.end();

    // 等待写入结束事件
    writeStream.on("finish", () => {
      // 删除临时分片目录
      fs.rmSync(chunkDir, { recursive: true, force: true });
      console.log("合并完成");
      res.json({
        status: "success",
        message: "合并完成",
        filePath: `/uploads/${filename}`,
      });
    });

    writeStream.on("error", (err) => {
      console.error("写入目标文件失败:", err);
      res.status(500).json({ status: "error", message: "写入文件失败" });
    });
  } catch (error) {
    console.error("合并失败:", error);
    res
      .status(500)
      .json({ status: "error", message: error.message || "合并失败" });
  }
};

// ✅ 检查是否已上传过（断点续传）
const checkUploaded = (req, res) => {
  // console.log("checkUploaded", req.query);

  const { hash, filename } = req.query.params;
  if (!hash || !filename) {
    return res.status(400).json({ status: "error", message: "缺少参数" });
  }

  // 已上传完整文件的路径（用于秒传判断）
  const fullFilePath = path.join(uploadsDir, filename);
  if (fs.existsSync(fullFilePath)) {
    return res.json({ uploaded: true, chunks: [] });
  }

  // 分片目录路径（用于断点续传）
  const chunkDir = path.join(tmpDir, hash);
  let chunks = [];
  if (fs.existsSync(chunkDir)) {
    chunks = fs.readdirSync(chunkDir).filter((f) => /^\d+$/.test(f)); // 只保留数字分片
  }

  res.json({ uploaded: false, chunks });
};

module.exports = {
  uploadMiddleware,
  chunkUploadMiddleware,
  handleUpload,
  getUploadedFiles,
  downloadFile,
  handleChunkUpload,
  mergeChunks,
  checkUploaded,
};
