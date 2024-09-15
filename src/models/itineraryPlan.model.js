const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { models } = require('../config/models');

const ItineraryPlanSchema = mongoose.Schema({
  user: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: models.USER,
  },
  response: {
    type: mongoose.SchemaTypes.Mixed,
  },
  adults: {
    type: String,
  },
  kids: {
    type: String,
  },
  numberOfDays: {
    type: String,
  },
  to: {
    type: String,
  },
  from: {
    type: String,
  },
  budget: {
    type: String,
  },
});

// add plugin that converts mongoose to json
ItineraryPlanSchema.plugin(toJSON);
ItineraryPlanSchema.plugin(paginate);

/**
 * @typedef Itinerary
 */

const Itinerary = mongoose.model(models.ITINERARY_PLAN, ItineraryPlanSchema);

module.exports = Itinerary;
