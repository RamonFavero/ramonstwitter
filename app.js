//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");


const homeStartingContent = "";
const aboutContent =
  "algo criativo ?";
const contactContent = "Só mandar um zap. 😉";

const app = express();
const posts = [];
const number = [];
let numb = 0;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://ramonfave:test123@cluster0.pypjk.mongodb.net/myFirstDatabase');

const userSchema = {
  title: String,
  corpo: String
};

const User = mongoose.model("user", userSchema);



const defaultUser = [item1, item2];


app.get("/", (req, res) => {

  User.find({}, function(err, userItems) {

    if (userItems.length === 0) {
      User.insertMany(defaultUser, function(err) {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/")
        }

      });

    } else {
      res.render("home", {
        homeStartingContent: homeStartingContent,
        posts: userItems
      });
    };

  });
});


app.get("/posts/:link", function(req, res) {
  const linkTitle = req.params.link;
  User.find({}, function(err, users) {
    User.findOne({_id:linkTitle},function(err,record) {

      if (!err) {

        res.render("link", {
          post: record
        });
      }


    });
  });
  // console.log();
  // posts.forEach(function(post) {
  //   const postTitle = _.lowerCase(post.number);
  //   const postTitle2 = post.newName;
  //   const postText = post.newText;
  //   const postNumber = post.number;
  //   if (linkTitle === postTitle) {
  //
  //
  //   }
  // });


});



app.get("/about", (req, res) => {
  res.render("about", {
    aboutContent: aboutContent
  })
});

app.get("/contact", (req, res) => {
  res.render("contact", {
    contactContent: contactContent
  })
});
app.get("/compose", (req, res) => {
  res.render("compose", )
});
app.post("/compose", (req, res) => {
  const titleName = req.body.newName;
  const corpoName = req.body.newText;
  const newPost = new User({
    title: titleName,
    corpo: corpoName
  });
  User.find({}, function(err, foundList) {
    if (!err) {
      User.insertMany(newPost, function(err) {
        if (!err) {
          // console.log(newPost);
          // defaultUser.push(newPost);
          newPost.save();
          res.redirect("/")
        }
      })

    };
    // const post = {
    // newName: req.body.newName,
    // newText: req.body.newText,
    // number: posts.length
    //  };
    //posts.push(post);
  });
});
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("Server has started");
});
