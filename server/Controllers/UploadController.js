const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const uploadMedia = async (req, res) => {
  try {
    const file = req.file;

    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "auto" // tự nhận diện ảnh/video
    });

    // Xoá file local
    fs.unlinkSync(file.path);

    res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadMedia };