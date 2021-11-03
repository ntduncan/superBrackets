/*******************************************
 * These controller functions are for:
 *    getting a list of all brackets (homepage)
 *    post to search all brackets
 *******************************************/

const Bracket = require("../models/bracket");
const User = require("../models/User");

// get all brackets
exports.getHome = (req, res, next) => {
   res.render("index", {
      path: "/",
      pageTitle: "Home",
   });
};

// search brackets
exports.postSearch = (req, res, next) => {};
