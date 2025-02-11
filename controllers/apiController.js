const axios = require('axios');
const ApiHistory = require('../models/ApiHistory');

exports.getWeather = (req, res) => {
    res.render('weather', { weather: null, error: null, user: req.session.user || null });
};

exports.postWeather = async (req, res) => {
    const city = req.body.city;
    const openWeatherApiKey = process.env.OPENWEATHER_API_KEY;

    try {
        const weatherResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherApiKey}&units=metric`
        );

        const weatherData = weatherResponse.data;

        const weather = {
            city: weatherData.name,
            country: weatherData.sys.country,
            temperature: weatherData.main.temp,
            humidity: weatherData.main.humidity,
            windSpeed: weatherData.wind.speed,
            description: weatherData.weather[0].description,
            icon: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`,
            lat: weatherData.coord.lat,
            lon: weatherData.coord.lon,
        };

        const apiHistory = new ApiHistory({
            userId: req.session.user.userId,
            apiName: 'OpenWeather',
            requestData: { city },
            responseData: weather,
        });
        await apiHistory.save();

        res.render('weather', { weather, error: null, user: req.session.user || null });
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.render('weather', { weather: null, error: 'Error fetching weather data. Please try again.', user: req.session.user || null });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const history = await ApiHistory.find({ userId: req.session.user.userId }).sort({ timestamp: -1 });
        res.render('history', { history, user: req.session.user || null });
    } catch (error) {
        console.error('Error fetching history:', error);
        res.render('history', { history: [], user: req.session.user || null });
    }
};