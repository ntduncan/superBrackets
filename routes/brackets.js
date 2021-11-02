// const path = require("path");
const express = require("express");
const router = express.Router();
const bracketsController = require("../controllers/brackets");

router.get("/bracket/:bracketId", bracketsController.getBracket);

router.get("/post-bracket", bracketsController.postBracket);

module.exports = router;
