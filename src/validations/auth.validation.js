const Joi = require('joi');
const login = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string(),
    picture: Joi.string(),
    given_name: Joi.string(),
    family_name: Joi.string(),
  }),
};

module.exports = {
  login,
};
