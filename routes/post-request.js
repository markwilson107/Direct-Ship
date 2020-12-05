// DEPENDENCIES
var db = require("../models");


// MODULE EXPORTS
module.exports = function (app) {

  // POST route for saving a new request
  app.post("/api/newrequest", function (req, res) {
    db.Request.create({
      ...req.body,
      UserId: req.user.id
    }).then(function (dbPostRequest) {
      console.log(dbPostRequest);

      res.json(dbPostRequest);
    });
  });

  // UPDATE route for request
  app.put("/api/update_request/:id", function (req, res) {
    db.Request.update(req.body,
      {
        where: {
          id: req.params.id
        }
      })
      .then(function (reqUpdate) {
        res.json(reqUpdate);
      });
  });

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
