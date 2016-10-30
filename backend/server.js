/* capstone server.js */

// Require packages
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
var expressJwt = require("express-jwt");
var path = require("path");
var mongoose = require("mongoose");
var path = require('path');



// Config environment variables
var config = require("./config");
var port = process.env.PORT || 7000;

// Require routes

// Create Server
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(logger("dev"));

var passport = require('passport');
app.use(passport.initialize());
require('./passport')(passport);
// Connect to Mongoose
var database = path.join(config.db_host,config.db_name);
mongoose.connect("mongodb://" + config.db_user + ":" + config.db_pass + "@" + database, function(err) {
    if (err) console.log("Error connecting to MongoDB: ", err.message);
    else console.log("Connected to MongoDB " + database);
});

// Serve up frontend files
app.use(express.static(path.join(__dirname, "..", "/frontend")));

// Routes requiring authentication
app.use("/api", expressJwt({secret:config.db_secret}));
// app.use("/api/user", require("./routes/userRouteProtected"));
//app.use("/api/admin", require("./routes/adminRoute"));
//app.use("/api/post", require("./routes/postRouteProtected"));
//app.use("/api/subreddit", require("./routes/subredditRouteProtected"));
//app.use("/api/comment", require("./routes/commentRouteProtected"));

// Routes without authentication
// require('./routes/authRoute')(app, passport);
app.use("/auth", require("./routes/authRoute"))
//app.use("/post", require("./routes/postRoute"));
//app.use("/subreddit", require("./routes/subredditRoute"));
//app.use("/comment", require("./routes/commentRoute"));



app.listen(port, function() {console.log("Server is listening on port", port)});


