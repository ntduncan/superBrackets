const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const jwt = require('jsonwebtoken');
const bracketsRoutes = require("./routes/brackets");
const authRoutes = require("./routes/auth");
const dummyRoutes = require("./routes/dummyJSON");
const User = require("./models/User");

// Database Setup
// Connect to MongoDB
const username = process.env.BRACKETS_USERNAME;
const password = process.env.BRACKETS_PASSWORD;
const MONGODB_URI = `mongodb+srv://${username}:${password}@cluster0.vctnn.mongodb.net/cluster0`;
const mongoCon = process.env.mongoCon || MONGODB_URI;

const app = express();
const csrfProtection = csrf();
const PORT = process.env.PORT || 3000;

const store = new MongoDBStore({
   //USED TO STORE SESSION IN MONGODB
   uri: MONGODB_URI,
   collection: 'sessions'
 });

const corsOptions = {
   origin: "http://superbrackets.herokuapp.com/",
   optionsSuccessStatus: 200,
 };
 app
   .use(cors(corsOptions))
   .use(
     session({
       secret: "my secret",
       resave: false,
       saveUninitialized: false,
       store: store,
     })
   )
   // .use(csrfProtection) //Saves csrf token
 
 app.use((req, res, next) => {
   if (!req.session.user) {
     return next();
   }
   User.findById(req.session.user._id)
     .then(user => {
       req.user = user;
       next();
     })
     .catch(err => console.log(err));
 });
 
 app.use((req, res, next) => {
   res.locals.isAuthenticated = req.session.isLoggedIn;
   // res.locals.csrfToken = req.csrfToken();
   next();
 });
 




app.use(express.static(__dirname + "/public")) //static files
   .set("view engine", "ejs");

app.use(function (req, res, next) {
   // Website you wish to allow to connect
   res.setHeader("Access-Control-Allow-Origin", "*");

   // Request methods you wish to allow
   res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
   );

   // Request headers you wish to allow
   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

   // Pass to next layer of middleware
   next();
});

app.use(express.json()); // instead of body parser, body parser is depricated
app.use(express.urlencoded({ extended: true }));

app.use(bracketsRoutes);
app.use(authRoutes);
app.use(dummyRoutes);
app.use((req, res,next)=>{
   res.status(404).json({error: "Page not found"});
});

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
