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
var ObjectId = require("mongodb").ObjectId;

/***
 * get all  brackets
 *    get all the brackets
 ***/
exports.getAll = (req, res, next) => {
   // FINISHED
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
   console.log(req.params);
   Bracket.find({ creatorId: ObjectId(req.params.userId) }) // this needs changed to however we choose to identify users
      .then((brackets) => {
         console.log(brackets);
         res.json(brackets);
      })
      .catch((err) => {
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
   console.log(bracketId);
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

exports.editBracket = (req, res, next) => {
   // if(req.session.isLoggedIn){
   const id = req.params.bracketId;

   const data = req.body;
   console.log(data);
   const bracket = {
      title: data.title,
      description: data.description,
      participants: data.participants,
   };

   Bracket.findByIdAndUpdate(id, bracket)
      .then(() => res.sendStatus(200))
      .catch((err) => {
         console.log(err);
         res.send(err.statusCode, err.message);
      });
   // } else {
   //     res.redirect('/products');
   // }
};

exports.advanceParticipant = (req, res, next) => {
   console.log(req.params);
   const bracketId = req.params.bracketId;
   const participantInQuestionId = req.params.participantId;
   Bracket.findById(bracketId)
      .then((data) => {
         return data;
      })
      .then((bracket) => {
         bracket.participants.forEach((participant) => {
            if (participant._id == participantInQuestionId) {
               participant.round++;
               bracket.save();
               res.json({ message: "Participant was advanced." });
            }
         });
         res.json({
            message: "Participant was not found, Please check the Id.",
         });
      });
};

exports.postAddBracket = (req, res, next) => {
   const title = req.body.title;
   const description = req.body.description;
   const participants = req.body.participants;

   let participantsWithRounds = [];
   participants.forEach((person) => {
      let tempPersonObj = {
         name: person,
         round: 1,
      };
      participantsWithRounds.push(tempPersonObj);
   });

   const bracket = new Bracket({
      title: title,
      description: description,
      participants: participantsWithRounds,
   });

   bracket
      .save()
      .then((result) => {
         console.log(result)
         res.json({ message: "Bracket was saved", id: result.id });
      })
      .catch((err) => {
         console.log(err); //may want to update this later
      });
};

/***
 * delete a bracket
 *    self explanatory
 ***/
// this says it is working but it is not
exports.deleteBracket = (req, res, next) => {
   const bracketId = req.params.bracketId;
   console.log(bracketId);
   deleteQuery = { _id: bracketId };
   Bracket.findById(bracketId).then((doc) => {
      if (doc == null) {
         res.json({ message: "Bracket was not found." });
         return;
      } else {
         Bracket.deleteOne(deleteQuery, function (err, obj) {
            if (err) throw err;
         });
         res.json({ message: "Bracket was deleted." });
         return;
      }
   });
};

exports.searchBrackets = (req, res, next) => {
   const field = req.params.field;
   const query = req.params.query;
   let searchQuery = {};
   searchQuery[field] = query;
   console.log(searchQuery);

   Bracket.find({
      $text: {
         $search: query,
         $caseSensitive: false,
      },
   }).then((bracket) => {
      bracket.json();
      res.json(bracket);
   });
};
