/*******************************************
 * These controller functions are for:
 *    logging users in
 *    registering user
 *    resetting passwords
 *******************************************/

const crypto = require('crypto'); //for generating password reset tokens
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); //for hashing passwords
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator/check');
// const { validationResult} = require('express-validator')

const ACCESS_TOKEN_SECRET = '6611ea13ab94cc3807eadcd37857bdc802f9ce3acd8d2c16867e31e5f6b5d500caaee017ea461fdae265a55ffa57a640662a7c4eb45c0ea4bb8cf27ae1c774a1'; //TODO: Make ENV VAR
const REFRESH_TOKEN = '1ed7f2989a06f9a5fea38c8a752f24447f347a315c6df63b7a3ba2a9719a9baffef307976306bf287e833ce38d47b1d0cdaf1198df94dae46334389fe72de011'; //TODO: Make ENV VAR
let refreshTokens = [];

const User = require("../models/User");
const {generateAccessToken} = require("./tokens");
const router = require('../routes/auth');
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
            console.log()
            //Create JWT if they have valid credentials
            const accessToken = generateAccessToken(user);
            const refreshToken = jwt.sign(JSON.parse(JSON.stringify(user)), process.env.REFRESH_TOKEN)
            refreshTokens.push(refreshToken);
            req.user = user; 

            //Send Access Token back to user
            res.json({ accessToken: accessToken, refreshToken: refreshToken }) //Send access token to the user
          }
          // res.json("Incorrect Password");
        })
        .catch((err) => {
          console.log(err);
        });
    });
};


/***
 * creates a new user and stores
 * them in the database
 ***/
exports.postSignup = (req, res, next) => {

  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  // Make sure the password is the same as the confirm password!!!
  if(password !== confirmPassword) return res.json({message: "Passwords did not match"}).statusCode(401);

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
 * Logs the user out by deleting the refresh token
 ***/
exports.deleteLogout = (req, res, next) => {
  // Filter the token out of refreshTokens array
  const refreshToken = req.body.token;
  refreshTokens = refreshTokens.filter(token => {
    token != refreshToken
  })

  // Double Check to make sure it is gone
  if(!refreshTokens.includes(refreshToken)){
    res.json({message: "Logout Successful"});
  } else {
    res.json({message: "There was an issue logging out"});
  }
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
     }); // TODO make the link the heroku link instead of local host?!
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


exports.postToken = (req, res) => {
  const refreshToken = req.body.token; //Get the provided refresh token
  refreshTokens.push(refreshToken); 
  
  if (refreshToken == null) return res.sendStatus(401); //If the refresh token is null they don't have a token (Unauthorized)
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403); //If they refresh token is not stored on the server it is expired (Forbidden)

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => { // Verify the provided token
    if(err) return res.sendStatus(403); //If there is an error the user was not valid
    const accessToken = generateAccessToken({id: user.id}) //If they've got this far they're a valid user
    res.json({accessToken: accessToken}); // Send them their new access token
  })
}
