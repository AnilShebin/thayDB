const mysql = require('mysql2/promise')

const mysqlPool = mysql.createPool({
  host: '34.69.231.57',
  user: 'root',
  password: 'F.vio4yb',
  database: 'thay',
})

module.exports=mysqlPool;