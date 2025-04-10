const express = require("express");
const { uploadMedia } = require("../Controllers/UploadController");
const upload = require("../middleware/Upload");

const router = express.Router();

router.post("/", upload.single("file"), uploadMedia);

module.exports = router;