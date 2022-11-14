const mysql = require('mysql2')

const dbConfig = {
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_NAME,
}
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit : 100,
  queueLimit: 0
});


pool.getConnection((err, connection) => {
  console.log('pool@getConnection')
  if (err) {
    console.error('pool@getConnection@error', err)
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.')
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections.')
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused.')
    }
  }
  if (connection) connection.release()
  return
})


async function query(queryString) {
  const promisePool = pool.promise();
  const [rows, fields] = await promisePool.query(queryString)

  return rows
}

module.exports = {
  query
};