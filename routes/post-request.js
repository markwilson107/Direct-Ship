// DEPENDENCIES
var db = require("../models");
const sendMail = require('../controllers/email');

// MODULE EXPORTS
module.exports = function (app) {

  // POST route for saving a new request
  app.post("/api/newrequest", function (req, res) {
    db.Request.create(req.body).then(function (dbPostRequest) {
      // console.log(dbPostRequest.dataValues);
      // const emailAddress = "wayne.c@tcwa.com.au";
      const emailAddress = "warehouse@tcwa.au"; // fake email address
      const emailSubject = "Direct Ship";
      const emailText = `<!DOCTYPE html>
      <html><head>
      </head><body><div>
      <h2>A new Direct Ship request has been created</h2>
      <p>Access the request by clicking this <a href="http://localhost:8080/${dbPostRequest.dataValues.id}">link</a></p>
      <p><strong>Customer:</strong> ${dbPostRequest.dataValues.customerName}</p>
      </div></body></html>`

      sendMail(emailAddress, emailSubject, emailText, function(err, data) {
        if (err) {
          console.log('ERROR: ', err);
          return res.status(500).json({ message: err.message || 'Internal Error' });
        }
        console.log('Email sent!!!');
        return res.json({ message: 'Email sent!!!!!' });
      });

      res.json(dbPostRequest);
    });
  });
//
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
