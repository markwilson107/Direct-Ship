var db = require("../models");

module.exports = function (app) {
  // POST route for saving a new post
  app.post("/api/newrequest", function (req, res) {
    db.Request.create(req.body).then(function (dbPostRequest) {
      console.log(dbPostRequest)
      //res.json(dbPostRequest);
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
}
