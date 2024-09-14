const express = require('express');
const { authController } = require('../../controllers');

const router = express.Router();

router
  .route('/login')
  .post(authController.loginUser);

module.exports = router;
