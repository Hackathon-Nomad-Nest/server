const Joi = require('joi');
const createTicket = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    query : Joi.string().required(),
  }),
};

module.exports = {
  createTicket,
};
