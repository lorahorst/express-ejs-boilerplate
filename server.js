const express = require("express");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const store = require("connect-mongo");
const dotenv = require("dotenv");
const methodOverride = require("method-override");

// environment variables
dotenv.config();

mongoose.connect(process.env.MONGODB_URL);

const app = express();

// template engine setup
app.set("view engine", "ejs");
// ejs layout setup
app.use(expressLayouts);
// middleware to extract the body from the request
app.use(express.urlencoded({ extended: false }));
// middle ware for using more http verbs in the html
app.use(methodOverride("_method"));
// hooking up the public folder
app.use(express.static("public"));
// required for the app when deployed to Heroku (in production)
app.set("trust proxy", 1);
// middleware for setting up the session
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1200000,
    },
    store: store.create({
      mongoUrl: process.env.MONGODB_URL,
    }),
  })
);
// middleware for making the user available to all templates
app.use((req, res, next) => {
  res.locals.currentUser = req.session.currentUser;
  next();
});

// the root route
app.get("/", (req, res) => {
  res.render("home");
});

// the user route
const userRouter = require("./routes/user.routes");
app.use("/user", userRouter);

// the post route
const postRouter = require("./routes/post.routes");
app.use("/post", postRouter);

// the comment route
const commentRouter = require("./routes/comment.routes");
app.use("/comment", commentRouter);

const categoryRouter = require("./routes/category.routes");
app.use("/category", categoryRouter);

app.listen(process.env.PORT);
