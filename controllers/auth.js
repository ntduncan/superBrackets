/*******************************************
 * These controller functions are for:
 *    logging users in
 *    registering user
 *    resetting passwords
 *******************************************/

const crypto = require('crypto'); //for generating password reset tokens

const bcrypt = require("bcrypt"); //for hashing passwords
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator/check');

const User = require("../models/User");
// environment variable for the api key for sendgrid 
const sendgrid_key = process.env.SENDGRID_KEY;

// for sending an email with sendgrid
// if using sendgrid, the api key and other information cannot be made public
 const transporter = nodemailer.createTransport(
   sendgridTransport({
     auth: {
       api_key: sendgrid_key 
     }
   })
 );

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

/***
 * Sends the user an email with a token so they can reset their password
 ***/
exports.postReset = (req, res, next) => {
   // generate a random bytes for reseting passwords!!!
  crypto.randomBytes(32, (err, buffer) => {
   if(err) {
     console.log(err);
   //   return res.redirect('/reset');
     return res.json("Error");
   }
   // generate a token from the buffer 
   // convert the buffer to a hex number
   const token = buffer.toString('hex');

   // find the user then store the token in the user object
   // use mongoose's findOne method to find the user
   User.findOne({email: req.body.email})
   .then(user => {
     // if the user does not exist, send an error
     if (!user){
      //  req.flash('error', 'No account with that email found.');
      //  return res.redirect('reset');
      console.log("No account with that email found.");
      return res.json({ message: "No account with that email found." });
     }
     // if the user exists, give them a reset password token and an expiration time for that token
     user.resetToken = token;
     // this makes it expire 1 hour from the current time (it's in miliseconds)
     user.resetTokenExpiration = Date.now() + 3600000;
     return user.save(); //save the token info into the user
   })
   .then(result => {
      // TODO
     // send the token reset email.
     // !!!!!will need to change the link when doing it on heroku!!!!!!!!
     // make it send the token so they can copy it or with a heroku link!!!
    //  res.redirect('/');
    res.json("Email sent");
     transporter.sendMail({
       to: req.body.email,
       from: 'Super Brackets Support <cheddagang32@gmail.com>', 
       subject: 'Super Brackets Password Reset',
       html: `
       <p>You requested a password reset</p>
       <p>Click this <a href="http://localhost:3000/reset/${token}"link</a> to set a new password.</p>
       <P>Your token is: ${token}</P>
       `
     });
   })
   .catch(err => {
     console.log(err);
   });

 });
};

exports.getNewPassword = (req, res, next) => {
      // // make sure that a token exists for the url
      // const token = req.params.token;
      // // see if a token exists for a user and if it is not expired.
      // // $gt means greater than (so if the time is greater than now (in the future))
      // User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
      // .then(user =>{
      //   let message = req.flash('error');
      //   if (message.length > 0) {
      //     message = message[0];
      //   } else {
      //     message = null;
      //   }
      // })
      //   .catch(err => {
      //     console.log(err);
      //   });
};

/***
 * Lets the user create a new password, if they have a token
 ***/
// FIXME
exports.postNewPassword = (req, res, next) => {

  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken =  req.params.token;
  let resetUser;

  // find a user that has the same token as the passwordtoken, hasn't expired, and the userId's are the same
  User.findOne({
    resetToken: passwordToken,
     resetTokenExpiration: {$gt: Date.now()},
     _id: userId
    })  
    .then(user =>{
      resetUser = user;
      // need to hash the new password!!!
     return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      // reset the tokens and the expiration dates to undefined (so they don't exist any more)
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      // save the info into the database
      return resetUser.save();
    })
    .then(result => {
      // redirect to login page, once they are finished
      res.json("Password changed, sucessfully!");
    })
    .catch(err => {
      console.log(err);
    });

};


