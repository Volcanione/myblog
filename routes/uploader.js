const multer = require('multer')
const fs = require('fs')
const images = require('images')

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage: storage }) // 文件储存路径
const uploader = ({ router, url, field, done: callback }) => {
  if (!router || !url || !field) {
    return
  }

  router.post(url, upload.single(field), (req, res, next) => {
    if (req.file.mimetype.startsWith('image')) {
      images(req.file.path)
        .size(1920)
        .save(req.file.path, {
          quality: 50
        })
    }
    callback && callback(req, res)
  })
}

module.exports = uploader
