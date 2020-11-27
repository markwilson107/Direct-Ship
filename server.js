// DEPENDENCIES
const express = require("express");
const passport = require('passport')
const session = require('express-session')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')

const db = require("./models");
const logSymbols = require("log-symbols");

// EXPRESS SETUP
const app = express();
const PORT = process.env.PORT || 8080;

// APP SETTINGS
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// ROUTES
require("./routes/routes.js")(app);
const authRoute = require('./routes/auth.js')(app);

// INITIAL SETUP
console.log(`\n///////////////////////////////////`)
console.log(`// ${logSymbols.info} Launching TCWA: Direct-Ship //`)
console.log(`///////////////////////////////////\n`)

// CONNECT TO DATABASE AND LAUNCH APP
db.sequelize.sync({ force: true }).then(function () {
  app.listen(PORT, function () {
    console.log(`${logSymbols.success} App listening on PORT ${PORT}\n`);
  });
}).catch(function (error) {
  console.log(error);
});
