const multer = require("multer");
const { v4: uuidv4 } = require('uuid'); // không bị trùng tên ảnh

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    const fileName = uuidv4() + "-" + file.originalname;
    cb(null, fileName);
  }
});

const upload = multer({ storage });

module.exports = upload;