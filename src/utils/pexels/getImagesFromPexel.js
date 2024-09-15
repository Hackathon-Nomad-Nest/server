const axios = require('axios');
const config = require('../../config/config');
const httpStatus = require('http-status');
const ApiError = require('../ApiError');

const fetchPhotos = async (queries) => {
  const apiEndpoint = config.pexels.url;
  const apiKey = config.pexels.key;

  const individualQueries = queries
    .split(',')
    .map(query => query.trim())
    .filter(query => query.length > 0); // Filter out any empty queries

  // Create requests for each individual query
  const requests = individualQueries.map(query =>
    axios.get(apiEndpoint, {
      headers: {
        Authorization: apiKey,
      },
      params: { query, per_page: 1 },
    }).then(response => ({
      query,
      data: response.data,
    }))
  );

  try {
    const responses = await Promise.allSettled(requests);

    // Combine the results into a single object
    const combinedResults = responses.reduce((acc, response) => {
      if (response.status === 'fulfilled') {
        const { query, data } = response.value;

        if (data && Array.isArray(data.photos)) {
          acc[query] = data.photos.map(photo => ({
            url: photo.url,
            alt: photo.alt,
          }));
        } else {
          acc[query] = [];
        }
      } else {
        // Optionally log or handle errors here if needed
      }

      return acc;
    }, {});

    return {
      message: "OK",
      result: combinedResults,
    };
  } catch (error) {
    throw new ApiError(httpStatus.NO_CONTENT, 'Error fetching from Pexels API');
  }
};

module.exports = fetchPhotos;
