const express = require("express")
const multer = require("multer")

const fileMap = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

const app = express();
const storage = multer.diskStorage({
    destination: (req, file ,cbb) => {
        const isValid = fileMap[file.mimetype];
        let error = new Error("Invalid mime type");
        if(isValid)
            error = null;
        cbb(error, "backend/images");
    },
    filename : (req, file, cbb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ex = fileMap[file.mimetype];
        cbb(null, name + '-' + Date.now() + '.' + ex);
    }
});

const Post = require('../module/post');
const { Error } = require("mongoose");

app.post('', multer({storage: storage}).single("image"), (req, res, next) =>{
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        filePath: url + "/images/" + req.file.filename
    });
    post.save()
     .then(result =>{
        res.status(201).json({
        message: "Post added successfully",
        post: {
            id: result._id,
            title: result.title,
            content: result.content,
            filePath: post.filePath
        }
     });
    });
    //const post = req.body; 
});

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
            res.status(200).json(post);
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
        res.status(200).json({ message: "delete successfully" });
    });
});

app.put('/:id', multer({storage: storage}).single("image"), (req, res, next)=>{
    let filePath = req.body.filePath;
    if(req.file){
        const url = req.protocol + '://' + req.get("host");
        filePath = url + "/images/" + req.file.filename
    }
    const post = new Post({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        filePath: filePath
    });
    console.log(post);
    Post.updateOne({_id: req.params.id}, post)
    .then(result =>{
        res.status(200).json({ message: 'Updated successfully', post: post});
    });
    
});

module.exports = app;