const generateItineraryPlan = require('../utils/openAi/generateItineraryPlan');
const dbService = require('../services/db.service');
const { ItineraryPlan } = require('../models');

const createPlan = async (body) => {
  const { travelInput, user } = body;
  const itineraryPlan = await generateItineraryPlan(travelInput);
  const planBody = { response: itineraryPlan, user };
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

/**
 * Update a itineraryPlan record by its code.
 * @async
 * @function
 * @param {string} code - The itineraryPlan code to update.
 * @param {Object} reqBody - The request body containing the updated itineraryPlan data.
 * @returns {Promise<Object>} - The updated itineraryPlan record.
 */
const addOrRemoveAnActivity = async (req) => {
  const { body, params } = req;
  const { planId } = params || {};
  const updatedPlan = await dbService.updateOne({
    model: ItineraryPlan,
    filter: { _id: planId },
    updateParams: { ...body },
  });
  return updatedPlan;
};

module.exports = {
  createPlan,
  getPlanById,
  addOrRemoveAnActivity
};
