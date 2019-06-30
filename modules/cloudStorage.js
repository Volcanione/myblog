const fs = require('fs')
const path = require('path')
const COS = require('cos-nodejs-sdk-v5')

const SecretId = 'AKIDEGkEUVxApFRQJypZaNuCE9rKZekgOyRj' // 替换为用户的 SecretId
const SecretKey = 'EEyKQHvRmrhHfnhQ4VifOxGYcXEnHZgY' // 替换为用户的 SecretKey
const Bucket = 'neko-1259533112' // 替换为用户操作的 Bucket
const Region = 'ap-beijing'
const cos = new COS({ SecretId: SecretId, SecretKey: SecretKey })

module.exports.storage = (filepath, filename, callback) => {
  let fileName = +new Date() + filename
  cos.putObject(
    {
      Bucket: Bucket,
      Region: Region,
      Key: fileName,
      Body: fs.readFileSync(path.resolve(filepath))
    },
    function(err, data) {
      console.log(data)
      if (data.statusCode === 200) {
        callback(
          `https://neko-1259533112.cos-website.ap-beijing.myqcloud.com/${fileName}`
        )
      }
    }
  )
}
