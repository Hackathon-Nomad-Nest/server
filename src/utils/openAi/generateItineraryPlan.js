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
      
      // Remove surrounding markdown if present
      if (messageContent.startsWith('```json')) {
        messageContent = messageContent.slice(7).trim();
      }
      if (messageContent.endsWith('```')) {
        messageContent = messageContent.slice(0, -3).trim();
      }
      
      // Parse JSON and handle undefined values
      const parsedContent = JSON.parse(messageContent);
      return JSON.parse(JSON.stringify(parsedContent), (key, value) => value === 'undefined' ? null : value);
    } catch (error) {
        throw new ApiError(httpStatus.NO_CONTENT, errorMessages.INVALID('Response'));
    }
  };

// Function to send the planPrompt and handle the response
const generateItineraryPlan = async (travelInput) => {
  const { from, to, numberOfDays = 3, budget, adults, kids = 0, pet = 0, tripType, startDate, preferredTravelMode = 'bus' } = travelInput;
  try {
    const response = await axios.post(
      apiUrl,
      {
        messages: [
          {
            role: 'user',
            content: `
              I want to go on a trip from ${from} to ${to} for ${numberOfDays} days starting from ${startDate} by ${preferredTravelMode}, my budget is ${budget}, we are ${adults} adults, and ${kids} kids, and ${pet} pet, and we would like to experience the ${tripType} there. Provide a detailed travel plan and a list of essentials to carry. Include details about transportation, accommodation, restaurants, and weather. Use the best conveyance in my budget and keep the plan under my budget. Please format the response as follows: 
              {
  "trip_details": {
    "start_date": "2024-09-13",
    "end_date": "2024-09-16",
    "origin": "Delhi",
    "destination": "Shimla",
    "budget": 10000,
    "adults": 2
  },
  "travel_plan": {
    "day_1": {
      "departure": {
        "mode": "train",
        "station": "New Delhi Railway Station",
        "location_latitude": "value",
        "location_longitude": "value",
        "time": "06:45 AM",
        "train_name": "Kalka Shatabdi Express",
        "arrival_station": "Kalka Railway Station",
        "arrival_time": "11:45 AM",
        "price": "500",
        "class": "Chair Car",
        "description": "Comfortable and fast train journey to Kalka."
      },
      "transfer": {
        "mode": "toy train",
        "station": "Kalka Railway Station",
        "location_latitude": "value",
        "location_longitude": "value",
        "time": "12:10 PM",
        "train_name": "Himalayan Queen",
        "arrival_station": "Shimla Railway Station",
        "arrival_time": "05:30 PM",
        "price": "500",
        "class": "Chair Car",
        "description": "Scenic ride through the hills with beautiful views."
      },
      "check_in": {
        "hotel": "Hotel Woodland",
        "location_latitude": "value",
        "location_longitude": "value",
        "price_per_night": "1000",
        "total_cost": 3000,
        "location": "Mall Road, Shimla",
        "description": "A comfortable hotel located in the heart of Shimla."
      },
      "evening_activity": {
        "activity": "Stroll on Mall Road and The Ridge",
        "location_latitude": "value",
        "location_longitude": "value",
        "description": "Enjoy a leisurely walk on Mall Road and The Ridge, exploring local shops and enjoying the views.",
        "price": "Free"
      },
      "dinner": {
        "restaurant": "Cafe Sol",
        "location_latitude": "value",
        "location_longitude": "value",
        "price": "500",
        "famous_dishes": ["Veg Cutlet", "Pizza"],
        "location": "Mall Road, Shimla",
        "description": "A popular restaurant known for its delicious pizza and veggie cutlets."
      }
    },
    "day_2": {
      "breakfast": {
        "restaurant": "Indian Coffee House",
        "location_latitude": "value",
        "location_longitude": "value",
        "price": "500",
        "famous_dishes": ["Veg Cutlet", "Pizza"],
        "location": "Mall Road, Shimla",
        "description": "Enjoy a hearty breakfast with a range of options."
      },
      "morning_activity": {
        "activity": "Visit Jakhoo Temple",
        "location_latitude": "value",
        "location_longitude": "value",
        "price": 100,
        "description": "A temple known for its large Hanuman statue and panoramic views of Shimla."
      },
      "lunch": {
        "restaurant": "Ashiana & Goofa",
        "location_latitude": "value",
        "location_longitude": "value",
        "price": "500",
        "famous_dishes": ["Veg Cutlet", "Pizza"],
        "location": "The Ridge, Shimla",
        "description": "Enjoy traditional Indian dishes in a cozy setting."
      },
      "afternoon_activity": {
        "activity": "Explore Christ Church and Gaiety Heritage Cultural Complex",
        "location_latitude": "value",
        "location_longitude": "value",
        "description": "Visit these historic landmarks to experience Shimla's colonial past.",
        "price": "Free"
      },
      "evening_activity": {
        "activity": "Visit Lakkar Bazaar for shopping",
        "location_latitude": "value",
        "location_longitude": "value",
        "description": "Explore this market for wooden crafts and souvenirs.",
        "price": "Varies"
      },
      "dinner": {
        "restaurant": "Seventh Heaven",
        "location_latitude": "value",
        "location_longitude": "value",
        "price": "500",
        "famous_dishes": ["Veg Cutlet", "Pizza"],
        "location": "Hotel Combermere, Mall Road, Shimla",
        "description": "A fine dining restaurant offering a variety of dishes."
      }
    },
    "day_3": {
      "breakfast": {
        "restaurant": "Wake & Bake Cafe",
        "location_latitude": "value",
        "location_longitude": "value",
        "price": "500",
        "famous_dishes": ["Veg Cutlet", "Pizza"],
        "location": "Mall Road, Shimla",
        "description": "A cafe known for its excellent breakfast options."
      },
      "morning_activity": {
        "activity": "Trip to Kufri (arranged by local taxi)",
        "location_latitude": "value",
        "location_longitude": "value",
        "description": "Explore Kufri, a hill station nearby known for its adventure activities.",
        "price": "1200 (taxi fare)"
      },
      "lunch": {
        "restaurant": "Kufri Fun World Cafe",
        "location_latitude": "value",
        "location_longitude": "value",
        "price": "500",
        "famous_dishes": ["Veg Cutlet", "Pizza"],
        "location": "Kufri",
        "description": "A cafe at Kufri offering refreshments and snacks."
      },
      "afternoon_activity": {
        "activity": "Return to Shimla and visit Viceregal Lodge",
        "location_latitude": "value",
        "location_longitude": "value",
        "description": "Tour the former residence of the British Viceroy, now a museum.",
        "price": "200 (entry fee)"
      },
      "check-out": {
        "hotel": "Hotel Woodland",
        "location_latitude": "value",
        "location_longitude": "value",
        "checkout_time": "02:00 PM",
        "description": "Check-out from the hotel before departing."
      },
      "departure": {
        "mode": "toy train",
        "station": "Shimla Railway Station",
        "location_latitude": "value",
        "location_longitude": "value",
        "time": "03:50 PM",
        "train_name": "Himalayan Queen",
        "arrival_station": "Kalka Railway Station",
        "arrival_time": "09:15 PM",
        "price": "500",
        "class": "Chair Car",
        "description": "Return journey with scenic views."
      },
      "transfer": {
        "mode": "train",
        "station": "Kalka Railway Station",
        "location_latitude": "value",
        "location_longitude": "value",
        "time": "11:55 PM",
        "train_name": "Kalka Mail",
        "arrival_station": "New Delhi Railway Station",
        "arrival_time": "05:00 AM",
        "price": "500",
        "class": "Sleeper",
        "description": "Overnight train back to Delhi."
      }
    }
  },
  "essentials_to_carry": {
    "general": [
      "Valid ID proofs",
      "Train tickets",
      "Hotel booking confirmation",
      "Cash and cards",
      "Mobile phone and charger",
      "Camera and charger",
      "Light backpack"
    ],
    "clothing": [
      "Light woolen clothes (for evenings)",
      "Comfortable walking shoes",
      "Umbrella or raincoat (for unexpected showers)"
    ],
    "toiletries": [
      "Toothbrush and toothpaste",
      "Hand sanitizer",
      "Face wash",
      "Sunscreen",
      "Lip balm"
    ],
    "medication": [
      "Personal medications",
      "First aid kit"
    ]
  },
  "weather_info": {
    "average_temperature": {
      "high": "20°C",
      "low": "12°C"
    },
    "precipitation": "Moderate chance of rain"
  },
  "cost_summary": {
    "total_food_cost": 2500,
    "total_stay_cost": 3000,
    "total_transportation_cost": 2000,
    "total_activity_cost": 500,
    "total_entry_fee": 300,
    "total_trip_cost": 8300,
    "description": {
      "total_food_cost": "Total cost for all meals during the trip.",
      "total_stay_cost": "Total cost for 3 nights at the hotel.",
      "total_transportation_cost": "Cost for train and toy train fares.",
      "total_activity_cost": "Cost for activities like visiting Kufri and Viceregal Lodge.",
      "total_entry_fee": "Fees for entry to places like Jakhoo Temple and Viceregal Lodge.",
      "total_trip_cost": "Overall cost for the trip including food, stay, transportation, and activities."
    }
  }`,
          },
        ],
        model: 'gpt-4o',
        max_tokens: 3000,
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

module.exports = generateItineraryPlan;
