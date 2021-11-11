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

exports.editBracket = (req, res, next) => {
   // if(req.session.isLoggedIn){
      const id = req.params.id;
      const data = req.body;
      const bracket = new Bracket({
         title: title,
         creatorId: req.user,
         description: description,
         participants: [] //may want to change this later
      });
      
      Bracket.findByIdAndUpdate(id, bracket)
      .then(() => res.redirect()) //This will just need to return the data we get
      .catch(err => {console.log(err)})
      // } else {
      //     res.redirect('/products');
      // }
};


exports.postAddBracket = (req, res, next) => {
   const title = req.body.title;
   const description = req.body.description;

   const bracket = new Bracket({
      title: title,
      creatorId: req.user,
      description: description,
      participants: [] //may want to change this later
   });
   bracket
   .save()
   .then(result => {
      console.log('Created Bracket');
      res.redirect('/'); //may want to change this later
    })
    .catch(err => {
      console.log(err); //may want to update this later 
    });
};

/***
 * delete a bracket
 *    self explanatory
 ***/
exports.postDeleteBracket = (req, res, next) => {};
