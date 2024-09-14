const express = require('express');
const { userController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .get(userController.getUser);

// router
//   .route('/self')
//   .get(authNew(),
//     validate(userValidation.getSelf),
//     userController.getSelf
//   )
//   .put(authNew(), validate(userValidation.updateSelf), userController.updateUser);

// router
//   .route('/:userId')
//   .get(authNew(userPermissions.VIEW_USER_DETAIL), validate(userValidation.getUser), userController.getUser)
//   .put(auth('manageUsers'), validate(userValidation.updateUser), userController.updateUser)
//   .delete(auth('manageUsers'), validate(userValidation.deleteUser), userController.deleteUser);

// router
//   .route('/managePermissions/:userId')
//   .get(auth('getUserPermission'), validate(userValidation.getUserPermissions), userController.getUserPermissions)
//   .put(auth('addUserPermissions'), validate(userValidation.addUserPermissions), userController.addUserPermissions)
//   .delete(auth('deleteUserPermissions'), validate(userValidation.deleteUserPermissions), userController.deleteUserPermissions);

module.exports = router;
