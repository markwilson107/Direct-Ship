// DEPENDENCIES
const express = require("express");
const db = require("./models");
const logSymbols = require("log-symbols");

// EXPRESS SETUP
const app = express();
const PORT = process.env.PORT || 8080;

// APP SETTINGS
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// ROUTES
require("./routes/routes.js")(app);

// INITIAL SETUP
console.log(`\n///////////////////////////////////`)
console.log(`// ${logSymbols.info} Launching TCWA: Direct-Ship //`)
console.log(`///////////////////////////////////\n`)

// CONNECT TO DATABASE AND LAUNCH APP
db.sequelize.sync({ force: true }).then(function() {
  app.listen(PORT, function() {
    console.log(`${logSymbols.success} App listening on PORT ${PORT}\n`);
  });
});
