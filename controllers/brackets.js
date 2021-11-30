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
  Bracket.find({ userId: req.body.userId }) // this needs changed to however we choose to identify users
    .then((brackets) => {
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
  const bracketId = req.params.bracketId;
  const participantInQuestionId = req.params.pariticipantId;
  Bracket.findById(bracketId).then((data) => {
    return data;
  })
   .then((bracket) => {
     bracket.participants.forEach((participant) => {
       if (participant._id === participantInQuestionId) {
         participant.rounds++;
       }
       res.sendStatus(200);
     });
   });
};

exports.postAddBracket = (req, res, next) => {
  const title = req.headers.title;
  const description = req.headers.description;
  const participants = req.headers.participants.split("%"); // should be sent as a list of names separated by commas

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
      console.log("CREATED BRACKET");
      res.json({ message: "Bracket was saved" });
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
exports.postDeleteBracket = (req, res, next) => {
  const bracketId = req.headers.bracketid;
  console.log(bracketId);
  deleteQuery = { _id: bracketId };
  Bracket.findById(bracketId).then((doc) => {
    if (doc == null) {
      res.json({ message: "Bracket id was invalid" });
    }
  });
  Bracket.deleteOne(deleteQuery, function (err, obj) {
    if (err) throw err;
  });
  Bracket.findById(bracketId).then((doc) => {
    if (doc == null) {
      res.json({ message: "Bracket was deleted" });
    } else {
      res.json({ message: "Bracket was not deleted" });
    }
  });
};
