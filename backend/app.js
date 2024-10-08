const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoute = require("./routes/posts");

const app = express();


mongoose.connect("mongodb+srv://bowei:WlQ894yNVzha7M2L@mean.skjk4.mongodb.net/posts?retryWrites=true&w=majority&appName=MEAN")
.then(()=>{
    console.log("Connected to database");
})
.catch(()=>{
    console.log("Connection failed!");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) =>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE, OPTIONS");
    next();
});

app.use("/api/posts", postsRoute);
module.exports = app;