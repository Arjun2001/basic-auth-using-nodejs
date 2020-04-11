const express = require('express');
const volleyball = require('volleyball');
const auth = require('./auth/index')
const cors = require('cors');
const helmet = require('helmet');

require('dotenv').config();

const app = express();

const middlewares = require('./auth/middleware');
const notes = require('./api/notes');
const users = require('./api/users');

app.use(volleyball);
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(middlewares.checkTokenSetUser);


app.get('/', (req, res) => {
    res.json({
        message: "Hello World!😍",
        user: req.user,
    });
});

app.use('/auth', auth);
app.use('/api/v1/notes', middlewares.isLoggedIn, notes);
app.use('/api/v1/users', middlewares.isLoggedIn,middlewares.isAdmin, users);

function notFound(req, res, next) {
    res.status(400);
    const error = new Error('Not Found - '+ req.originalUrl);
    next(error);
}

function errorHandler(err, req, res, next) {
    res.status(res.statusCode || 500);
    res.json({
        message: err.message,
        stack: err.stack
    });
}

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log('Listening on port ', port);
})