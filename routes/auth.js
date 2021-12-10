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

let urlencodedParser = bodyParser.urlencoded({ extended: false });
const router = express.Router();

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

// router.post("/logout", authController.postLogout); //Replaced with a delete route for deleting the refresh token and user session

router.post("/reset", authController.postReset);

router.post("/new-password/:token", authController.postNewPassword);

router.post('/token', authController.postToken);

router.delete('/logout', authController.deleteLogout)


module.exports = router;
