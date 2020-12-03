// DEPENDENCIES
var db = require("../models");

// MODULE EXPORTS
module.exports = function (app) {

  // POST route for saving a new request
  app.post("/api/newrequest", function (req, res) {
    db.Request.create(req.body).then(function (dbPostRequest) {
      console.log(dbPostRequest);
      res.json(dbPostRequest);
    });
  });

  // Update user
  app.post("/api/update_user", function (req, res) {

    db.User.update(
      req.body,
      {
        where: {
          id: req.body.id
        }
      }).then(function (dbPost) {
        res.json(dbPost);
      });
  });

}
