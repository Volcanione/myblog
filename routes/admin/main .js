const path = require('path')
const express = require('express')
const md5 = require('md5')

const db = require('../../modules/db')
const sider = require('../../modules/siderNav')

const router = express.Router()
const manager = require('./manager')
const adminInfo = require('./adminInfo')
const user = require('./user')
const home = require('./home')

// 限制未登录用户权限
router.use((req, res, next) => {
  let { url } = req
  if (!req.session.user && url.indexOf('adminLogin') < 0) {
    return res.send({ code: 4, msg: '登录已过期，请重新登录' })
  }
  next()
})

//amdin信息
router.get('/getAdminInfo', (req, res) => {
  console.log(req.url)
  if (!req.session.user) return res.send({ code: 1, msg: '请登录' })
  db.query(
    'select * from admin where username=?',
    req.session.user.username,
    (err, data) => {
      console.log(data)
      let { username, email, call, id, role, head } = data[0]
      res.send({
        code: 0,
        msg: '操作成功',
        data: { username, email, call, id, role, head }
      })
    }
  )
})

//登录处理
router.post('/adminLogin', (req, res) => {
  const { username: name, password } = req.body
  db.query('select * from admin where username=?', name, (err, data) => {
    if (err) return res.send({ code: 1, msg: '获取数据失败' })
    if (!data.length) {
      return res.send({ code: 1, msg: '账号不存在' })
    }
    if (md5(password) != data[0].password) {
      return res.send({ code: 2, msg: '密码错误' })
    }

    if (data[0].status === 0) {
      return res.send({ code: 3, msg: '该用户已被禁用！请联系超级管理员！' })
    }
    let { username, email, call, id, status, role } = data[0]
    req.body.role = role
    req.session.user = { username, email, call, id, status, role }
    res.send({
      code: 0,
      msg: '登陆成功',
      data: { username, email, call, id, status, role }
    })
    console.log(req.session.user)
  })
})

//退出处理
router.get('/adminLogout', (req, res) => {
  req.session.user = null
  res.send({ code: 0, msg: '注销成功' })
})

//处理导航菜单
router.get('/getsiderNav', (req, res) => {
  console.log(req.session)
  const { role } = req.session.user

  sider.getNav(role, data => {
    res.send({ code: 0, msg: '操作成功', role, data })
    console.log(data)
  })

  // res.send({
  //   code: 0, msg: '操作成功', data: [
  //     {
  //       id: 0,
  //       menuName: '主页',
  //       icon: 'layui-icon-home',
  //       href: 'home/home',
  //       dataName: 'home',
  //       childMenu: []
  //     },
  //     {
  //       id: 1,
  //       menuName: '用户管理',
  //       icon: 'layui-icon-user',
  //       href: '',
  //       dataName: 'user',
  //       childMenu: [{
  //         id: 0,
  //         name: '网站用户',
  //         href: 'user/user/list',
  //       }, {
  //         id: 1,
  //         name: '管理员',
  //         href: 'user/user/adminList',
  //       }]
  //     }
  //   ]
  // })
})

router.use(manager) //管理员列表
router.use(adminInfo) //管理员信息
router.use(user) //网站用户
router.use(home) //首页信息

module.exports = router
