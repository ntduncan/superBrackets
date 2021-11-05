/*******************************************
 * These controller functions are for:
 *    getting some sample JSON
 *******************************************/
 const fs = require('fs');
//  const jsonFile = require('data/sample.json');
/***
 * reads some sample json data
 * then parses it and sends it
 ***/
 exports.getJSON = (req, res, next) => {
    let rawjsonData = fs.readFileSync('./data/sample.json');
    let jsonData = JSON.parse(rawjsonData);
    console.log(jsonData); //can get rid of this
    res.json(jsonData);
 };