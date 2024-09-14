const axios = require('axios');
const config = require('../../config/config');
const httpStatus = require('http-status');

const fetchPhotos = async (queries) => {
  const apiEndpoint = config.pexels.url;
  const apiKey = config.pexels.key; 

  const requests = queries.map((query) =>
    axios.get(apiEndpoint, {
      headers: {
        Authorization: apiKey,
      },
      params: { query, per_page: 5 },
    })
  );

  try {
    const responses = await Promise.allSettled(requests);
    // Combine the results into a single object
    const combinedResults = responses.reduce((acc, response, index) => {
      const query = queries[index];

      if (response.status === 'fulfilled') {
        // Handle fulfilled responses
        const data = response.value.data;

        if (data && Array.isArray(data.photos)) {
          acc[query] = data.photos.map((photo) => ({
            url: photo.url,
            alt: photo.alt,
          }));
        } else {
          acc[query] = [];
        }
      } else {
        acc[query] = [];
        throw new ApiError(httpStatus.NO_CONTENT, errorMessages.INVALID('Response'));
      }

      return acc;
    }, {});

    return combinedResults;
  } catch (error) {
    throw new ApiError(httpStatus.NO_CONTENT, 'Error fetching from Pexels API');
  }
};

module.exports = fetchPhotos;
