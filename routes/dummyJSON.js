/*******************************************
 * These routes are for:
 *    sendiong some sample json data to 
 *    the front end team for them to do tests with
 *******************************************/


const path = require("path");
const express = require("express");
const router = express.Router();

const dummyController = require("../controllers/dummyJSON");

router.get("/dummyJSON", dummyController.getJSON);

module.exports = router;