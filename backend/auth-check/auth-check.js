const jwt = require("jsonwebtoken");

module.exports = (req, res, next) =>{
    try {
        token = req.headers.auth.split(" ")[1];
        const decodedToken = jwt.verify(token, "this_is_bowei's_angular_project");
        req.userData = {email: decodedToken.email, userID: decodedToken.userID};
        next();
    }
    catch(error) {
        res.status(401).json({
            message: "Not Authed",
            error: error
        });
    }
}