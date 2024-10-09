const express = require("express")

const app = express();

const Post = require('../module/post');

app.post('', (req, res, next) =>{
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
app.get('', (req, res, next) =>{
    Post.find()
    .then(documents =>{
        res.status(200).json({
            message: "Post fetched successfully",
            posts: documents
        });
    });
});

app.get('/:id', (req, res, next) =>{
    Post.findById(req.params.id).then( post => {
        if(post){
            res.status(200).json({
                message: "Get post successfully",
                title: post.title,
                content: post.content
            });
        } else {
            res.status(404).json({
                message: "Not Found"
            });
        }
    });
});


app.delete('/:id', (req, res, next)=>{
    Post.deleteOne({_id: req.params.id})
    .then((result) =>{
        console.log(result);
        res.status(200).json({ message: "delete successfully" });
    });
});

app.put('/:id', (req, res, next)=>{
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