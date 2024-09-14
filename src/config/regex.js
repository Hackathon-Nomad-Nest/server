const regex = {
  PASSWORD: /^(?=.*[!@#.$?%&*{}()\[\]:;^~`|'_+=\/\\",-])[a-zA-Z0-9!@#.$?%&*{}()\[\]:;^~`|'_+=\/\\",-]+$/,
  NAME: /^[a-zA-Z-' ]+$/,
  TIMEZONE: /^([A-Za-z_]+\/[A-Za-z_]+)$/,
  DESCRIPTION: /^[\w\-./@#!?$ ()\n]+$/,
  PLACE_ID: /^[a-zA-Z0-9,' _-]+$/,
  PRODUCT_NAME: /^(?!.*<[^>]+>)(?!.*&[#\w]+;)[^<>]*$/i,
};

module.exports = {
  regex,
};
