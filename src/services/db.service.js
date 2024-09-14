const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');
const { errorMessages } = require('../config/error');
const { encryptCrypto } = require('../utils/cyrpto');
const { asyncLocalStorage } = require('../utils/asyncStorage');
const { sendErrorMail } = require('../utils/sendMail');
const { email } = require('../config/config');

const deleteOne = async ({ model, reqParams }) => {
  try {
    const doc = await model.findByIdAndDelete(reqParams.id);
    return doc;
  } catch (err) {
    console.log('error in deleteOne', err);
    throw new ApiError(httpStatus.NOT_FOUND, errorMessages.NO_RECORD_FOUND);
  }
};

const deleteMany = async ({ model, filter }) => {
  try {
    const doc = await model.deleteMany(filter);
    return doc;
  } catch (err) {
    console.log('error in deleteMany', err);
    throw new ApiError(httpStatus.NOT_FOUND, errorMessages.NO_RECORD_FOUND);
  }
};

const updateOne = async ({ model, filter, updateParams, options = {}, skipSession = false }) => {
  try {
    const doc = await model.findOneAndUpdate(filter, updateParams, {
      new: true,
      runValidators: true,
      ...(!skipSession && { session: asyncLocalStorage.getStore()?.get('dbSession') }),
      ...options,
    });
    return doc?.toJSON();
  } catch (err) {
    console.log('error in updateOne', err);
    if (err.message.indexOf('WriteConflict error:') > -1) {
      throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, errorMessages.SAME_RECORD_IS_BEIGN_UPDATED);
    }
    throw new ApiError(httpStatus.NOT_FOUND, errorMessages.NO_RECORD_FOUND);
  }
};

const updateById = async ({ model, reqParams }) => {
  try {
    const { _id, skipSession, ...rest } = reqParams;
    const updateDefaultOptions = {
      new: true,
      runValidators: true,
    };
    if (!skipSession) {
      const session = asyncLocalStorage.getStore()?.get('dbSession');
      updateDefaultOptions.session = session;
    }
    const doc = await model.findByIdAndUpdate(_id, rest, updateDefaultOptions);
    return doc.toJSON();
  } catch (err) {
    console.log('error in updateById', err);
    if (err.message.indexOf('WriteConflict error:') > -1) {
      throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, errorMessages.SAME_RECORD_IS_BEIGN_UPDATED);
    }
    sendErrorMail({
      to: email.applicationDeveloper,
      subject: `Error in UpdateById`,
      text: `model: ${model.modelName} , reqParams: ${reqParams?._id}`,
    });
    throw new ApiError(httpStatus.NOT_FOUND, errorMessages.NO_RECORD_FOUND);
  }
};

const createOne = async ({ model, reqParams, skipSession }, currentSession) => {
  try {
    const isReqParamsArray = Array.isArray(reqParams);
    const createDefaultOptions = {};
    if (!skipSession) {
      const session = currentSession || asyncLocalStorage.getStore()?.get('dbSession');
      createDefaultOptions.session = session;
    }
    const newReqParams = isReqParamsArray ? reqParams : [reqParams];

    let doc = await model.create(newReqParams, createDefaultOptions);

    if (!isReqParamsArray) {
      doc = doc[0];
    }
    return doc;
  } catch (err) {
    console.log('error in createOne', err);
    if (err.message.indexOf('E11000') > -1 || err.message.indexOf('WriteConflict error:') > -1) {
      throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, errorMessages.DUPLICATE_RECORD);
    }
    throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, err);
  }
};

const getOneById = async ({ model, id, popOptions = '', subscribeSocket, select }) => {
  try {
    const session = asyncLocalStorage.getStore()?.get('dbSession');
    let query = model.findById(id, {}, { session });
    if (select?._current) query = query.select(select._current);
    if (popOptions) {
      popOptions.split(',').forEach((populateOption) => {
        query = query.populate({
          path: populateOption,
          ...(select?.[populateOption] ? { select: select[populateOption] } : {}),
        });
      });
    }
    const doc = await query;
    if (subscribeSocket) {
      const _metaData = encryptCrypto({
        data: JSON.stringify({
          model: model.modelName,
          filter: { _id: id },
          populate: Array.isArray(popOptions) ? popOptions?.join(',') : popOptions,
        }),
      });
      return {
        results: doc,
        _metaData,
      };
    }
    return doc;
  } catch (err) {
    console.log('error in getOneById', err);
    throw new ApiError(httpStatus.NOT_FOUND, errorMessages.NO_RECORD_FOUND);
  }
};

const getOne = async (
  { model, filter, popOptions = '', select, subscribeSocket, sessionRequired = true, otherOptions = {} },
  customSession
) => {
  try {
    const session = customSession || asyncLocalStorage.getStore()?.get('dbSession');
    const queryOptions = sessionRequired ? { session, ...otherOptions } : { ...otherOptions };
    let query = model.findOne(filter, {}, { ...queryOptions });
    // if (select) query = query.select(select);
    // if (popOptions) query = query.populate(popOptions);
    if (select?._current) query = query.select(select._current);
    if (popOptions) {
      if (typeof popOptions === 'string') {
        popOptions.split(',').forEach((populateOption) => {
          query = query.populate({
            path: populateOption.trim(),
            ...(select?.[populateOption.trim()] ? { select: select[populateOption.trim()] } : {}),
          });
        });
      } else if (Array.isArray(popOptions)) {
        popOptions.forEach((populateOption) => {
          query = query.populate(populateOption);
        });
      }
    }

    let doc = await query;
    if (doc) {
      doc = doc.toJSON();
    }
    if (subscribeSocket) {
      const _metaData = encryptCrypto({ data: JSON.stringify({ model: model.modelName, filter, populate: popOptions }) });
      return {
        results: doc,
        _metaData,
      };
    }
    return doc;
  } catch (err) {
    console.log('error in getOne', err);
    throw new ApiError(httpStatus.NOT_FOUND, errorMessages.NO_RECORD_FOUND);
  }
};

const getAll = async (
  { model, filter, otherOptions = {}, populateOptions, subscribeSocket, sessionRequired = true },
  currentSession
) => {
  try {
    const session = currentSession || asyncLocalStorage.getStore()?.get('dbSession');
    const queryOptions = sessionRequired ? { session } : {};
    const { sort, select, skip, limit } = otherOptions || {};
    let docsPromise = model.find(filter, null, { ...queryOptions });
    if (sort) {
      docsPromise = docsPromise.sort(sort);
    }
    if (skip) {
      docsPromise = docsPromise.skip(skip);
    }
    if (limit) {
      docsPromise = docsPromise.limit(limit);
    }
    if (select?._current) {
      docsPromise = docsPromise.select(select._current);
    }
    if (populateOptions) {
      if (typeof populateOptions === 'string') {
        populateOptions.split(',').forEach((populateOption) => {
          docsPromise = docsPromise.populate({
            path: populateOption,
            ...(select?.[populateOption] ? { select: select[populateOption] } : {}),
          });
        });
      } else if (Array.isArray(populateOptions)) {
        populateOptions.forEach((populateOption) => {
          docsPromise.populate(populateOption);
        });
      }
    }
    docsPromise = await docsPromise.exec();

    if (subscribeSocket) {
      const result = {};
      const _metaData = encryptCrypto({
        data: JSON.stringify({ model: model.modelName, filter, populate: populateOptions }),
      });
      Object.assign(result, { results: docsPromise, _metaData });
      return result;
    }
    return docsPromise;
  } catch (err) {
    console.log('error in getAll', err);
    throw new ApiError(httpStatus.NOT_FOUND, errorMessages.NO_RECORD_FOUND);
  }
};

const getPaginated = async ({ model, filter, otherOptions = {}, subscribeSocket }) => {
  try {
    const session = asyncLocalStorage.getStore()?.get('dbSession');
    Object.assign(otherOptions, { session });
    const doc = await model.paginate(filter, otherOptions);
    const _metaData = encryptCrypto({
      data: JSON.stringify({ model: model.modelName, filter, populate: otherOptions?.populate }),
    });
    if (subscribeSocket) Object.assign(doc, { _metaData });
    return doc;
  } catch (err) {
    console.log('error in getPaginated', err);
    throw new ApiError(httpStatus.NOT_FOUND, errorMessages.NO_RECORD_FOUND);
  }
};

const getFilteredList = async (params) => {
  try {
    const {
      model,
      req,
      allowedFilters,
      searchFilter,
      popOptions,
      addOnFilter = {},
      select,
      allowDeleteFilter = false,
    } = params || {};
    const filterOptions = pick(req.query, allowedFilters);
    const searchValue = pick(req.query, ['searchText']);
    let otherOptions = pick(req.query, ['sortBy', 'limit', 'page']);
    const { subscribeSocket } = req.query || {};
    if (popOptions) {
      if (typeof popOptions === 'string') {
        otherOptions.populate = popOptions;
      } else {
        otherOptions.populate = popOptions.map((pop) => {
          if (typeof pop === 'string') {
            return { path: pop };
          } else {
            return pop;
          }
        });
      }
    }
    if (select) {
      otherOptions.select = select;
    }
    if (otherOptions?.limit > 1000) {
      throw new Error('limit exceeds');
    }
    const filter = { ...addOnFilter };
    if (Object.keys(filterOptions).length) {
      filter.$and = [{ ...filterOptions }];
    }
    if (Object.keys(searchValue).length && Array.isArray(searchFilter)) {
      filter.$and = filter.$and ? [...filter.$and] : [];
      const regexFilter = [];
      searchFilter.forEach((_search) => {
        if (typeof _search !== 'object') {
          regexFilter.push({
            [_search]: {
              $regex: `^${searchValue.searchText}|(?<= )${searchValue.searchText}`,
              $options: 'i',
            },
          });
        }
        if (_search.type === 'number' && !Number.isNaN(Number(searchValue.searchText))) {
          regexFilter.push({ [_search.field]: parseInt(searchValue.searchText, 10) });
        }
      });
      filter.$and.push({
        $or: regexFilter,
      });
    }
    otherOptions = { ...otherOptions, allowDeleteFilter };
    const doc = await getPaginated({ model, filter, otherOptions, subscribeSocket });
    return doc;
  } catch (err) {
    console.log('error in getFilteredList', err);
    if (err.message.includes('limit exceeds')) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Query limit exceeds the criteria');
    }
    throw new ApiError(httpStatus.NOT_FOUND, errorMessages.NO_RECORD_FOUND);
  }
};

const countDocuments = async ({ model, filter = {}, subscribeSocket }) => {
  try {
    const doc = await model.countDocuments(filter);
    if (subscribeSocket) {
      const _metaData = encryptCrypto({ data: JSON.stringify({ model: model.modelName, filter, count: true }) });
      return {
        results: { count: doc },
        _metaData,
      };
    }
    return doc;
  } catch (err) {
    console.log('error in countDocuments', err);
    throw new ApiError(httpStatus.NOT_FOUND, errorMessages.NO_RECORD_FOUND);
  }
};

const getDistinctValues = async ({ model, field = '', filter = {} }) => {
  try {
    const doc = await model.distinct(field, filter);
    return doc;
  } catch (err) {
    console.log('error in getDistinctValues', err);
    throw new ApiError(httpStatus.NOT_FOUND, errorMessages.NO_RECORD_FOUND);
  }
};

const updateMany = async ({ model, filter, updateParams, options = {} }) => {
  try {
    const session = asyncLocalStorage.getStore()?.get('dbSession');
    const doc = await model.updateMany(filter, updateParams, {
      new: true,
      runValidators: true,
      session,
      ...options,
    });
    return doc;
  } catch (err) {
    console.log('error in updateMany', err);
    throw new ApiError(httpStatus.NOT_FOUND, errorMessages.NO_RECORD_FOUND);
  }
};

module.exports = {
  deleteOne,
  updateOne,
  updateById,
  createOne,
  getOneById,
  getOne,
  getFilteredList,
  getAll,
  getPaginated,
  deleteMany,
  countDocuments,
  updateMany,
  getDistinctValues,
};
