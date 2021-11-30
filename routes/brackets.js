/*******************************************
 * These routes are for:
 *    getting a users brackets
 *    viewing/editing a specific bracket
 *    adding a bracket
 *    deleting a bracket
 *******************************************/

// const path = require("path");
const express = require("express");
const router = express.Router();
const bracketsController = require("../controllers/brackets");
const bodyParser = require("body-parser");

let urlencodedParser = bodyParser.urlencoded({ extended: false });

// getting all brackets
router.get("/brackets-list", bracketsController.getAll);
// getting a users brackets
router.post(
  "/my-brackets",
  urlencodedParser,
  bracketsController.getUserBrackets
);

// viewing/editing a specific bracket
router.get("/bracket/:bracketId", bracketsController.getOneBracket);
router.get(
  "/advance-participant/:bracketId/:participantId",
  bracketsController.advanceParticipant
);
router.post("/edit-bracket/:bracketId", bracketsController.editBracket);

// adding a bracket
router.post("/add-bracket", bracketsController.postAddBracket);

// delete a bracket
router.post("/delete", bracketsController.postDeleteBracket);

module.exports = router;
