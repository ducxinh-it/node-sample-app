require('dotenv').config()
const express = require("express")
const DB = require('./database')
const app = express()

const PORT = process.env.PORT || 8000;

app.get("/", async (req, res) => {
  try {
    const users = await DB.query('SELECT * from users')
    const totalResult = await DB.query('SELECT 1 + 1 AS total')
    const nowResult = await DB.query('SELECT now() AS now')
    res.json({
      users: users,
      total: totalResult[0].total,
      now: nowResult[0].now,
    });
  } catch (error) {
    console.error('Home@error', error)
    res.statusCode = 500
    res.json({
      error: true,
      message: 'Internal Server Error',
    })
  }
});

app.listen(PORT, function() {
  console.log(`Listening on ${PORT}`);
});
