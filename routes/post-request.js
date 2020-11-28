var db = require("../models");

module.exports = function(app) {
  // POST route for saving a new post
  app.post("/api/posts", function(req, res) {
    db.Request.create(req.body).then(function(dbPostRequest) {
      res.json(dbPostRequest);
    });
  });

}
