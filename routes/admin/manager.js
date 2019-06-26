const express = require('express')
const db = require('../../modules/db')
const createAdmin = require('../../modules/addAdmin')
const router = express.Router()

//查询管理员列表
router.get('/manager', (req, res) => {
  db.query('select * from admin ', null, (err, data) => {
    // data.forEach((item) => {
    //     delete item.password
    // })
    if (err) return res.send({ code: 1, msg: '获取数据失败' })
    res.send({ code: 0, total: data.length, msg: '访问成功', data })
  })
})

//管理员状态
router.patch('/manager', (req, res) => {
  const { id, status } = req.body
  db.query(
    'update  admin set status=? where id= ?',
    [status, id],
    (err, data) => {
      if (err) return res.send({ code: 1, msg: '操作失败！' })
      res.send({ code: 0, msg: '操作成功！' })
    }
  )
})

//添加管理员
router.post('/manager', (req, res) => {
  console.log(req.body)

  //  console.log(new createAdmin(req.body));

  db.query(
    'select * from admin where username=?',
    req.body.username,
    (err, data) => {
      if (err) return res.send({ code: 1, msg: '获取数据失败' })
      if (data.length === 1) {
        return res.send({ code: 1, msg: '添加失败，用户名已存在' })
      }

      db.query(
        'insert into admin set ?',
        new createAdmin(req.body),
        (err, data) => {
          res.send({ code: 0, msg: '添加成功' })
        }
      )
    }
  )
})

module.exports = router
