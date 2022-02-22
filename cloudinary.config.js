const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// put your own config here

cloudinary.config({
  cloud_name: "dqkvhiblt",
  api_key: "915764929537628",
  api_secret: "JgtKnEyZ66VYnzee7d7W8Vy3uLQ",
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    allowed_formats: ["jpg", "png"],
    folder: "testImage",
    //resource_type: 'raw',
  },
});

module.exports = multer({ storage });
