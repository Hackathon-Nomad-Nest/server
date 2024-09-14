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
    user: Joi.string().allow(''),
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
  };

module.exports = {
  createPlan,
  getPlanById,
  addOrRemoveAnActivity
};
