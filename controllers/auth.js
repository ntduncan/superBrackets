/*******************************************
 * These controller functions are for:
 *    logging users in
 *    registering user
 *    resetting passwords
 *******************************************/

//  const crypto = require('crypto');

const bcrypt = require("bcrypt"); //for hashing passwords
//  const nodemailer = require('nodemailer');
//  const sendgridTransport = require('nodemailer-sendgrid-transport');
//  const { validationResult } = require('express-validator/check');

const User = require("../models/User");

// for sending an email with sendgrid
// if using sendgrid, the api key and other information cannot be made public
//  const transporter = nodemailer.createTransport(
//    sendgridTransport({
//      auth: {
//        api_key:
//         '' //<-put api key here
//      }
//    })
//  );

/***
 * gets the login page
 ***/
exports.getLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
      },
      validationErrors: errors.array(),
    });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        res.status(422).render("auth/login", {
          path: "/login",
          pageTitle: "Login",
          errorMessage: "Invalid email or password.",
          oldInput: {
            email: email,
            password: password,
          },
          validationErrors: [],
        });
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          res.status(422).render("auth/login", {
            path: "/login",
            pageTitle: "Login",
            errorMessage: "Invalid email or password.",
            oldInput: {
              email: email,
              password: password,
            },
            validationErrors: [],
          });
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

/***
 * logins in the user
 * if the information is correct
 ***/
exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email }) //check for the user's email
    .then((user) => {
      if (!user) {
        // user not found: login failed. email does not exist in the database
        res.json({ message: "Email Not Found" });
      }
      // compare the typed in password to the hashed password that is stored in the database
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          // do this if the passwords match
          if (doMatch) {
            // req.session.isLoggedIn = true;
            // req.session.user = user;
            // req.session.save((err) => {
            //   console.log(err);
            //   res.json("Login Successful!");
            // });
            res.json("Login Successful!");
          }
          res.json("Incorrect Password");
        })
        .catch((err) => {
          console.log(err);
        });
    });
};

/***
 * gets the signup page
 ***/
exports.getSignup = (req, res, next) => {
  res.render("/", {
    //<-put the signup route here
    // path: '/signup',
    // pageTitle: 'Signup',
    // isAuthenticated: false
  });
};

/***
 * creates a new user and stores
 * them in the database
 ***/
exports.postSignup = (req, res, next) => {
  //  TODO: make sure the password is the same as the confirm password!!!
  // store a new user in the database
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  // want to check if the user email already exists in the database
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        //   email already exists
        console.log("Signup Failed");
        return res.json({ message: "Signup Failed" });
      }
      return bcrypt
        .hash(password, 12) //hash the password
        .then((hashedPassword) => {
          const user = new User({
            email: email,
            password: hashedPassword,
            usersBrackets: { bracket: [] },
          });
          return user.save();
        });
    })
    .then((result) => {
      res.json({ message: "User Created Successfully" });
      console.log("User Created Successfully");
    })
    .catch((err) => {
      console.log(err);
    });
};

/***
 * logs the user out
 ***/
exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    // res.redirect("/");
    res.json({ message: "Logout Successful" });
  });
};

exports.getReset = (req, res, next) => {};

exports.postReset = (req, res, next) => {};

exports.getNewPassword = (req, res, next) => {};

exports.postNewPassword = (req, res, next) => {};
