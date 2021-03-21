// Routes for auth
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Creating an user
// api/auth
router.post('/', 
    [
        check('email', 'Email is required!').isEmail(),
        check('password', 'Password must have at least 6 characters!').isLength({min: 6})
    ],
    authController.authenticateUser
);

router.get('/',
    auth,
    authController.loggedUser
)

module.exports = router;