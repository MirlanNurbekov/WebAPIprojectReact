const mongoose = require('mongoose');

const DATA = new mongoose.Schema(
    {
        userFrom: { type: String },
        cityName: { type: String },
        countryName: { type: String },
        temperatureValue:{ type: String},
        humidityValue:{ type: String},
    },
    { collection: 'favourite-data' } // Can see at MongoDB
)

const safedWeather = mongoose.model('FavouriteData', DATA);

module.exports = safedWeather; 