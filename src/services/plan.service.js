const generateItineraryPlan = require('../utils/openAi/generateItineraryPlan');
const dbService = require('../services/db.service');
const { ItineraryPlan } = require('../models');
const httpStatus = require('http-status');
const { errorMessages } = require('../config/error');
const ApiError = require('../utils/ApiError');
const generateTipsAndMusic = require('../utils/openAi/generateTipsAndMusic');

const createPlan = async (body) => {
  const { travelInput, user } = body;
  const itineraryPlan = await generateItineraryPlan(travelInput);
    const planBody = {
      response: itineraryPlan,
      user,
      adults: travelInput.adults || 0,
      kids: travelInput.kids || 0,
      numberOfDays: travelInput.numberOfDays,
      to: travelInput.to,
      from: travelInput.from,
      budget: travelInput.budget,
    };
  await dbService.createOne({ model: ItineraryPlan, reqParams: planBody });
  return itineraryPlan;
};

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

const updateMembers = async(req) => {
  let updateParams;
  if(addedMember)
    updateParams = {
        $push: {
          users: req.body.addedMember
        }
      };
  else 
    updateParams = {
      $pull: {
        users: req.body.deletedMember
      }
    };

  return await dbService.updateOne({
    model: ItineraryPlan,
    filter: { _id: planId },
    updateParams,
  });
}

const getTipsAndMusic = async (body) => {
  const tipsAndMusic = await generateTipsAndMusic(body);
  return tipsAndMusic;
};

module.exports = {
  createPlan,
  getPlanById,
  addOrRemoveAnActivity,
  updateMembers,
  getTipsAndMusic
};
