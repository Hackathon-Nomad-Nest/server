const axios = require('axios');
const config = require('../../config/config');
const ApiError = require('../ApiError');
const httpStatus = require('http-status');
const { errorMessages } = require('../../config/error');

// Define the API URL and headers
const apiUrl = config.open_ai.url;
const headers = {
  'Content-Type': 'application/json',
  'x-rapidapi-host': config.open_ai.host,
  'x-rapidapi-key': config.open_ai.key,
};

const cleanResponse = (response) => {
  try {
    let messageContent = response.choices[0].message.content;

    if (messageContent.startsWith('```json')) {
      messageContent = messageContent.slice(7).trim();
    }
    if (messageContent.endsWith('```')) {
      messageContent = messageContent.slice(0, -3).trim();
    }

    const parsedContent = JSON.parse(messageContent);
    return JSON.parse(JSON.stringify(parsedContent), (key, value) => (value === 'undefined' ? null : value));
  } catch (error) {
    throw new ApiError(httpStatus.NO_CONTENT, errorMessages.INVALID('Response'));
  }
};

const generateTipsAndMusic = async (travelInput) => {
  const {
    from,
    to,
    tripType,
    startDate,
    endDate,
    preferredTravelMode = 'bus',
  } = travelInput;

  try {
    const response = await axios.post(
      apiUrl,
      {
        messages: [
          {
            role: 'user',
            content: `
              I am going on a trip from ${from} to ${to} starting from ${startDate} to ${endDate} by ${preferredTravelMode}, and our trip type is ${tripType}, suggest me tips for the trip and a list of ten bollywood and ten hollywood songs to listen while traveling. Use the best conveyance in my budget and keep the plan under my budget. Please format the response as follows: 
             {
                "trip_tips": [
                  "Pack light and carry essentials.",
                  "Check the weather before departure.",
                  "Carry a reusable water bottle.",
                  "Keep copies of important documents.",
                  "Inform your bank about travel plans.",
                  "Research local customs and etiquette.",
                  "Carry a portable charger for devices.",
                  "Wear comfortable shoes for sightseeing.",
                  "Stay hydrated and eat local cuisine.",
                  "Download offline maps for navigation."
                ],
                "music_recommendations": {
                  "bollywood": [
                    { "name": "Tum Hi Ho", "artist": "Arijit Singh", "details": "From the movie Aashiqui 2" },
                    { "name": "Kal Ho Naa Ho", "artist": "Sonu Nigam", "details": "From the movie Kal Ho Naa Ho" },
                    { "name": "Tera Ban Jaunga", "artist": "Akhil Sachdeva, Tulsi Kumar", "details": "From the movie Kabir Singh" },
                    { "name": "Dil Dhadakne Do", "artist": "Farhan Akhtar, Priyanka Chopra", "details": "From the movie Zindagi Na Milegi Dobara" },
                    { "name": "Gallan Goodiyan", "artist": "Yashita Sharma, Sukhwinder Singh", "details": "From the movie Dil Dhadakne Do" },
                    { "name": "Channa Mereya", "artist": "Arijit Singh", "details": "From the movie Ae Dil Hai Mushkil" },
                    { "name": "Badtameez Dil", "artist": "Benny Dayal", "details": "From the movie Yeh Jawaani Hai Deewani" },
                    { "name": "Lungi Dance", "artist": "Yo Yo Honey Singh", "details": "From the movie Chennai Express" },
                    { "name": "Tujh Mein Rab Dikhta Hai", "artist": "Roop Kumar Rathod", "details": "From the movie Rab Ne Bana Di Jodi" },
                    { "name": "Zara Sa", "artist": "KK", "details": "From the movie Jannat" }
                  ],
                  "hollywood": [
                    { "name": "Shape of You", "artist": "Ed Sheeran", "details": "From the album ÷ (Divide)" },
                    { "name": "Blinding Lights", "artist": "The Weeknd", "details": "From the album After Hours" },
                    { "name": "Uptown Funk", "artist": "Mark Ronson feat. Bruno Mars", "details": "From the album Uptown Special" },
                    { "name": "Rolling in the Deep", "artist": "Adele", "details": "From the album 21" },
                    { "name": "Stayin' Alive", "artist": "Bee Gees", "details": "From the album Saturday Night Fever Soundtrack" },
                    { "name": "Billie Jean", "artist": "Michael Jackson", "details": "From the album Thriller" },
                    { "name": "Don't Stop Believin'", "artist": "Journey", "details": "From the album Escape" },
                    { "name": "Hotel California", "artist": "Eagles", "details": "From the album Hotel California" },
                    { "name": "Someone Like You", "artist": "Adele", "details": "From the album 21" },
                    { "name": "Bohemian Rhapsody", "artist": "Queen", "details": "From the album A Night at the Opera" }
                  ]
                }
              }
            `,
          },
        ],
        model: 'gpt-4o',
        max_tokens: 2000,
        temperature: 0.9,
      },
      { headers }
    );
    const cleanedResponse = cleanResponse(response.data);

    return cleanedResponse;
  } catch (error) {
    throw new ApiError(httpStatus.EXPECTATION_FAILED, error.data.message || error);
  }
};

module.exports = generateTipsAndMusic;
