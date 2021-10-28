const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const mainRoutes = require("./routes/mainRoutes");

const app = express();
const csrfProtection = csrf();
const PORT = process.env.PORT || 5000;

app.use(express.static(__dirname + "/public")) //static files
   .set("view engine", "ejs");

app.use(mainRoutes);

app.get("/", (req, res, next) => {
   res.render("index");
});

app.listen(PORT, () => {
   console.log("Server connected at:", PORT);
});
