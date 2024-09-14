const momentTz = require('moment-timezone');
const { set } = require('lodash');
const { default: mongoose } = require('mongoose');

const regexSearch = (searchField, searchValue) => {
  return set({}, searchField, { $regex: searchValue, $options: 'i' });
};

const getFullName = ({ firstName = '', lastName = '' }) => {
  return `${firstName} ${lastName}`;
};

const getDynamicTemplate = ({ text, params }) => {
  const modifedText = text;
  return modifedText.replace(/\[([a-zA-Z]*)\]/g, (match, key) => {
    return params[key] || match;
  });
};


const getTimeZoneFromCountry = ({ countryCode = 'US' }) => {
  return momentTz.tz.zonesForCountry(countryCode);
};

const getObjectId = (id) => new mongoose.Types.ObjectId(id);

const pickObjectId = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      // eslint-disable-next-line no-param-reassign
      obj[key] = getObjectId(object[key]);
    }
    return obj;
  }, {});
};

const capitalize = (str) => str && str[0].toUpperCase() + str.slice(1);

const inchesToFeetInches = (inches) => {
  const cm = inches * 2.54;
  const feet = parseInt(Number(cm) / 2.54 / 12, 10);
  const remainingInches = (Number(cm) / 2.54) % 12;
  const inchesResult = Math.round(remainingInches);
  return { feet, inches: inchesResult };
};

const feetInchesToInches = (feet, inches) =>{
  const ans = Number(feet) * 12 + Number(inches);  
  return ans;
}

const delayExecution = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const generateOTP = () => {
  const nums = '0123456789';
  let otp = '';
  for (let i = 0; i < 6; i++) {
    otp += nums.charAt(Math.floor(Math.random() * nums.length));
  }
  return otp;
};


module.exports = {
  regexSearch,
  getFullName,
  getDynamicTemplate,
  getTimeZoneFromCountry,
  getObjectId,
  pickObjectId,
  capitalize,
  inchesToFeetInches,
  feetInchesToInches,
  delayExecution,
  generateOTP,
};
