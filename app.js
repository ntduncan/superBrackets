const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const homeRoutes = require("./routes/home");
const bracketsRoutes = require("./routes/brackets");
const authRoutes = require("./routes/auth");

const app = express();
const csrfProtection = csrf();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public")) //static files
   .set("view engine", "ejs");

app.use(homeRoutes);
app.use(bracketsRoutes);
app.use(authRoutes);

app.listen(PORT, () => {
   console.log("Server connected at:", PORT);
});
