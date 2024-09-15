const express = require('express');
const validate = require('../../middlewares/validate');

const planController = require('../../controllers/plan.controller');
const planValidation = require('../../validations/plan.validation');

const router = express.Router();

router
  .route('/')
  .post(validate(planValidation.createPlan), planController.createPlan)
  .get(validate(planValidation.getPlans), planController.getPlans);
router.route('/tips-and-music').post(validate(planValidation.getTipsAndMusic), planController.getTipsAndMusic);
router.route('/:planId').get(validate(planValidation.getPlanById), planController.getPlan);
router.route('/:planId').put(validate(planValidation.addOrRemoveAnActivity), planController.addOrRemoveAnActivity);
router.route('/updateMembers/:planId').put(validate(planValidation.updateMembers) , planController.updateMembers);
router.route('/updatePlanOnGo/:planId').put(validate(planValidation.updatePlanOnGo) , planController.updatePlanOnGo);
module.exports = router;
