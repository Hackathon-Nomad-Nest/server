const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const planService = require('../services/plan.service');
const ApiError = require('../utils/ApiError');
const { errorMessages } = require('../config/error');

const createPlan = catchAsync(async (req, res) => {
  const plan = await planService.createPlan(req.body);
  res.status(httpStatus.CREATED).send({ plan });
});

const getPlan = catchAsync(async (req, res) => {
    const plan = await planService.getPlanById(req);
    if (!plan) {
      throw new ApiError(httpStatus.NOT_FOUND, errorMessages.NOT_FOUND);
    }
    res.status(httpStatus.OK).send(plan);
  });

const addOrRemoveAnActivity = catchAsync(async (req, res) => {
  const updatedPlan = await planService.addOrRemoveAnActivity(req);
  res.status(httpStatus.OK).send(updatedPlan);
});

const updatePlanOnGo = catchAsync(async(req , res) => {
  const updatedPlan = await planService.updatePlan(req);
  res.status(httpStatus.OK).send(updatedPlan);
})
module.exports = {
  createPlan,
  getPlan,
  addOrRemoveAnActivity,
  updatePlanOnGo,
};
