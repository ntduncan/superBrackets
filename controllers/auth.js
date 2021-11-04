/*******************************************
 * These controller functions are for:
 *    logging users in
 *    registering user
 *    resetting passwords
 *******************************************/

//  const crypto = require('crypto');

//  const bcrypt = require('bcryptjs');
//  const nodemailer = require('nodemailer');
//  const sendgridTransport = require('nodemailer-sendgrid-transport');
//  const { validationResult } = require('express-validator/check');
 
 const User = require('../models/User');
 
// for sending an email with sendgrid 
// if using sendgrid, the api key and other information cannot be made public
//  const transporter = nodemailer.createTransport(
//    sendgridTransport({
//      auth: {
//        api_key:
//         '' //<-put api key here
//      }
//    })
//  );

exports.getLogin = (req, res, next) => {};

exports.getSignup = (req, res, next) => {};

exports.postLogin = (req, res, next) => {};

exports.postSignup = (req, res, next) => {};

exports.postLogout = (req, res, next) => {};

exports.getReset = (req, res, next) => {};

exports.postReset = (req, res, next) => {};

exports.getNewPassword = (req, res, next) => {};

exports.postNewPassword = (req, res, next) => {};
