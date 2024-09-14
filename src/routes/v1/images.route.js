const express = require('express');
const { imagesController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(imagesController.fetchImages);

module.exports = router;
