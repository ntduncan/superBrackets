/*******************************************
 * These controller functions are for:
 *    getting a users brackets
 *    viewing a specific bracket
 *    editing a bracket
 *    adding a bracket
 *    deleting a bracket
 *******************************************/

const Bracket = require("../models/bracket");
const User = require("../models/User");

/***
 * get all of a user's brackets
 *    get all the brackets that have the
 *    user's id and render them on a page
 ***/
exports.getUserBrackets = (req, res, next) => {};

/***
 * get/edit a specific bracket
 *    get a specific bracket to view,
 *    the user can then edit the bracket if auth
 *    and modify it so participants lose/win rounds
 ***/
exports.getOneBracket = (req, res, next) => {
   const bracketId = req.params.bracketId;
   Bracket.findById(bracketId)
      .then((bracket) => {
         res.render(/*something*/);
      })
      .catch((err) => {
         const error = new Error(err);
         error.httpStatusCode = 500;
         return next(error);
      });
};

exports.editBracket = (req, res, next) => {};

/***
 * add a new bracket
 *    this will first get a page that has a form
 *    to make new brackets, then the new bracket
 *    will be saved.
 ***/
exports.getAddBracket = (req, res, next) => {};

exports.postAddBracket = (req, res, next) => {};

/***
 * delete a bracket
 *    self explanatory
 ***/
exports.postDeleteBracket = (req, res, next) => {};
