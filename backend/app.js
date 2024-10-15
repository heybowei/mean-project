const path = require("path")
const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRouter = require("./routes/posts");
const usersRouter = require("./routes/users")

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
app.use("/images", express.static(path.join("backend/images")))

app.use((req, res, next) =>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Auth");
    res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE, OPTIONS");
    next();
});

app.use("/api/posts", postsRouter);
app.use("/api/users", usersRouter);
module.exports = app;