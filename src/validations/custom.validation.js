/* eslint-disable no-useless-escape */

const { regex } = require('../config/regex');

/* eslint-disable security/detect-unsafe-regex */
const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

const objectIdList = (value, helpers) => {
  const idList = value.split(',');

  const isValidId = (id) => id.match(/^[0-9a-fA-F]{24}$/);

  if (idList.some((id) => !isValidId(id))) {
    return helpers.message('"{{#label}}" must be a list of valid mongo ids separated by commas');
  }

  return idList;
};

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message('password must be at least 8 characters');
  }
  if (!value.match(regex.PASSWORD)) {
    return helpers.message(
      'password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and has a minimum length of 8 characters.'
    );
  }
  return value;
};

const url = (value, helpers) => {
  if (!value.match(/^(https?:\/\/)[^\s/$.?#].[^\s]*$/)) {
    return helpers.message('url must be valid');
  }
  return value;
};
module.exports = {
  objectId,
  password,
  objectIdList,
  url,
};
