const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
  // Validating errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Extracting the user and password
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Create the user
    user = new User(req.body);

    // Hashing the password
    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(password, salt);

    //Saving the user
    await user.save();

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
    res.status(400).send("An error has happened");
  }
};
