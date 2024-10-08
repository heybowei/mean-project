const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Post = require('./module/post');

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
app.post('/api/posts', (req, res, next) =>{
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save()
     .then(result =>{
        res.status(201).json({
        message: "Post added successfully",
        createdId: result._id
     });
    });
    //const post = req.body;
    
})
app.get('/api/posts', (req, res, next) =>{
    Post.find()
    .then(documents =>{
        res.status(200).json({
            message: "Post fetched successfully",
            posts: documents
        });
    });
});


app.delete('/api/posts/:id', (req, res, next)=>{
    Post.deleteOne({_id: req.params.id})
    .then((result) =>{
        console.log(result);
        res.status(200).json({ message: "delete successfully" });
    });
});

app.put('/api/posts/:id', (req, res, next)=>{
    const post = new Post({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content
    });
    Post.updateOne({_id: req.params.id}, post)
    .then(result =>{
        console.log(result);
        res.status(200).json({ message: 'Updated successfully'});
    });
    
});

module.exports = app;