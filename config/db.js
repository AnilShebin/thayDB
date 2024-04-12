const mysql = require('mysql2/promise')

const mysqlPool = mysql.createPool({
  host:'sql6.freesqldatabase.com',
  user:'sql6698247',
  password:'Lya4pa5Ets',
  database:'sql6698247',
  
})

module.exports=mysqlPool;