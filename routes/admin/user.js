const express = require('express')
const db = require('../../modules/db')
const router = express.Router()

router.get('/registerUser', (req, res) => {
  const { page, limit } = req.query
  db.query(
    'select * from register order by id asc limit ?, ?;select count(*) as total from register;',
    [+(page - 1) * limit, +limit],
    (err, data) => {
      const lists = data[0]
      const total = data[1][0]
      res.send({
        code: 0,
        msg: '获取数据成功！',
        page,
        limit,
        data: lists,
        ...total
      })
    }
  )
})

module.exports = router
