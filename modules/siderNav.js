const db = require('./db')

exports.getNav = (role, callback) => {
  let sql, data, sql2, data2
  const siderData = (sql, data) => {
    return new Promise((resolve, reject) => {
      db.query(sql, data, (err, data) => {
        if (err) return reject(err)
        resolve(data)
      })
    })
  }

  if (role == 0) {
    sql = 'select * from menu'
    data = null
    sql2 = 'select * from lmenu where parent=?'
    data2 = null
  } else {
    sql = 'select * from menu where permission=?'
    data = role
    sql2 = 'select * from lmenu where parent=? and  permission=?'
    data2 = role
  }

  siderData(sql, data).then(res => {
    res.forEach((item, i) => {
      return siderData(sql2, [item.dataName, data2]).then(data => {
        item.childMenu = data
        if (i === res.length - 1) {
          // console.log(res)
          callback(res)
        }
      })
    })
  })
}
