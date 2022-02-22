const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const multer = require('multer')

// put your onw config here
cloudinary.config()

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    allowed_formats: ['jpg', 'png'],
    folder: 'testImage',
    //ressource_type: 'raw',
  },
})

module.exports = multer({ storage })