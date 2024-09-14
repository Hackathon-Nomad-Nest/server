const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');
const { errorMessages } = require('../config/error');

const deleteOne = async ({ model, reqParams }) => {
  try {
    return await model.findByIdAndDelete(reqParams.id);
  } catch (err) {
    console.log('error in deleteOne', err);
    throw new ApiError(httpStatus.NOT_FOUND, errorMessages.NO_RECORD_FOUND);
  }
};

const deleteMany = async ({ model, filter }) => {
  try {
    return await model.deleteMany(filter);
  } catch (err) {
    console.log('error in deleteMany', err);
    throw new ApiError(httpStatus.NOT_FOUND, errorMessages.NO_RECORD_FOUND);
  }
};

const updateOne = async ({ model, filter, updateParams, options = {} }) => {
  try {
    const doc = await model.findOneAndUpdate(filter, updateParams, {
      new: true,
      runValidators: true,
      ...options,
    });
    return doc?.toJSON();
  } catch (err) {
    console.log('error in updateOne', err);
    if (err.message.includes('WriteConflict error:')) {
      throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, errorMessages.SAME_RECORD_IS_BEING_UPDATED);
    }
    throw new ApiError(httpStatus.NOT_FOUND, errorMessages.NO_RECORD_FOUND);
  }
};

const updateById = async ({ model, reqParams }) => {
  try {
    const { _id, ...rest } = reqParams;
    const doc = await model.findByIdAndUpdate(_id, rest, {
      new: true,
      runValidators: true,
    });
    return doc.toJSON();
  } catch (err) {
    console.log('error in updateById', err);
    if (err.message.includes('WriteConflict error:')) {
      throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, errorMessages.SAME_RECORD_IS_BEING_UPDATED);
    }
    throw new ApiError(httpStatus.NOT_FOUND, errorMessages.NO_RECORD_FOUND);
  }
};

const createOne = async ({ model, reqParams }) => {
  try {
    const isReqParamsArray = Array.isArray(reqParams);
    const newReqParams = isReqParamsArray ? reqParams : [reqParams];

    let doc = await model.create(newReqParams);
    if (!isReqParamsArray) {
      doc = doc[0];
    }
    return doc;
  } catch (err) {
    console.log('error in createOne', err);
    if (err.message.includes('E11000') || err.message.includes('WriteConflict error:')) {
      throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, errorMessages.DUPLICATE_RECORD);
    }
    throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, err);
  }
};

const getOneById = async ({ model, id, popOptions = '', select }) => {
  try {
    let query = model.findById(id);
    if (select?._current) query = query.select(select._current);
    if (popOptions) {
      popOptions.split(',').forEach((populateOption) => {
        query = query.populate({
          path: populateOption,
          ...(select?.[populateOption] ? { select: select[populateOption] } : {}),
        });
      });
    }
    return await query;
  } catch (err) {
    console.log('error in getOneById', err);
    throw new ApiError(httpStatus.NOT_FOUND, errorMessages.NO_RECORD_FOUND);
  }
};

const getOne = async ({ model, filter, popOptions = '', select, otherOptions = {} }) => {
  try {
    let query = model.findOne(filter, {}, { ...otherOptions });
    if (select?._current) query = query.select(select._current);
    if (popOptions) {
      popOptions.split(',').forEach((populateOption) => {
        query = query.populate({
          path: populateOption,
          ...(select?.[populateOption] ? { select: select[populateOption] } : {}),
        });
      });
    }
    let doc = await query;
    if (doc) {
      doc = doc.toJSON();
    }
    return doc;
  } catch (err) {
    console.log('error in getOne', err);
    throw new ApiError(httpStatus.NOT_FOUND, errorMessages.NO_RECORD_FOUND);
  }
};

const getAll = async ({ model, filter, otherOptions = {}, populateOptions }) => {
  try {
    const { sort, select, skip, limit } = otherOptions || {};
    let docsPromise = model.find(filter);
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
      populateOptions.split(',').forEach((populateOption) => {
        docsPromise = docsPromise.populate({
          path: populateOption,
          ...(select?.[populateOption] ? { select: select[populateOption] } : {}),
        });
      });
    }
    return await docsPromise.exec();
  } catch (err) {
    console.log('error in getAll', err);
    throw new ApiError(httpStatus.NOT_FOUND, errorMessages.NO_RECORD_FOUND);
  }
};

const getPaginated = async ({ model, filter, otherOptions = {} }) => {
  try {
    return await model.paginate(filter, otherOptions);
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
    if (popOptions) {
      otherOptions.populate = popOptions.split(',').map((pop) => pop.trim());
    }
    if (select) {
      otherOptions.select = select;
    }
    if (otherOptions?.limit > 1000) {
      throw new Error('limit exceeds');
    }
    const filter = { ...addOnFilter, ...filterOptions };
    if (Object.keys(searchValue).length && Array.isArray(searchFilter)) {
      filter.$or = searchFilter.map((key) => ({
        [key]: { $regex: searchValue.searchText, $options: 'i' },
      }));
    }
    otherOptions = { ...otherOptions, allowDeleteFilter };
    return await getPaginated({ model, filter, otherOptions });
  } catch (err) {
    console.log('error in getFilteredList', err);
    if (err.message.includes('limit exceeds')) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Query limit exceeds the criteria');
    }
    throw new ApiError(httpStatus.NOT_FOUND, errorMessages.NO_RECORD_FOUND);
  }
};

const countDocuments = async ({ model, filter = {} }) => {
  try {
    return await model.countDocuments(filter);
  } catch (err) {
    console.log('error in countDocuments', err);
    throw new ApiError(httpStatus.NOT_FOUND, errorMessages.NO_RECORD_FOUND);
  }
};

const getDistinctValues = async ({ model, field = '', filter = {} }) => {
  try {
    return await model.distinct(field, filter);
  } catch (err) {
    console.log('error in getDistinctValues', err);
    throw new ApiError(httpStatus.NOT_FOUND, errorMessages.NO_RECORD_FOUND);
  }
};

const updateMany = async ({ model, filter, updateParams, options = {} }) => {
  try {
    return await model.updateMany(filter, updateParams, {
      new: true,
      runValidators: true,
      ...options,
    });
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
