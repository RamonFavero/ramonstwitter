//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");
const passport = require("passport");
const session = require("express-session");
const passportLocalMongoose = require("passport-local-mongoose");
const env = require('dotenv').config();

const message = "Login ou senha incorreto"
let message2 = true
const nomeExistente = "Esse nome já existe";
let nomeExistente2 = false;
const naoCondiz = "As senhas não condizem";
let naoCondiz2 = false;
const aboutContent = "algo criativo?";
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
app.use(session({
  secret:"segredo para codificar a senha.",
  proxy:true,
  resave:true,
  saveUninitialized:true
}));
app.use(passport.initialize());
app.use(passport.session());

const user = process.env.DB_USER;
const pass = process.env.DB_PASS;
const db = 'mongodb+srv://ramonfave:OCNGkRBOn6UWb5mk@cluster0.todmw9f.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(db);

const userSchema = new mongoose.Schema( {
  user: String,
  image:String,
  title: String,
  corpo: String
});
const loginSchema = new mongoose.Schema ({
  username: String,
  date: String,
  state:String,
  image:String,
  password: String
});
loginSchema.plugin(passportLocalMongoose);

const User = mongoose.model("user", userSchema);

const Login = mongoose.model("login", loginSchema);

passport.use(Login.createStrategy());

passport.serializeUser(Login.serializeUser());
passport.deserializeUser(Login.deserializeUser());

const item1 = new User({
  image:9,
  title: "This is a cheap coppy of twitter",
  corpo: "in 'compose' you can make a post that is saved in a mongoDB server. "
});


const defaultUser = [item1];






app.get("/", (req,res)=>{
  res.redirect("/posts")
});

app.get("/posts", (req,res)=>{
  User.find({}, function (err,userItems) {
  })
  res.redirect("/posts/home");
});

app.get("/posts/login", (req, res) => {
res.render("login");
});
app.get("/posts/loginerror", (req, res) => {
res.render("loginerror",{
  message:message,
  message2:message2
});
});

app.get("/posts/home", (req, res) => {
  if (req.isAuthenticated()) {
    const logeduser = req.user;
    const data = req.user.date.split('-').reverse().join('/');

  User.find({}, function(err, userItems) {
    if (userItems.length === 0) {
      User.insertMany(defaultUser, function(err) {
        if (err) {
          console.log(err);
        } else {
          res.render("home", {
            posts: userItems,
            logeduser:logeduser
          })
        }
      });
    } else {
      res.render("home", {
        posts: userItems,
        logeduser:logeduser,
        data:data
      });
    };
  });
    }else {
      res.redirect("/posts/login")
     }
});



app.get("/posts/register", (req, res) => {
  res.render("register",{
    naoCondiz:naoCondiz,
    naoCondiz2:naoCondiz2,
    nomeExistente:nomeExistente,
    nomeExistente2:nomeExistente2
  });
});
app.post("/posts/login", (req, res,next) => {

  const login = new Login ({
    username:req.body.username,
    password:req.body.password
  });
req.login(login, function(err) {
  if (err) {
    console.log(err);
  }else {
    passport.authenticate("local",{failureRedirect:"loginerror"})(req,res,function() {
  res.redirect("/posts/home");
    })
  }
})
});

app.post("/posts/register", (req, res) => {
  Login.findOne({username:req.body.username}, function(err, nameMirror){
    if (err) {
      console.log(err);
    }else if (nameMirror===null) {
  if (req.body.password===req.body.password2) {
    Login.register({username:req.body.username,date:req.body.date,state:req.body.state,image:req.body.image}, req.body.password, function(err, user) {
      if (err) {
        console.log(err);
        res.redirect("/posts/register");
      } else {

        passport.authenticate("local")(req, res, function() {
          res.redirect("/posts/home");
        })
      }
    })
  }else {
    let naoCondiz2 = true;
  res.render("register", {
  naoCondiz:naoCondiz,
  naoCondiz2:naoCondiz2,
  nomeExistente:nomeExistente,
  nomeExistente2:nomeExistente2
  });
  }
}else {
  let nomeExistente2 = true;
  res.render("register", {
    naoCondiz:naoCondiz,
    naoCondiz2:naoCondiz2,
  nomeExistente:nomeExistente,
  nomeExistente2:nomeExistente2
  });
}
  });
});

app.get("/posts/about", (req, res) => {
  res.render("about", {
    aboutContent: aboutContent
  })
});

app.get("/posts/contact", (req, res) => {
  res.render("contact", {
    contactContent: contactContent
  })
});
app.get("/posts/compose",(req,res)=>{
  if (req.isAuthenticated()) {
    const logeduser = req.user;
  res.render('compose',{
logeduser:logeduser
  })
}
});

app.post("/posts", (req, res) => {
  const userPost = req.body.userpost;
  const imagePost = req.body.imagepost;
  const titleName = req.body.newName;
  const corpoName = req.body.newText;
  const newPost = new User({
    user: userPost,
    image:imagePost,
    title: titleName,
    corpo: corpoName
  });
newPost.save();
res.redirect("/posts/home");
});

app.get("/posts/delete",(req,res) => {
  res.render('delete')
});

app.post("/posts/delete",(req,res) => {
    User.find({}, function(err) {
  User.deleteMany({}, function () {
});})
res.redirect("/posts/home");
});

app.post("/posts/home",(req,res)=> {
const toDelete = req.body.butt
      User.find({}, function(err) {
    User.deleteOne({_id:toDelete}, function () {
  });})


    res.redirect("/posts/home");
});

app.get("/posts/:link",(req, res) => {
  const linkTitle = req.params.link;
  User.find({}, function(err, users) {
    User.findOne({_id:linkTitle},function(err,record) {
      if (!err) {
        res.render("link", {
          post: record
        });
      }else {
        console.log(err);
      }
    });
  });
});


app.post("/posts/:link",function(req,res) {
const linkTitle = req.params.link;
User.updateOne(
  {title: linkTitle},
  {title: req.body.title, corpo: req.body.corpo},
  {overwrite:true},
  function(err){
    if (!err) {
      res.redirect("/posts/home");
    }
  }
)
});








let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, () => console.log(` app listening on port ${port}!`));