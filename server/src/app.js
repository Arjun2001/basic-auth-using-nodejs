const express = require('express');
const helmet = require('helmet');
const volleyball = require('volleyball');
const cors = require('cors');
const path = require('path');
const auth = require('./auth/auth.routes');


require('dotenv').config();

const app = express();

const middlewares = require('./auth/auth.middleware');
const notes = require('./api/notes');
const users = require('./api/users');

app.use(volleyball);
app.use(express.json());
app.use(cors());
app.use(helmet());

app.use(express.static(path.join(__dirname, '../public/')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../public/index.html')));

app.use(middlewares.checkTokenSetUser);

// Handle production

if (process.env.NODE_ENV === 'production') {
  // static folder
  app.use(express.static(path.join(__dirname, '../public/')));
  app.get('/.*', (req, res) => res.sendFile(path.join(__dirname, '../public/index.html')));
}


app.get('/me', (req, res) => {
  res.json({
    message: 'Hello World!😍',
    user: req.user,
  });
});

app.use('/auth', auth);
app.use('/api/v1/notes', middlewares.isLoggedIn, notes);
app.use('/api/v1/users', middlewares.isLoggedIn, middlewares.isAdmin, users);

function notFound(req, res, next) {
  res.status(400);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
}

function errorHandler(err, req, res, next) {
  res.status(res.statusCode || 500);
  res.json({
    message: err.message,
    stack: err.stack,
  });
}

app.use(notFound);
app.use(errorHandler);


module.exports = app;
