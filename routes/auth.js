/*******************************************
 * These routes are for:
 *    logging users in
 *    registering user
 *    resetting passwords
 *******************************************/

const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

module.exports = router;
