const mysql = require('mysql')

const config = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'myblog',
  multipleStatements: true
}

exports.query = (sql, params, callback) => {
  const connect = mysql.createConnection(config)
  connect.connect()
  connect.query(sql, params, (err, data) => {
    callback && callback(err, data)
  })
  connect.end()
}
