const express = require('express');
const validate = require('../../middlewares/validate');
const { authController } = require('../../controllers');
const { authValidation } = require('../../validations');

const router = express.Router();

router
  .route('/login')
  .post(validate(authValidation.login) , authController.loginUser);

module.exports = router;
