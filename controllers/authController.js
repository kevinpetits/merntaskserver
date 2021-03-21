const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require('jsonwebtoken');

exports.authenticateUser = async (req, res) => {
    // Validating errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    //extract email and password
    const {email, password} = req.body;

    try {
        //Check if user is registered
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({msg: 'The user does not exists'})
        }

        //Check the password
        const correctPassword = await bcryptjs.compare(password, user.password);
        if(!correctPassword){
            return res.status(400).json({msg: 'Incorrect password'})
        }

        //Creating the JWT 
        const payload = {
            user: {
                id: user.id
            }
        };

        //Sign the token
        jwt.sign(payload, process.env.SECRET, {
            expiresIn: 3600
        }, (err, token) => {
            if(err) throw error;
            res.json({
                token
            });
        });
    } catch (error) {
        console.log(error);
    }
}


exports.loggedUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({user});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'An error has occurred'})
    }
}