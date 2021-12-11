const jwt = require("jsonwebtoken");

function generateAccessToken(user) {
    return jwt.sign(JSON.parse(JSON.stringify(user)), process.env.ACCESS_TOKEN_SECRET, {expiresIn: '5m'});
}

module.exports = {generateAccessToken}

