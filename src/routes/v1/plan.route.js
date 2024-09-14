const express = require('express');
const validate = require('../../middlewares/validate');

const planController = require('../../controllers/plan.controller');
const planValidation = require('../../validations/plan.validation');

const router = express.Router();

router
  .route('/')
  .post(
    validate(planValidation.createPlan),
    planController.createPlan
  );
module.exports = router;
