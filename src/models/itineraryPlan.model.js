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
  travelInput: {
    type: Object,
  }
});

// add plugin that converts mongoose to json
ItineraryPlanSchema.plugin(toJSON);
ItineraryPlanSchema.plugin(paginate);

/**
 * @typedef Itinerary
 */

const Itinerary = mongoose.model(models.ITINERARY_PLAN, ItineraryPlanSchema);

module.exports = Itinerary;
