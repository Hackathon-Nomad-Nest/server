const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const planService = require('../services/plan.service');
const ApiError = require('../utils/ApiError');
const { errorMessages } = require('../config/error');
const { dbService } = require('../services');
const { ItineraryPlan } = require('../models');

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

const updateMembers = catchAsync(async (req, res) => {
  const updatePlan = await planService.updateMembers(req);
  res.status(httpStatus.OK).send(updatePlan);
})
const getPlans = catchAsync(async (req , res) => {
    
  Object.assign(req.query, { sortBy: '_id:-1' });
  const plans = await dbService.getFilteredList({
    model: ItineraryPlan,
    req,
    allowedFilters: ['user'],
    select: {
      _current: { budget: 1, adults: 1, kids: 1, numberOfDays: 1, to: 1, from: 1 },
    },
  });
  res.status(httpStatus.OK).send(plans);
});

const getTipsAndMusic = catchAsync(async (req, res) => {
  const plan = await planService.getTipsAndMusic(req.body);
  res.status(httpStatus.CREATED).send({ plan });
});

module.exports = {
  createPlan,
  getPlan,
  addOrRemoveAnActivity,
  updateMembers,
  getPlans,
  getTipsAndMusic,
};
