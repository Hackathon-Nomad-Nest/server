const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createPlan = {
  body: Joi.object().keys({
    travelInput: Joi.object()
      .keys({
        to: Joi.string(),
        from: Joi.string().required(), // Departure field
        budget: Joi.string().required(), // Budget range
        startDate: Joi.string().required(), // Trip start date
        adults: Joi.number().integer().min(1).required(), // Number of adults
        kids: Joi.number(), // Number of adults
        numberOfDays: Joi.number().integer().min(1).required(), //  for days
        tripType: Joi.string().required(), // Trip type
        preferredTravelMode: Joi.string(), // Preferred travel mode
      })
      .required(),
    user: Joi.string().allow('').required(),
  }),
};

const getPlanById = {
  params: Joi.object().keys({
    planId: Joi.string().custom(objectId),
  }),
};

const addOrRemoveAnActivity = {
  params: Joi.object().keys({
    planId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    action: Joi.string(),
  }),
  body: Joi.object().keys({
    keyName: Joi.string().required(),
    day: Joi.string().required(),
    newValue: Joi.string(),
  }),
};

const updateMembers = {
  body: Joi.object().keys({
    addedMember: Joi.string().custom(objectId),
    deletedMember: Joi.string().custom(objectId),
  }),
};
const getPlans = {
  query: Joi.object().keys({
    user: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getTipsAndMusic = {
  body: Joi.object().keys({
    travelInput: Joi.object()
      .keys({
        to: Joi.string(),
        from: Joi.string().required(), // Departure field
        budget: Joi.string().required(), // Budget range
        startDate: Joi.string().required(), // Trip start date
        adults: Joi.number().integer().min(1).required(), // Number of adults
        kids: Joi.number(), // Number of adults
        numberOfDays: Joi.number().integer().min(1).required(), //  for days
        tripType: Joi.string().required(), // Trip type
        preferredTravelMode: Joi.string(), // Preferred travel mode
      })
      .required(),
  }),
};

module.exports = {
  createPlan,
  getPlanById,
  addOrRemoveAnActivity,
  updateMembers,
  getPlans,
  getTipsAndMusic
};
