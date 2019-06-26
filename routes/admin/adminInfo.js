const fs = require('fs')
const path = require('path')

const express = require('express')
const db = require('../../modules/db')
const uploader = require('../uploader')

const router = express.Router()

//提交信息
router.post('/updateAdmin', (req, res) => {
  console.log(req.body)
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
    [username, oldPassword],
    (err, data) => {
      if (err) return res.send({ code: 1, msg: '修改失败' })
      if (data.length === 0) return res.send({ code: 2, msg: '当前密码错误' })
      db.query(
        'update admin set password=? where username=?',
        [password, username],
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
    let file = path.join('/', req.file.path)
    res.send({ code: 0, msg: '上传成功', data: { src: file } })
  }
})

module.exports = router
