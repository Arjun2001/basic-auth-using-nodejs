const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const users = require('./auth.model');


function respondError422(res, next) {
    res.status(422);
    const error = new Error('Unable to Login');
    next(error);
}


function createTokenSendResponse(user, res, next) {
const payload = {
    _id: user._id,
    username: user.username,
    role: user.role,
    active: user.active,
};
jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: '1d',
}, (err, token) => {
    if (err) {
    respondError422(res, next);
    } else {
    res.json({ token });
    }
});
}


const signup = async (req, res, next) => {
    try {
        bcrypt.hash(req.body.password.trim(), 12).then((hashedPassword) => {
            const newUser = {
                username: req.body.username,
                password: hashedPassword,
                role: 'user',
                active: true,
            };
            users.insert(newUser).then((insertedUser) => {
                createTokenSendResponse(insertedUser, res, next);
            });
            });
    } catch (error) {
        res.status(500);
        next(error);
    }
};


const get = async (req, res) => {
res.json({
    message: 'Auth route works🔒🔏🔐🔓',
});
};

const login = async (req, res, next) => {
    try {
        users.findOne({
            username: req.body.username,
          }).then((user) => {
            if (user && user.active) {
              bcrypt.compare(req.body.password, user.password).then((result) => {
                if (result) {
                  createTokenSendResponse(user, res, next);
                } else {
                  respondError422(res, next);
                }
              });
            } else {
              respondError422(res, next);
            }
        });
    } catch (error) {
        res.status(500);
        next(error);
    }
    };


module.exports = {
    signup,
    get,
    login,
};
