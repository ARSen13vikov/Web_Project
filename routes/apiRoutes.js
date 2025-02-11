const express = require('express');
const apiController = require('../controllers/apiController');
const requireAuth = require('../middleware/requireAuth');
const router = express.Router();

router.use(requireAuth);

router.get('/weather', apiController.getWeather);
router.post('/weather', apiController.postWeather);

router.get('/history', apiController.getHistory);

module.exports = router;