const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

router.post('/login', (req, res, next) => {
    let fetchedUser;
    User.findOne({email: req.body.email})
     .then(user => {
        fetchedUser = user;
        if(!user){
            return res.status(401).json({
                message: "user not exists"
            });
        }
        return bcrypt.compare(req.body.password, user.password);
     })
     .then(result =>{
        if(!result){
            return res.status(401).json({
                message: "wrong password"
            })
        }
        const token = jwt.sign({
            email: fetchedUser.email, 
            userID: fetchedUser._id}, 
            "this_is_bowei's_angular_project", 
            {expiresIn: "1h"}
        );
        res.status(200).json({
            token: token,
            activeTime: 3600,
            userID: fetchedUser._id,
            email: fetchedUser.email,
            message: "login successfully!"
        });
     })
      .catch(err => {
        console.log(err);
        res.status(401).json({
            message: "something wrong",
            err: err
        })
      })
})

module.exports = router;