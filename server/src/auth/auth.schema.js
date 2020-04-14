const joi = require('joi');


const schema = joi.object().keys({
    username: joi.string().regex(/(^[a-zA-Z0-9_]*$)/).min(2).max(30)
      .required(),
    password: joi.string().min(6).required().trim(),
});

module.exports = schema;
