const bcrypt = require('bcryptjs');
const joi = require('joi');
const db = require('../db/connection');

const users = db.get('users');

const schema = joi.object().keys({
  username: joi.string().regex(/(^[a-zA-Z0-9_]*$)/).min(2).max(30),
  password: joi.string().min(6).trim(),
  role: joi.string().valid('user', 'admin'),
  active: joi.bool(),
});

const list = async (req, res, next) => {
  try {
    const result = await users.find({}, '-password');
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const updateOne = async (req, res, next) => {
  const { id: _id } = req.params;
  try {
    const result = joi.validate(req.body, schema);
    console.log(result.error);
    if (!result.error) {
      const query = { _id };
      const user = await users.findOneAndUpdate(query);
      if (user) {
        const updatedUser = req.body;
        if (req.body.password) {
          updatedUser.password = await bcrypt.hash(req.body.password.trim(), 12);
        }
        const result = await users.update(query, {
          $set: updatedUser,
        });
        delete result.password;
        res.json(result);
      } else {
        next();
      }
    } else {
      res.status(422);
      next(result.error);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  list,
  updateOne,
};
