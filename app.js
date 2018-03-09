const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
var session = require("express-session");
var passport = require("passport");
///////////////////////////////
//var flash = require("connect-flash");
const app = express();
const User = require("./server//models").User;
//app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
//require("./server/routes.js")(app, passport);

//app.set("view engine", "ejs"); // set up ejs for templating

// Set up the express app').

// Log requests to the console.
// For Passport
app.use(session({ secret: "ilovescotchscotchyscotchscotch" })); // session secret
app.use(passport.initialize());
app.use(passport.session());
app.use(logger("dev"));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//var index = require("./server/routes/index");

// app.get("*", (req, res) =>
//   res.status(200).send({
//     message: myuser
//   })
// );

const authController = require("./server/controllers").auth;
app.get("/register", authController.create);

const LocalStrategy = require("passport-local").Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id)
    .then(function(user) {
      if (user == null) {
        done(new Error("Wrong user id."));
      }

      done(null, user);
    })
    .catch(error => {
      console.log("error");
    });
});

// passport.serializeUser(function(user, done) {
//   done(null, user.id); // uses _id as idFieldd
// });

// passport.deserializeUser(function(id, done) {
//   console.log("hello deser");

//   User.findById(id, function(user) {
//     done(null, user);
//   }); // callback version checks id validity automatically
// });
passport.use(
  new LocalStrategy(
    {
      usernameField: "user", // 'username' by default
      passwordField: "pass"
    },
    function(username, password, done) {
      User.findOne({ where: { username: username } }).then((user, error) => {
        if (error) {
          console.log("user not found");
          return done(null);
        }
        if (user && user.validPassword(password)) {
          console.log("login success");
          return done(null, user);
        } else {
          console.log("wrong pass");
          return done(null);
        }
      });
    }
  )
);

function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) return next();

  // if they aren't redirect them to the home page
  res.redirect("/");
}

// app.post(
//   "/login",
//   passport.authenticate("local", {
//     failureRedirect: "/error"
//     //successRedirect: "/manage"
//   }),
//   function(req, res) {
//     // res.redirect("/manage",{user:req.user});
//     //res.rend er("../server/views/profile.ejs", { user: req.user });
//     res.status(201).send({ user: req.user, status: "OK" });
//   }
// );
app.get(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/error"
    //successRedirect: "/manage"
  }),
  function(req, res) {
    //json(req.username;
    // res.redirect("/manage",{user:req.user});
    //res.render("../server/views/profile.ejs", { user: req.user });
    res.status(201).send({ status: "OK" });
  }
);
//log out

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});
//manage

// app.post("/manage", isLoggedIn, function(req, res) {
//   console.log(req.user.username);
//   if (req.body.action == "balance") {
//     console.log("BALANCED");
//     User.getBalance(req.user.username, res);
//   } else if (req.body.action == "close") {
//     console.log("DELETED");
//     User.deleteAccount(req.user.username, res);
//   } else if (
//     req.body.action == "withdraw" &&
//     Number.isInteger(req.body.amount) &&
//     req.body.amount >= 0
//   ) {
//     User.withdraw(req.user.username, req.body.amount, res);
//   } else if (
//     req.body.action == "deposit" &&
//     Number.isInteger(req.body.amount) &&
//     req.body.amount >= 0
//   ) {
//     console.log(req.body.amount);
//     User.deposit(req.user.username, req.body.amount, res);
//   } else {
//     res.json("please enter the correct input.");
//     console.log("THIS IS THE END");
//   }
// });
app.get("/manage", isLoggedIn, function(req, res) {
  //console.log(req.user.username);
  console.log(req.query.action);
  console.log(req.query.amount);

  if (req.query.action == "balance") {
    //console.log("BALANCED");

    User.getBalance(req.user.username, res);
  } else if (req.query.action == "close") {
    //console.log("DELETED");
    User.deleteAccount(req.user.username, res);
  } else if (req.query.action == "withdraw" && req.query.amount >= 0) {
    var withdrawAmount = req.query.amount;
    User.withdraw(req.user.username, withdrawAmount, res);
  } else if (req.query.action == "deposit" && req.query.amount >= 0) {
    //console.log(req.body.amount);
    var depositAmount = parseFloat(req.query.amount);
    User.deposit(req.user.username, depositAmount, res);
  } else {
    res.json("please enter the correct input.");
    console.log("THIS IS THE END");
  }
});

module.exports = app;

// app.get("*", (req, res) =>
//   res.status(200).send({
//     message: "Welcome to the beginning of nothingness."
//   })
// );
// app.get("/error", (req, res) =>
//   res.status(403).send({
//     message: "Failed to login"
//   })
// );

// app.get("/success", (req, res) =>
//   res.status(200).send({
//     message: "Login Successful"
//   })
// );

//ENSURE AUTH
// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     // req.user is available for use here
//     console.log("authorized", req.originalUrl);
//     return next();
//   }

//   // denied. redirect to login
//   console.log("not authorized", req.originalUrl);
//   res.redirect("/login");
// }
// app.get("/protected", ensureAuthenticated, function(req, res) {
//   res.send("access granted. secure stuff happens here " + req.user.id);
// });
// app.use(
//   "/candidate",
//   ensureAuthenticated,
//   proxy("http://localhost:8000/candidate")
// );
