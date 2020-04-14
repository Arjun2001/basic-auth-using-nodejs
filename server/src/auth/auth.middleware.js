const jwt = require('jsonwebtoken');
const joi = require('joi');
const schema = require('./auth.schema');
const users = require('./auth.model');


function checkTokenSetUser(req, res, next) {
  const authHeader = req.get('authorization');
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    if (token) {
      jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
          console.log(err);
        }
        req.user = user;
        next();
      });
    } else {
      next();
    }
  } else {
    next();
  }
}

function unAuthorized(res, next) {
  const error = new Error('unauthorized');
  res.status(401);
  next(error);
}

function isLoggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    unAuthorized(res, next);
  }
}

function isAdmin(req, res, next) {
  if (req.user.role === 'admin') {
    next();
  } else {
    unAuthorized(res, next);
  }
}


const validateUser = (defaultErrorMessage) => (req, res, next) => {
  const result = joi.validate(req.body, schema);
  if (result.error === null) {
      next();
  } else {
    const error = defaultErrorMessage ? new Error(defaultErrorMessage) : result.error;
      res.status(422);
      next(error);
  }
};

const findUser = (defaultLoginError, isError, errorCode = 422) => async (req, res, next) => {
  const user = await users.findOne({
  username: req.body.username,
  });
  if (isError(user)) {
    res.status(errorCode);
    next(new Error(defaultLoginError));
  } else {
    next();
  }
};

module.exports = {
  checkTokenSetUser,
  isLoggedIn,
  isAdmin,
  validateUser,
  findUser,
};
