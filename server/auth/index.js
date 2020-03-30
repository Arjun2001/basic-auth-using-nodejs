const express = require('express');
const router = express.Router();
const joi = require('joi');
const bcrypt = require('bcryptjs');

const db = require('../db/connection');
const users = db.get('users');
users.createIndex('username', {unique: true});

const schema = joi.object().keys({
    username: joi.string().regex(/(^[a-zA-Z0-9_]*$)/).min(2).max(30).required(),
    password: joi.string().min(6).required()
});

router.get('/',(req, res) => {
    res.json({
        message: '🔒🔏🔐🔓'   
    });
});

router.post('/signup', (req, res, next) => {
    const result = joi.validate(req.body, schema);
    if(result.error === null) {
        users.findOne({
            username: req.body.username,
        }).then((user) => {
            if(user) {
                const error = new Error('Username is taken');
                next(error);
            }else {
                bcrypt.hash(req.body.password, 12).then(hashedPassword => {
                    const newUser = {
                        username: req.body.username,
                        password: hashedPassword
                    };
                    users.insert(newUser).then(insertedUser => {
                        res.json ({insertedUser});
                    })
                })
            }
        });
    }else {
        next(result.error);
    }
    
});

module.exports = router;