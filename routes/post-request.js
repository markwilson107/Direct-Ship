var db = require("../models");

module.exports = function(app) {
  // POST route for saving a new post
  app.post("/api/newrequest", function(req, res) {
    db.Request.create(req.body).then(function(dbPostRequest) {
      console.log(dbPostReques)
      //res.json(dbPostRequest);
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
