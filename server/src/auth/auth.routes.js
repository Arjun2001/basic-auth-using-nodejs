const express = require('express');

const router = express.Router();
const controller = require('./auth.controller');
const middlewares = require('./auth.middleware');

const defaultLoginError = 'Unable to Login';
const signInError = 'Username is taken';

router.get('/', controller.get);
router.post('/signup', middlewares.validateUser(),
middlewares.findUser(signInError, (user) => user, 409),
controller.signup);

router.post('/login', middlewares.validateUser(defaultLoginError),
middlewares.findUser(defaultLoginError, (user) => !(user && user.active)),
controller.login);

module.exports = router;
