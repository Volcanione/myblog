const fs = require('fs')
const path = require('path')
const md5 = require('md5')

const express = require('express')

const db = require('../../modules/db')
const uploader = require('../uploader')
const cloud = require('../../modules/cloudStorage')

const router = express.Router()

//提交信息
router.post('/updateAdmin', (req, res) => {
  db.query(
    'update admin set? where username=?',
    [req.body, req.body.username],
    (err, data) => {
      if (err) return res.send({ code: 1, msg: '修改失败' })
      res.send({ code: 0, msg: '操作成功' })
    }
  )
})

//修改密码

router.post('/setPassword', (req, res) => {
  const { username, oldPassword, password } = req.body
  db.query(
    'select * from admin where username=? and password=?',
    [username, md5(oldPassword)],
    (err, data) => {
      if (err) return res.send({ code: 1, msg: '修改失败' })
      if (data.length === 0) return res.send({ code: 2, msg: '当前密码错误' })
      db.query(
        'update admin set password=? where username=?',
        [md5(password), username],
        (err, data) => {
          if (err) return res.send({ code: 1, msg: '修改失败' })
          res.send({ code: 0, msg: '修改密码成功' })
        }
      )
    }
  )
})

//上传头像
uploader({
  router,
  url: '/upload',
  field: 'head',
  done(req, res) {
    let { path, filename } = req.file
    console.log(path)

    cloud.storage(path, filename, data => {
      fs.unlink(path, err => {
        if (err) return console.log(err)
        res.send({ code: 0, msg: '上传成功', data: { src: data } })
      })
    })
  }
})
module.exports = router
