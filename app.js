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
const dummyRoutes = require("./routes/dummyJSON");

// Database Setup
//Connect to MongoDB
const username = process.env.BRACKETS_USERNAME;
const password = process.env.BRACKETS_PASSWORD;
const MONGODB_URI = `mongodb+srv://${username}:${password}@cluster0.vctnn.mongodb.net/cluster0`;
const mongoCon = process.env.mongoCon || MONGODB_URI;


const app = express();
const csrfProtection = csrf();
const PORT = process.env.PORT || 3000;

// const store = new MongoDBStore({
//    //USED TO STORE SESSION IN MONGODB
//    uri: MONGODB_URI,
//    collection: 'sessions'
//  });
 

app.use(express.static(__dirname + "/public")) //static files
   .set("view engine", "ejs");

app.use(homeRoutes);
app.use(bracketsRoutes);
app.use(authRoutes);
app.use(dummyRoutes);
// Connections
mongoose
  .connect(mongoCon, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(PORT, () => {
   console.log("Server connected at:", PORT);
});
