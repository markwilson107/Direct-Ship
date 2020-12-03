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

  // UPDATE route for request
  app.put("/api/updaterequest", function (req, res) {
      db.Request.update({ notes: req.body.note },
        {
          where: {
            id: req.body.id
          }
        })
        .then(function (reqUpdate) {
          res.json(reqUpdate);
        });
  });

  app.post("/api/update_user", function(req, res) {
    // console.log(req.body)
    // db.User.update(req.body).then(function(dbPostRequest) {
    //   res.json(dbPostRequest);
    // });

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
