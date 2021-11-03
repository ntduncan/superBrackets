/*******************************************
 * These routes are for:
 *    getting a list of all brackets (homepage)
 *    post to search all brackets
 *******************************************/

const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home");

router.get("/", homeController.getHome);

router.get("/", homeController.postSearch);

module.exports = router;
