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
const jwt = require("jsonwebtoken");
const isAuth = require("../middleware/isAuth.js");

let urlencodedParser = bodyParser.urlencoded({ extended: false });

// getting all brackets
router.get("/brackets-list", bracketsController.getAll);
// getting a users brackets
router.post(
   "/my-brackets/:userId",
   urlencodedParser,
   bracketsController.getUserBrackets
);

// viewing/editing a specific bracket
router.get("/bracket/:bracketId", bracketsController.getOneBracket);

router.get("/advance-participant/:bracketId/:participantId", isAuth, bracketsController.advanceParticipant);

router.post("/edit-bracket/:bracketId", bracketsController.editBracket);

// adding a bracket
router.post(
   "/add-bracket/:title/:description/:participants",
   bracketsController.postAddBracket
);

// delete a bracket
router.get("/delete/:bracketId", bracketsController.deleteBracket);

// search bracket
router.get("/search/:field/:query", bracketsController.searchBrackets);

module.exports = router;
