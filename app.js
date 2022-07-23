// Module acquiring
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

//Connecting mongoose

mongoose.connect("mongodb://localhost:27017/Wikidb");

// DB SCHEMA
const articleSchema = {
  title: String,
  content: String
};
//

const Article = mongoose.model("Article", articleSchema);

// Routing the functions which works on the whole DB

app.route("/articles")

// Get Method

.get(function(req, res){
  Article.find(function(err, foundArt){
    if(!err){
      res.send(foundArt);
    }
    else{
      res.send(err);
    }
  });
})

// Post Method

.post(function(req, res){

  const newArt = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArt.save(function(err){
    if(!err){
      res.send("Successfully added to the DB");
    }
    else{
      res.send(err);
    }
  });
})

// Delete Method

.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("Successfully deleted all contents");
    }
    else{
      res.send(err);
    }
  });
});


// Route to all Methods that work on a single target

app.route("/articles/:articleTitle")

// Get method

.get(function(req,res){

  Article.findOne({title: req.params.articleTitle}, function(err, foundarts){
    if(foundarts){
      res.send(foundarts);
    }
    else{
      res.send("No article matching the title found");
    }
  });
})

// Put Mehtod

.put(function(req,res){
  Article.updateOne(
    {title : req.params.articleTitle},
    {title : req.body.title, content: req.body.content},
    function(err){
      if(!err){
        res.send("Successfully added the new article");
      }
      else {
        res.send(err);
    }
  });
})

// Patch Method

.patch(function(req,res){
  Article.updateOne({
    title: req.params.articleTitle
  },
  {$set: req.body},
  {overwrite: true},
  function(err){
    if(err){
      res.send(err);
    }
    else{
      res.send("Successfully updated");
    }
  });
})

//Delete Method

.delete(function(req,res){
  Article.deleteOne(
    {title : req.params.articleTitle},
    function(err){
      if(!err){
        res.send("Successfully deleted the choosen article");
      }
      else{
        res.send(err);
      }
    }
  );
});

//TODO

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
