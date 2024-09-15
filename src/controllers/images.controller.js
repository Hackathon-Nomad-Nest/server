const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const fetchPhotos = require('../utils/pexels/getImagesFromPexel');

const fetchImages = catchAsync(async (req, res) => {
  const photos = await fetchPhotos(req.query.queries);
  res.status(httpStatus.OK).send({message: 'OK', result: photos});
});

module.exports = {
  fetchImages
};