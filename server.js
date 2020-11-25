// DEPENDENCIES
const express = require("express");
const db = require("./models");

// EXPRESS SETUP
const app = express();
const PORT = process.env.PORT || 8080;

// APP SETTINGS
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// ROUTES
require("./routes/routes.js")(app);

// CONNECT TO DATABASE AND LAUNCH APP
db.sequelize.sync({ force: true }).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});
