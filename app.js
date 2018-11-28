const express = require("express"),
  expressSanitizer = require("express-sanitizer"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  methodOverride = require("method-override");

// App Config
mongoose.connect(
  "mongodb://localhost:27017/restful_blog_app",
  { useNewUrlParser: true }
);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"))
app.use(expressSanitizer());

// Mongoose Model Config
const blogSchema = mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now }
});
const Blog = mongoose.model("Blog", blogSchema);

//RESTful Routes
app.get("/", (req, res) => {
  res.redirect("/blogs");
});

// INDEX route
app.get("/blogs", (req, res) => {
  Blog.find({}, (err, blogs) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { blogs: blogs });
    }
  });
});

// NEW route
app.get("/blogs/new", (req, res) => {
  res.render("new");
});

// CREATE route
app.post("/blogs", (req, res) => {
  // create blog
  console.log(req.body);
  req.body.blog.body = req.sanitize(req.body.blog.body);
  console.log("===========================");
  console.log(req.body);
  Blog.create(req.body.blog, (err, newBlog) => {
    if (err) {
      res.render("/blogs/new");
    } else {
      // redirect to index
      res.redirect("/blogs");
    }
  });
});

// SHOW route
app.get("/blogs/:id", (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("show", {blog: foundBlog});
    }
  });
});

// EDIT route
app.get("/blogs/:id/edit", (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.render("edit", {blog: foundBlog});
    }
  });
});

//UPDATE route
app.put("/blogs/:id", (req, res) => {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

//DELETE ROUTE
app.delete("/blogs/:id", (req,res) => {
  Blog.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  });
});

app.listen(3000, () => {
  console.log("Server is running");
});
