const express = require("express");
const multer = require("multer");

const fileMap = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

const router = express.Router();
//const app = express();
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
const authCheck = require("../auth-check/auth-check")

router.post('', authCheck, multer({storage: storage}).single("image"), (req, res, next) =>{
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        filePath: url + "/images/" + req.file.filename,
        creator: req.userData.userID
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
     }
     .catch(error => {
        res.status(500).json({
            message: "upload post failed!"
        })
     })
    );
    });
    //const post = req.body; 
});

router.get('', (req, res, next) =>{
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if(pageSize && currentPage){
        postQuery.skip(pageSize * (currentPage - 1))
         .limit(pageSize);
    }
    postQuery
    .then(documents =>{
        fetchedPosts = documents;
        return count = Post.countDocuments();
    })
    .then(count =>{
        res.status(200).json({
            message: "fetched posts successfully",
            posts: fetchedPosts,
            postsCount: count
        });
    })
    .catch(error => {
        res.status(500).json({
            message: "fetched posts failed!"
        })
    });
});

router.get('/:id', (req, res, next) =>{
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


router.delete('/:id', authCheck, (req, res, next)=>{

    Post.deleteOne({_id: req.params.id, creator: req.userData.userID})
    .then((result) =>{
        if(result.n > 0){
            res.status(200).json({ message: "delete successfully" });
        }
        else {
            res.status(401).json({message: "Not Authed!"});
        }
        
    });
});

router.put('/:id', authCheck, multer({storage: storage}).single("image"), (req, res, next)=>{
    let filePath = req.body.filePath;
    if(req.file){
        const url = req.protocol + '://' + req.get("host");
        filePath = url + "/images/" + req.file.filename
    }
    const post = new Post({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        filePath: filePath,
        creator: req.userData.userID
    });

    Post.updateOne({_id: req.params.id, creator: req.userData.userID}, post)
    .then(result =>{
        if(result.n > 0){
            res.status(200).json({ message: 'Updated successfully', post: post});
        } else {
            res.status(401).json({ message: 'Not Authed!'});
        }
        
    });
    
});

module.exports = router;