const path = require('path')
const fs = require('fs')
const cors = require('cors')

const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')

const admin = require('./routes/admin/main ') //导入后台user路由

//创建服务器
const app = express()
app.listen(9999, () => {
  console.log('服务器启动成功！访问localhost：9999')
})

//配置session
app.use(cookieParser())
app.use(
  session({
    secret: 'itcast-secret',
    name: 'itcast-name',
    cookie: { maxAge: 8000000000 },
    resave: false,
    saveUninitialized: true
  })
)

//跨域处理
const corsOptions = {
  origin: 'http://192.168.37.84:8082',
  credentials: true,
  maxAge: '1728000'
  //这一项是为了跨域专门设置的
}
app.use(cors(corsOptions))

//处理跨域----老方法
// app.all('*', function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', req.headers.origin) //需要显示设置来源
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept'
//   )
//   res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
//   res.header('Access-Control-Allow-Credentials', true) //带cookies7     res.header("Content-Type", "application/json;charset=utf-8");
//   next()
// })

//处理后台登陆session

let flag = true
app.use('/admin/login', (req, res, next) => {
  const url = req.url
  if (!req.session.user && flag) {
    flag = false
    return res.redirect('login.html')
  }
  next()
})

app.use((req, res, next) => {
  const url = req.originalUrl

  if (
    !req.session.user &&
    ((url.indexOf('/admin') > -1 && url.indexOf('.html') > -1) ||
      url == '/admin/' ||
      url.indexOf('/views') > -1) &&
    url.indexOf('/admin/error.html') == -1 &&
    url.indexOf('/admin/login') == -1
  ) {
    return res.redirect('/admin/error.html')
  }

  next()
})

//设置模板引擎
app.engine('html', require('express-art-template'))
app.set('views', 'public')

//设置静态资源
app.use(express.static(path.join(__dirname, 'public')))

//响应图片
app.use('/uploads', (req, res) => {
  console.log(req.url)
  let filepath = path.join(__dirname, 'uploads', req.url)
  res.sendFile(filepath)
})

//设置post请求
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//使用后台user路由
app.use('/adminport', admin)

//后台404处理
let flag2 = true
app.use('/admin', (req, res) => {
  if (flag2) {
    flag2 = false
    res.status(404).redirect('/admin/404.html')
  }
})

module.exports = app
