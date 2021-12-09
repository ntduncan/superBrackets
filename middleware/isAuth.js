const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET = '6611ea13ab94cc3807eadcd37857bdc802f9ce3acd8d2c16867e31e5f6b5d500caaee017ea461fdae265a55ffa57a640662a7c4eb45c0ea4bb8cf27ae1c774a1'; //TODO: Make ENV VAR


module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'] //Parse Headers
    const token = authHeader && authHeader.split(' ')[1]; // Token should be provided under authorization as a string like "Bearer <TOKEN>"
    console.log(token);
    if(token == null){
        return res.sendStatus(401)
    } else {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => { //TODO: Replace ACCESS_TOKEN_SECRET with 'process.env.ACCESS_TOKEN_SECRET'
            if (err){
                console.log(err)
                return res.sendStatus(403); //This check for expired tokens
            } 

            //If token is valid, se the user
            req.user = user
            next();
        })
    }
}

