"use strict";

var yelp = require("yelp-fusion");
var apiKey =
  "eGyFYoGa3oYrHwELLpuXsE9A1l9W6d6AoJszCKMPa3M9SNgR2kx1md-nelFS1jJdfOb1sCD3knBmuWA7kDTZSoZMehkn0-Avx1VDY6QMhAX45RpIuKyxSBZ53eTsW3Yx";
var client = yelp.client(apiKey);
var db = require("../models");

module.exports = function(app) {
  // GET route for getting all of the users
  app.get("/home", (req, res) => {
    db.User.findAll({}).then(dbusers => {
      res.json(dbusers);
    });
  });

  app.get("/api/restaurants", function(req, res) {
    db.Results.findAll({}).then(function(dbRestaurants) {
      res.json(dbRestaurants);
    });
  });

  // Create a new restaurant
  app.post("/api/restaurants", function(req, res) {
    console.log(req.body.text);
    client
      .search({
        location: req.body.text,
        categories: "bars",
        limit: 10
      })
      .then(response => {
        for (var i = 0; i < 10; i++) {
          var tableData = {
            name: response.jsonBody.businesses[i].name,
            address: response.jsonBody.businesses[
              i
            ].location.display_address.join(","),
            URL: response.jsonBody.businesses[i].url
          };
          // console.log(JSON.stringify(response, null, 2));
          db.Results.create(tableData).then(function() {
            res.end();
          });
        }
        // }).catch(e => {
        //   console.log(e);
        // })
      });
  });

  app.post("/api/selectedLocation", (req, res) => {
    db.Selected_Location.create({
      name: req.body.name,
      address: req.body.address
    }).then(() => {
      console.log("added selected location");
    });
  });

  app.delete("/api/selectedLocation", function(req, res) {
    db.Selected_Location.destroy({
      where: {},
      truncate: true
    }).then(function() {
      res.render("input");;
      console.log("all selected locations deleted");
    });
  });

  app.delete("/api/examples/", function(req, res) {
    db.Results.destroy({
      where: {},
      truncate: true
    }).then(function() {
      console.log("all rows deleted");
    });
  });
};
// Create a new example
// Retrieving data from users Home
// app.post("/home", (req, res) => {
//   db.User.create({
//     name: req.body.name,
//     email: req.body.email,
//     phone: req.body.phone
//   });
//   .then((dbUser) => {
//     res.json(dbUser);
//   });
// });

// Retreiving data hash Home
// app.post("/home", (req, res) => {
//   db.Login.create({
//     email: req.body.email,
//     hash: req.body
//   });
//   .then((dbLogin) => {
//     res.json(dbLogin);
//   });
// });

// // Retrieving data from users Register
// app.post("/register", (req, res) => {
//   db.User.create({
//     name: req.body.name,
//     email: req.body.email,
//     phone: req.body.phone
//   })
//   .then((dbUser) => {
//     res.json(dbUser);
//   });
// });

//Retrieving data from hash Register
// app.post("/register", (req, res) => {
//   db.Example.create(req.body)
//   .then((dbExample) => {
//     res.json(dbExample);
//   });
// });

// Delete an example by id
