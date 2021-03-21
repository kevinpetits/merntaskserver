const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    //Reading token from header
    const token = req.header('x-auth-token');

    //Check if there is not a token
    if(!token){
        return res.status(401).json({msg: 'Unauthorized, token not found'})
    }

    //Validate the token
    try {
        const encrypted = jwt.verify(token, process.env.SECRET);
        req.user = encrypted.user;
        next();
    } catch (error) {
        res.status(401).json({msg: 'Unauthorized'});
    }
} 