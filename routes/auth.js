/*******************************************
 * These routes are for:
 *    logging users in
 *    registering user
 *    resetting passwords
 *******************************************/
const express = require("express");
const { check, body } = require("express-validator");

const authController = require("../controllers/auth");
const User = require("../models/User");
const bodyParser = require("body-parser");
const isAuth = require("../middleware/isAuth")

let urlencodedParser = bodyParser.urlencoded({ extended: false });
const router = express.Router();

// router.get("/login", authController.getLogin);

// router.get("/signup", authController.getSignup);

router.post(
   "/login",
   [
      body("email")
         .isEmail()
         .withMessage("Please enter a valid email address.")
         .normalizeEmail(),
      body("password", "Password has to be valid.")
         .isLength({ min: 5 })
         .isAlphanumeric()
         .trim(),
   ],
   authController.postLogin
);

router.post(
   "/signup",
   urlencodedParser,
   [
      check("email")
         .isEmail()
         .withMessage("Please enter a valid email.")
         .custom((value, { req }) => {
            return User.findOne({ email: value }).then((userDoc) => {
               if (userDoc) {
                  return Promise.reject(
                     "E-Mail exists already, please pick a different one."
                  );
               }
            });
         })
         .normalizeEmail(),
      body(
         "password",
         "Please enter a password with only numbers and text and at least 5 characters."
      )
         .isLength({ min: 5 })
         .isAlphanumeric()
         .trim(),
      body("confirmPassword")
         .trim()
         .custom((value, { req }) => {
            if (value !== req.body.password) {
               throw new Error("Passwords have to match!");
            }
            return true;
         }),
   ],
   authController.postSignup
);

router.post("/logout", authController.postLogout);

// router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password/:token", authController.postNewPassword);

module.exports = router;
