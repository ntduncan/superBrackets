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
   res.render("/", {
      //<-put the login page route here
      // path: '/login',
      // pageTitle: 'Login',
      // isAuthenticated: false
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
      .then((users) => {
         if (!users) {
            // user not found: login failed. email does not exist in the database
            return res.redirect("/login");
         }
         // compare the typed in password to the hashed password that is stored in the database
         bcrypt
            .compare(password, user.password)
            .then((doMatch) => {
               // do this if the passwords match
               if (doMatch) {
                  req.session.isLoggedIn = true;
                  req.session.user = user;
                  return req.session.save((err) => {
                     console.log(err);
                     return res.redirect("/");
                  });
                  return res.redirect("/");
               }
               res.redirect("/login");
            })
            .catch((err) => {
               console.log(err);
               res.redirect("/login");
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
            return res.redirect("/signup");
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
        // do we want to re-direct?
        //  res.redirect("/login");  
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
      res.redirect("/"); 
   });
};

exports.getReset = (req, res, next) => {};

exports.postReset = (req, res, next) => {};

exports.getNewPassword = (req, res, next) => {};

exports.postNewPassword = (req, res, next) => {};
