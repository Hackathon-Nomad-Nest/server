const express = require('express');
const { imagesController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .get(imagesController.fetchImages);

module.exports = router;
