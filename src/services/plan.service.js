const {generateItineraryPlan, updateItineraryPlan , } = require('../utils/openAi/generateItineraryPlan');
const dbService = require('../services/db.service');
const { ItineraryPlan } = require('../models');
const httpStatus = require('http-status');
const { errorMessages } = require('../config/error');
const ApiError = require('../utils/ApiError');

const createPlan = async (body) => {
  const { travelInput, user } = body;
  const itineraryPlan = await generateItineraryPlan(travelInput);
  const planBody = { response: itineraryPlan, user, travelInput};
  await dbService.createOne({ model: ItineraryPlan, reqParams: planBody });
  return itineraryPlan;
};

const updatePlan = async (req) => {
  const { params , body} = req;
  const { planId = '' } = params || {};
  const {currentDay , travelInput, currentLocation} = body || {};
  const plan = await dbService.getOne({
    model: ItineraryPlan,
    filter: { _id: planId },
  }); 
  const prevObj = {
    prevTravelInput: plan.travelInput,
    remainingTrip: plan.response,
  }
  const response = await updateItineraryPlan({currentDay, travelInput, currentLocation , ...prevObj});
  await dbService.updateOne({
    model: ItineraryPlan,
    filter:{
      _id: planId
    },
    reqParams:{
      response,
      travelInput
    }
  })
  return response;
}

const getPlanById = async (reqParams) => {
  const { params } = reqParams;
  const { planId = '' } = params || {};
  const filter = { _id: planId };
  const plan = await dbService.getOne({
    model: ItineraryPlan,
    filter,
  });
  return plan;
};

/**
 * Update a itineraryPlan record by its code.
 * @async
 * @function
 * @param {string} code - The itineraryPlan code to update.
 * @param {Object} reqBody - The request body containing the updated itineraryPlan data.
 * @returns {Promise<Object>} - The updated itineraryPlan record.
 */
const addOrRemoveAnActivity = async (req) => {
  const { body, params, query } = req;
  const { planId } = params || {};
  const { action } = query || {};
  const { day, keyName, newValue } = body || {};
  let updatedPlan;

  if (action === 'add') {
    // Fetch the current plan to manipulate it
    const plan = await dbService.getOne({
      model: ItineraryPlan,
      filter: { _id: planId },
    });

    if (!plan) {
      throw new ApiError(httpStatus.NOT_FOUND, errorMessages.NOT_FOUND);
    }

    const specificDay = day;
    const dayPlan = plan.response.travel_plan[specificDay];

    if (!dayPlan) {
      throw new ApiError(httpStatus.NOT_FOUND, `Day ${day} does not exist in the plan`);
    }

    const updatedDayPlan = { ...dayPlan, [keyName]: newValue };

    const updateParams = { [`response.travel_plan.${day}`]: updatedDayPlan };

    // Update the itinerary plan with the new day object
    updatedPlan = await dbService.updateOne({
      model: ItineraryPlan,
      filter: { _id: planId },
      updateParams,
    });
  } else if (action === 'remove') {
    const updateParams = { $unset: { [`response.travel_plan.${day}.${keyName}`]: '' } };

    // Update the itinerary plan to remove the key
    updatedPlan = await dbService.updateOne({
      model: ItineraryPlan,
      filter: { _id: planId },
      updateParams,
    });
  }
  return updatedPlan;
};

module.exports = {
  createPlan,
  getPlanById,
  addOrRemoveAnActivity,
  updatePlan,
};
