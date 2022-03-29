//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");


const homeStartingContent = "";
const aboutContent = "Carregador de Marcus e Paulo no video game Liga das Legendas.";
const contactContent = "Só manda um zap. 😉";

const app = express();
const posts = [];
const number = [];
let numb = 0;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req,res)=>{
  res.render("home", {
    homeStartingContent: homeStartingContent,
    posts: posts
  })

});


app.get("/posts/:link", function(req,res){
const linkTitle = _.lowerCase(req.params.link);

  posts.forEach(function(post)  {
    const postTitle = _.lowerCase(post.number);
const postTitle2 = post.newName;
    const postText = post.newText;
    const postNumber = post.number;
    if (linkTitle === postTitle) {

      res.render("link", {postTitle2: postTitle2, postText:postText, postNumber: postNumber});
  }
  });


});



app.get("/about", (req,res)=>{
  res.render("about", {aboutContent: aboutContent})
});

app.get("/contact", (req,res)=>{
  res.render ("contact", {contactContent:contactContent})
});
app.get("/compose", (req,res)=>{
  res.render("compose", )
});
app.post("/compose",(req,res)=>{

const post = {
newName: req.body.newName,
newText: req.body.newText,
number: posts.length
 };


posts.push(post);

  res.redirect("/")
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
 console.log("Server has started");
});
