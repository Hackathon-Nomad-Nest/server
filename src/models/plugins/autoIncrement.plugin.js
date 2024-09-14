const { errorMessages } = require('../../config/error');
const TableCount = require('../TableCount.model');

function autoIncrement(schema, options) {
  const { field: fieldName, unique = 'practice' } = options;
  schema.pre('save', function (next, schemaOptions) {
    const allowSession = !!schemaOptions?.session;
    if (!this.isNew) {
      next();
      return;
    }
    if (!this[unique]) {
      const error = new Error(errorMessages.NO_UNIQUE_FILED);
      next(error);
      return;
    }
    const addOnFilter = this[unique] ? { [unique]: this[unique] } : {};
    if (this[fieldName]) {
      next();
    }
    TableCount.increment(this.constructor.modelName, addOnFilter, allowSession)
      .then((counter) => {
        const { count } = counter || {};
        this[fieldName] = count;
        next();
      })
      .catch((error) => {
        next(error);
      });
  });
}

module.exports = autoIncrement;
