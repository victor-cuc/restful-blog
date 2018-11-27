const express    = require('express'),
      app        = express(),
      bodyParser = require('body-parser'),
      mongoose   = require('mongoose');
  
// App Config
mongoose.connect("mongodb://localhost:27017/restful_blog_app", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded( {extended: true} ));

// Mongoose Model Config
const blogSchema = mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now},
});
const Blog = mongoose.model("Blog", blogSchema);

//RESTful Routes
app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/blogs", (req, res) => {
  Blog.find({}, (err, blogs) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", {blogs: blogs});
    }
  });
});

app.listen(3000, () => {
  console.log("Server is running");
})