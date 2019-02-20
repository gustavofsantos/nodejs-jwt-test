const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/api/v1', (req, res) => {
  res.json({
    message: 'Welcome to the API'
  })
});

app.post('/api/v1/posts', verifyToken, (req, res) => {
  jwt.verify(req.token, 'a_secure_secret_key', (err, authData) => {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      res.json({
        message: 'Post created.',
        authData
      });
    }
  });
});

app.post('/api/v1/login', (req, res) => {
  // mock user
  const user = {
    id: 1,
    username: 'username',
    email: 'username@email.com'
  }

  jwt.sign({user}, 'a_secure_secret_key', {expiresIn: '30s'}, (err, token) => {
    if (!err) {
      res.json({
        token
      });
    }
  });
});

/**
 * Format token
 * Authorization: Bearer <access_token>
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function verifyToken(req, res, next) {
  // get auth header value
  const bearerHeader = req.headers['authorization'];
  console.log('bearerHeader', bearerHeader);

  // check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    // split at space
    const [_, bearerToken] = bearerHeader.split(' ');

    req.token = bearerToken;

    // next middleware
    next();
  } else {
    // forbiden
    res.sendStatus(403);
  }
}

app.listen(5000, () => {
  console.log('API listening ate 5000 port')
});