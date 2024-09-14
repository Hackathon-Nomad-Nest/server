const { asyncLocalStorage } = require('../../utils/asyncStorage');

function addUserStamp(schema) {
  schema.pre('save', function (next) {
    try {
      const user = asyncLocalStorage.getStore()?.get('user');
      const { id: userId } = user || {};
      if (userId) {
        if (this.isNew) {
          this._createdBy = userId;
        } else {
          this._updatedBy = userId;
        }
      }
    } catch (err) {
      console.log('>>>>error in userStamp plugin at pre save', err);
    }
    next();
  });

  schema.pre('findOneAndUpdate', function (next) {
    try {
      const user = asyncLocalStorage.getStore()?.get('user');
      const { id: userId } = user || {};
      if (userId) {
        this._update._updatedBy = userId;
      }
    } catch (err) {
      console.log('>>>>error in userStamp plugin at pre findOneAndUpdate', err);
    }
    next();
  });
}

module.exports = addUserStamp;
