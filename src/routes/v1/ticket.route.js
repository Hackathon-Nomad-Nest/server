const express = require('express');
const validate = require('../../middlewares/validate');
const { authController, ticketController } = require('../../controllers');
const { ticketValidation } = require('../../validations');

const router = express.Router();

router
  .route('/')
  .post(validate(ticketValidation.createTicket) , ticketController.createTicket);

module.exports = router;