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
module.exports = {
  createPlan,
  getPlanById,
};
