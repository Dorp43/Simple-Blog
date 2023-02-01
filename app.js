//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const date = require(__dirname + "/date");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/blogDB");

const postsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please check your data entry, no title specified!"]
  },
  content: {
    type: String,
    required: [true, "Please check your data entry, no content specified!"]
  },
    creationDate: String
});

const Post = mongoose.model("Posts", postsSchema);

const welcomePost = new Post ({
  title: "Welcome to your blog!",
  content: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.",
  creationDate: date.getDate()
});

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const posts = [welcomePost];

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



app.get("/", function(req,res){
  Post.find({}, function(err, foundPosts){

    res.render("home", 
    {content: homeStartingContent, postsList: foundPosts
    });
    
  });

});

app.get("/about", function(req,res){
    res.render("about",
    {content: aboutContent
    });
});

app.get("/contact", function(req,res){
  res.render("contact",
  {content: contactContent
  });
});

app.get("/compose", function(req,res){
  res.render("compose");
});

app.post("/compose", function(req,res){

  const postTitle = req.body.postTitle;
  const postContent = req.body.postContent;

  const post = new Post({
    title: postTitle,
    content: postContent,
    creationDate: date.getDate()
  });

  post.save();
  res.redirect("/");
});

app.get("/posts/:postid", function(req,res){
  const postId = req.params.postid;

  Post.findById(postId, function(err, foundPost){
    res.render("post",{post: foundPost});
  });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
