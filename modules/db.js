const mysql = require('mysql')

const config = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'myblog',
  multipleStatements: true
}

const config2 = {
  host: 'cdb-501hps4o.bj.tencentcdb.com',
  port: 10158,
  user: 'root',
  password: 'hexudong199412',
  database: 'myblog',
  multipleStatements: true
}

exports.query = (sql, params, callback) => {
  const connect = mysql.createConnection(config2)
  connect.connect()
  connect.query(sql, params, (err, data) => {
    callback && callback(err, data)
  })
  connect.end()
}
