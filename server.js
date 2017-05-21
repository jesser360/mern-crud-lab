'use strict'

//import dependencies
var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    Comment = require('./model/comments');

//create instances
var app = express(),
    router = express.Router();

// set port to env or 3000
var port = process.env.API_PORT || 3001;

//db config
//ADD YOUR INFO HERE!
mongoose.connect('mongodb://mern-comment-box:123123@ds145790.mlab.com:45790/mern-comment-box');

//config API to use bodyParser and look for JSON in req.body
app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());

//Prevent CORS errors
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

  //Remove caching
  res.setHeader('Cache-Control', 'no-cache');
  next();
});
app.use('/api', router);

//set route path and init API
router.get('/', function(req,res) {
  res.json({message: 'API Initialized!'});
});
//
//adding the /comments route to our /api router
router.route('/comments')
  .get(function(req, res) {
    //looks at our Comment Schema
    Comment.find(function(err, comments) {
      if (err){
        res.send(err);
      }
      res.json(comments)
    });
  })
  .post(function(req, res) {
    var comment = new Comment();
    //body parser lets us use the req.body
    comment.author = req.body.author;
    comment.text = req.body.text;

    comment.save(function(err) {
      if (err){
        res.send(err);
      }
      res.json({ message: 'Comment successfully added!' });
    });
  });

// delete all comments
router.route('/nuke').get(function(req,res){
  Comment.remove(function(err,succ){
  res.json(succ);
  });
});


router.route('/comments/:comment_id')
.put(function(req,res){
  Comment.findById(req.params.comment_id, function(err,comment){
    if(err){
      res.send(err)
    }
    (req.body.author) ? comment.author = req.body.author : "left blank";
    (req.body.text) ? comment.text = req.body.text : "left blank";

    comment.save(function(err,newComment){
      if(err){
        res.send(err, "error")
      }
      res.json({message:'comment updated'})
    })
  })
})

.delete(function(req,res){
  Comment.remove({_id:req.params.comment_id}, function(err, comment){
    if(err){
      res.send(err)
    }
    res.json({message: "comment deleted"})
  })
})
//add /comments route to our /api router here

//use router config when we call /API

//start server
app.listen(port, function() {
  console.log(`api running on port ${port}`);
});
