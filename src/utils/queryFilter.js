/* eslint-disable no-param-reassign */
const createInFilter = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      // eslint-disable-next-line no-param-reassign
      let value = object[key];
      if (!Array.isArray(value)) {
        value = String(value).split(',');
      }
      obj[key] = { $in: value };
    }
    return obj;
  }, {});
};

const createElemMatchFilter = (object, keys) => {
  const result = keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      // eslint-disable-next-line no-param-reassign
      let value = object[key];
      if (!Array.isArray(value)) {
        value = value.split(',');
      }
      obj[key] = { $in: value };
    }
    return obj;
  }, {});
  return { $elemMatch: result };
};

module.exports = {
  createInFilter,
  createElemMatchFilter,
};
