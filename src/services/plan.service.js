const generateItineraryPlan = require("../utils/openAi/generateItineraryPlan");
const dbService = require("../services/db.service");
const { ItineraryPlan } = require("../models");

const createPlan = async (body) => {
    const { travelInput, user } = body
    const itineraryPlan = await generateItineraryPlan(travelInput);
    const planBody = { response: itineraryPlan, user }
    await dbService.createOne({ model: ItineraryPlan, reqParams: planBody });
    return itineraryPlan;
  };
  
  module.exports = {
    createPlan,
  };