const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();

const User = require("../module/user")

router.post('/signup', (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
     .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save().then(result => {
            res.status(201).json({
                message: "user signed up!",
                result: result
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "internal error!",
                error: err
            })
        });
     })
})

module.exports = router;