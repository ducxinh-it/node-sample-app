require('dotenv').config()
const bodyParser = require('body-parser')
const express = require("express")
const DB = require('./database')
const app = express()
app.use(bodyParser.json())

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
})

const PORT = process.env.PORT || 8000;

app.get("/", async (req, res) => {
  res.send('Hello')
});

app.get('/users', async (req, res) => {
  console.log('get users')
  try {
    const users = await DB.query('SELECT * from users')
    res.json(users);
  } catch (error) {
    console.error('Home@error', error)
    res.statusCode = 500
    res.json({
      error: true,
      message: 'Internal Server Error',
    })
  }
});

app.post('/users', async (req, res) => {
  console.log('Create user')
  const { body } = req
  if (!body.name) {
    res.statusCode = 400
    return res.json({ errors: {
      name: 'This field is required',
    }})
  }
  try {
    const userData = [body.name]
    const newUserData = await DB.query('INSERT INTO users (name) VALUES (?)', userData)
    res.json({
      id: newUserData.insertId
    });
  } catch (error) {
    console.error('User@error', error)
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
