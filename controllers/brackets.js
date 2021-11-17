/*******************************************
 * These controller functions are for:
 *    getting a users brackets
 *    viewing a specific bracket (Read)
 *    editing a bracket (Update)
 *    adding a bracket (Create)
 *    deleting a bracket (Delete)
 *******************************************/

const Bracket = require("../models/Bracket");
const User = require("../models/User");

/***
 * get all  brackets
 *    get all the brackets
 ***/
exports.getAll = (req, res, next) => {
   Bracket.find().then((bracket) => {
      let jsonData = bracket;
      res.json(jsonData);
   });
};

/***
 * get all of a user's brackets
 *    get all the brackets that have the
 *    user's id and render them on a page
 ***/
exports.getUserBrackets = (req, res, next) => {
   Bracket.find()
    .then(brackets => {
      console.log(brackets);
      res.json(brackets)
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

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
         res.json(bracket);
      })
      .catch((err) => {
         const error = new Error(err);
         error.httpStatusCode = 500;
         return next(error);
      });
};

exports.editBracket = (req, res, next) => {};

exports.postAddBracket = (req, res, next) => {
   const title = req.body.title;
   const description = req.body.description;

   const bracket = new Bracket({
      title: title,
      creatorId: req.user,
      description: description,
      participants: [], //may want to change this later
   });
   bracket
      .save()
      .then((result) => {
         console.log("Created Bracket");
         res.redirect("/"); //may want to change this later
      })
      .catch((err) => {
         console.log(err); //may want to update this later
      });
};

/***
 * delete a bracket
 *    self explanatory
 ***/
exports.postDeleteBracket = (req, res, next) => {};
