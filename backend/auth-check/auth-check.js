const jwt = require("jsonwebtoken");

module.exports = (req, res, next) =>{
    try {
        token = req.headers.auth.split(" ")[1];
        jwt.verify(token, "this_is_bowei's_angular_project");
        next();
    }
    catch(error) {
        res.status(401).json({
            message: "auth failed",
            error: error
        });
    }
}