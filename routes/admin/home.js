const express = require('express')
const db = require('../../modules/db')
const router = express.Router()

//查询
router.get('/adminNote', (req, res) => {
  let { id } = req.session.user
  db.query('select * from note where adminID=? ', id, (err, data) => {
    if (err) return res.send({ code: 1, msg: '获取数据失败' })

    const newdata = data.map(item => {
      return { time: item.createTime, value: item.content }
    })
    res.send({
      code: 0,
      msg: '获取数据成功！',
      data: newdata
    })
  })
})
//添加
router.post('/adminNote', (req, res) => {
  let { id } = req.session.user
  let { time: createTime, value: content } = req.body
  db.query(
    'insert into note set ?',
    { adminID: id, createTime, content },
    (err, data) => {
      if (err) return res.send({ code: 1, msg: '添加失败' })
      res.send({ code: 0, msg: '添加成功' })
    }
  )
})
//修改
router.patch('/adminNote', (req, res) => {
  let { time: createTime, value: content } = req.body
  db.query(
    'update note set content=? where createTime=?',
    [content, createTime],
    (err, data) => {
      if (err) return res.send({ code: 1, msg: '修改失败' })
      res.send({ code: 0, msg: '修改成功' })
    }
  )
})
//删除
router.delete('/adminNote', (req, res) => {
  let { time: createTime } = req.body
  db.query('delete from note where createTime=?', [createTime], (err, data) => {
    if (err) return res.send({ code: 1, msg: '删除失败' })
    res.send({ code: 0, msg: '删除成功' })
  })
})

module.exports = router
