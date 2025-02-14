const express = require('express');
const authController = require('../controllers/authController');
const requireAuth = require('../middleware/requireAuth');
const router = express.Router();

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);

router.get('/logout', authController.logout);

router.get('/profile', requireAuth, (req, res) => {
    res.render('profile', { user: req.session.user });
});

module.exports = router;