const { map, get, uniq, flatten, pullAll } = require('lodash');

const ObjConstructor = {}.constructor;

const isJSONObject = (obj) => {
  if (obj === undefined || obj === null || obj === true || obj === false || typeof obj !== 'object' || Array.isArray(obj)) {
    return false;
  }
  if (obj.constructor === ObjConstructor || obj.constructor === undefined) {
    return true;
  }
  return false;
};

const getValue = (values, key) => {
  let result;
  if (Array.isArray(values)) {
    result = flatten(map(values, key));
  } else {
    result = get(values, key);
  }
  if (Array.isArray(result)) {
    result = uniq(result);
  }
  if (Array.isArray(result)) {
    result = pullAll(result, [undefined]);
  }
  return result;
};

const resolveValue = (values, key) => {
  if (!values || !key) {
    return values;
  }
  let result = getValue(values, key);
  if (result === undefined || (Array.isArray(result) && result.length === 0)) {
    const indexOf = key.indexOf('.');
    if (indexOf === -1) {
      return result;
    }
    const firstPart = key.substring(0, indexOf);
    const nextPart = key.substring(indexOf + 1);
    result = getValue(values, firstPart);
    if (result === undefined || (Array.isArray(result) && result.length === 0)) {
      return result;
    }
    return resolveValue(result, nextPart);
  }
  return result;
};

const isMatch = (row, filter) => {
  try {
    for (const k in filter) {
      const filterValue = filter[k];
      let matched = false;
      if (k === '$and') {
        matched = matchAnd(row, filterValue);
      } else if (k === '$or') {
        matched = matchOr(row, filterValue);
      } else {
        const rowValue = resolveValue(row, k);
        if (isInFilter(filterValue)) {
          matched = matchIn(rowValue, filterValue);
        } else if (isNotInFilter(filterValue)) {
          matched = matchNotIn(rowValue, filterValue);
        } else if (isLtOrGt(filterValue)) {
          matched = matchLtOrGt(rowValue, filterValue);
        } else if (isExistsFilter(filterValue)) {
          matched = matchExists(filterValue.$exists, rowValue);
        } else if (isElemMatchFilter(filterValue)) {
          matched = elemMatch(rowValue, filterValue);
        } else if (isNotEqFilter(filterValue)) {
          matched = !isLeafMatch(rowValue, filterValue.$ne);
        } else {
          matched = isLeafMatch(rowValue, filterValue);
        }
      }
      if (!matched) {
        return false;
      }
    }
    return true;
  } catch (err) {
    console.log(`err>>>>>>>>>`, err);
  }
};

const matchAnd = (row, filter) => {
  if (!Array.isArray(filter)) {
    throw new Error(`And filter must be array, but found >> ${JSON.stringify(filter)}`);
  }

  for (let k = 0; k < filter.length; k++) {
    if (!isMatch(row, filter[k])) {
      return false;
    }
  }
  return true;
};

const matchOr = (row, filter) => {
  if (!Array.isArray(filter)) {
    throw new Error(`Or filter must be array, but found >> ${JSON.stringify(filter)}`);
  }

  for (let k = 0; k < filter.length; k++) {
    if (isMatch(row, filter[k])) {
      return true;
    }
  }
  return false;
};

const isLeafMatch = (rowValue, filterValue) => {
  if (Array.isArray(rowValue)) {
    for (let i = 0; i < rowValue.length; i++) {
      if (isLeafMatch(rowValue[i], filterValue)) {
        return true;
      }
    }
  } else if (
    (( !isJSONObject(rowValue) && rowValue?.toString() === filterValue?.toString()) ||
    (rowValue?._id && rowValue?._id.toString() === filterValue.toString()) ||
    (rowValue?.id && rowValue?.id.toString() === filterValue.toString()) ||
    (rowValue && rowValue.equals && rowValue.equals(filterValue)))
  ) {
    return true;
  } else {
    return false;
  }
};

const matchIn = (value, filterValue) => {
  const filter = filterValue.$in;
  if (!Array.isArray(filter)) {
    throw new Error(`In filter must be array, but found >> ${JSON.stringify(filter)}`);
  }
  for (let k = 0; k < filter.length; k++) {
    if ((value === undefined || value === null) && filter[k] === null) {
      return true;
    }
    if (isLeafMatch(value, filter[k])) {
      return true;
    }
  }
  return false;
};

const matchNotIn = (value, filterValue) => {
  const filter = filterValue.$nin;
  if (!Array.isArray(filter)) {
    throw new Error(`In filter must be array, but found >> ${JSON.stringify(filter)}`);
  }
  for (let k = 0; k < filter.length; k++) {
    if (isLeafMatch(value, filter[k])) {
      return false;
    }
  }
  return true;
};

const elemMatch = (value, filterValue) => {
  const filter = filterValue.$elemMatch;
  if (!isJSONObject(filter)) {
    throw new Error(`ElemMatch filter must be object, but found >> ${JSON.stringify(filter)}`);
  }
  if (!Array.isArray(value)) {
    throw new Error(`Value must be array, but found >> ${JSON.stringify(value)}`);
  }
  for (let k = 0; k < value.length; k++) {
    if (isMatch(value[k], filter)) {
      return true;
    }
  }
  return false;
};

const matchLtOrGt = (value, filterValue) => {
  for (const k in filterValue) {
    const kValue = filterValue[k];
    let matched = false;
    if (k === '$lt') {
      matched = value < kValue;
    } else if (k === '$gt') {
      matched = value > kValue;
    } else if (k === '$lte') {
      matched = value <= kValue;
    } else if (k === '$gte') {
      matched = value >= kValue;
    } else if (k === '$eq') {
      matched = value === kValue;
    } else {
      throw new Error(`Only $lt,$gt,$lte,$gte are supported but found [${k}], filter is ${JSON.stringify(filterValue)} `);
    }
    if (!matched) {
      return false;
    }
  }

  return true;
};

const isInFilter = (value) => {
  return !!(value && typeof value === 'object' && value.hasOwnProperty('$in'));
};

const isNotInFilter = (value) => {
  return !!(value && typeof value === 'object' && value.hasOwnProperty('$nin'));
};

const isElemMatchFilter = (value) => {
  return !!(value && typeof value === 'object' && value.hasOwnProperty('$elemMatch'));
};

const isLtOrGt = (value) => {
  return !!(
    value &&
    typeof value === 'object' &&
    (value.hasOwnProperty('$lt') ||
      value.hasOwnProperty('$lte') ||
      value.hasOwnProperty('$gt') ||
      value.hasOwnProperty('$gte') ||
      value.hasOwnProperty('$eq'))
  );
};
const isExistsFilter = (value) => {
  return value && typeof value === 'object' && value.hasOwnProperty('$exists');
};

const isNotEqFilter = (value) => {
  return value && typeof value === 'object' && value.hasOwnProperty('$ne');
};

const matchExists = (valueToMatch, value) => {
  return (valueToMatch === true && value !== void 0) || (valueToMatch === false && value === void 0);
};

const getFieldType = (schema, field, skipError) => {
  let fieldType = schema && schema[field].instance;
  if (Array.isArray(fieldType)) {
    fieldType = fieldType[0];
  }
  if (typeof fieldType === 'function') {
    fieldType = fieldType();
  }
  if (fieldType === undefined && !skipError) {
    throw new Error(
      `Schema not found for field [${field}] >>>>>> Available fields are >>>>> ${JSON.stringify(Object.keys(schema || {}))}`
    );
  }
  return fieldType;
};

const isNull = (value) => {
  return value === undefined || value === null;
};

const isDate = (value) => {
  return isNull(value) || (typeof value === 'object' && value instanceof Date);
};

module.exports = {
  isJSONObject,
  isDate,
  getFieldType,
  isMatch,
};
