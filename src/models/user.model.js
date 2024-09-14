const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  name: {
    type: String,
    trim: true,
  },
  picture: {
    type: String,
    trim: true,
  },
  givenName: {
    type: String,
    trim: true,
  },
  familyName:{
    type: String,
    trim: true,
  }
});

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

const User = mongoose.model('user', userSchema);

module.exports = User;