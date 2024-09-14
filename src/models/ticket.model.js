const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { models } = require('../config/models');
const ticketStatus = require('../config/ticket');

const ticketSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  query : {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: [ticketStatus.OPEN , ticketStatus.CLOSED] // can add reOpened
  },
  openedAt : {
    type: Date,
  },
  closedAt :{
    type: Date,
  }
});

// add plugin that converts mongoose to json
ticketSchema.plugin(toJSON);
ticketSchema.plugin(paginate);

const Ticket = mongoose.model(models.TICKET, ticketSchema);

module.exports = Ticket;