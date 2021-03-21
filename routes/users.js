// Routes for users
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { check } = require('express-validator');

// Creating an user
// api/users
router.post('/', 
    [
        check('name', 'Name is required!').not().isEmpty(),
        check('email', 'Email is required!').isEmail(),
        check('password', 'Password must have at least 6 characters!').isLength({min: 6})
    ],
    userController.createUser
);

module.exports = router;