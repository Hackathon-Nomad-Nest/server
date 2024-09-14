const errorMessages = {
  CONTENT_TYPE: 'Invalid content type.',
  EMAIL_EXISTS: 'Email already exists.',
  INVALID_PASSWORD_PATTERN:
    'Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and has a minimum length of 8 characters.',
  NOT_FOUND: 'Not Found.',
  NO_RECORD_FOUND: 'No record found.',
  USER_NOT_FOUND: 'User not found.',
  TOKEN_NOT_FOUND: 'Token not found.',
  FAILED_TO_CREATE: 'Failed to create record.',
  INCOMPLETE_PARAMS: 'Incomplete parameters.',
  EMAIL_VERIFICATION_FAILED: 'Email verification failed.',
  PASSWORD_RESET_FAILED: 'Password reset failed.',
  REQUIRE_AUTHENTICATION: 'Please authenticate.',
  INCORRECT_LOGIN: 'Incorrect email or password.',
  CANNOT_UPDATE_PASSWORD: 'Sorry, we cannot update your password.',
  USER_INACTIVE: 'User is inactive.',
  DUPLICATE_RECORD: 'Record already exists.',
  INVALID: (key) => `Invalid ${key}.`,
  NOT_AUTHORIZED: 'Not authorized',
  PLEASE_AUTHENTICATE: 'Please authenticate',
  UNAUTHORIZED: 'User not authorized for this action',
  FAILED_TO_SET_PASSWORD: 'Please retry after re-entering your password.',
  SAME_RECORD_IS_BEIGN_UPDATED: 'Same record is being updated'
};
module.exports = {
  errorMessages,
};
