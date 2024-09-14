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
const updatePlan = catchAsync(async (req, res) => {
  const user = await planService.createPlan(req.body, req.user);
  res.status(httpStatus.OK).send(user);
});

module.exports = {
  createPlan,
  getPlan,
  updatePlan,
};
