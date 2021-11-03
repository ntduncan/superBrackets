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

// getting a users brackets
router.get("/bracket", bracketsController.getUserBrackets);

// viewing/editing a specific bracket
router.get("/bracket/:bracketId", bracketsController.getOneBracket);
router.post("/edit-bracket/", bracketsController.editBracket);

// adding a bracket
router.get("/add-bracket", bracketsController.getAddBracket);
router.post("/add-bracket", bracketsController.postAddBracket);

// delete a bracket
router.post("/delete", bracketsController.postDeleteBracket);

module.exports = router;
