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
  if (!req.file) {
    return res.status(400).json({ status: "error", message: "未上传文件" });
  }
  res.json({
    status: "success",
    message: "上传成功",
    filePath: `/uploads/${req.file.originalname}`,
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

// 🧩 分片上传（接收分片）
const handleChunkUpload = (req, res) => {
  const { filename, chunkIndex } = req.body;
  const chunkDir = path.join(tmpDir, filename);
  if (!fs.existsSync(chunkDir)) {
    fs.mkdirSync(chunkDir, { recursive: true });
  }

  const chunkPath = path.join(chunkDir, chunkIndex);
  const stream = fs.createWriteStream(chunkPath);
  req.pipe(stream);
  req.on("end", () => {
    res.json({ status: "success", message: `Chunk ${chunkIndex} uploaded` });
  });
};

// 🔄 合并分片
const mergeChunks = (req, res) => {
  const { filename, totalChunks } = req.body;
  const chunkDir = path.join(tmpDir, filename);
  const targetPath = path.join(uploadsDir, filename);

  const writeStream = fs.createWriteStream(targetPath);
  let current = 0;

  function appendChunk() {
    if (current >= totalChunks) {
      fs.rmSync(chunkDir, { recursive: true, force: true });
      return res.json({
        status: "success",
        message: "合并完成",
        filePath: `/uploads/${filename}`,
      });
    }

    const chunkPath = path.join(chunkDir, `${current}`);
    const readStream = fs.createReadStream(chunkPath);
    readStream.pipe(writeStream, { end: false });
    readStream.on("end", () => {
      current++;
      appendChunk();
    });
    readStream.on("error", (err) => {
      console.error("合并失败:", err);
      res.status(500).json({ status: "error", message: "合并失败" });
    });
  }

  appendChunk();
};

// ✅ 检查是否已上传过（断点续传）
const checkUploaded = (req, res) => {
  const { filename } = req.query;
  const filePath = path.join(uploadsDir, filename);
  const chunkDir = path.join(tmpDir, filename);
  if (fs.existsSync(filePath)) {
    return res.json({ uploaded: true, chunks: [] });
  }

  let chunks = [];
  if (fs.existsSync(chunkDir)) {
    chunks = fs.readdirSync(chunkDir);
  }
  res.json({ uploaded: false, chunks });
};

module.exports = {
  uploadMiddleware,
  handleUpload,
  getUploadedFiles,
  downloadFile,
  handleChunkUpload,
  mergeChunks,
  checkUploaded,
};
