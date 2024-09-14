const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const planService = require('../services/plan.service');
const { successMessages } = require('../config/sucess');

const createPlan = catchAsync(async (req, res) => {
  const plan = await planService.createPlan(req.body);
  res.status(httpStatus.CREATED).send({ plan });
});

const getPlan = catchAsync(async (req, res) => {
  console.log('<><><><>');
  res.status(httpStatus.OK).send();
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
