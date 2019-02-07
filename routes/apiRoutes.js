"use strict";

// twilio api
const SID = process.env.TWILIO_SID;
const Key = process.env.TWILIO_KEY;

// normal calls and variables

const register = require("./register");
const auth = require("./authorization");
const signIn = require("./signIn");
const bcrypt = require("bcrypt-nodejs");
var yelp = require("yelp-fusion");
var apiKey = process.env.YELP_API_KEY;

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
    db.Results.findAll({}).then(function(data) {
      res.json(data);
      return data;
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
        console.log(response);
        for (var i = 0; i < 10; i++) {
          var tableData = {
            name: response.jsonBody.businesses[i].name,
            address: response.jsonBody.businesses[
              i
            ].location.display_address.join(","),
            URL: response.jsonBody.businesses[i].url
          };
          // console.log(JSON.stringify(response, null, 2));
          db.Results.create(tableData);
        }
        res.status(200).send(response);
      })
      .catch(e => {
        console.log(e);
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
      res.render("input");
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

  // Retreiving data hash Home
  // Retrieving data from User Register

  app.post("/register", (req, res) => {
    db.User.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      hash: bcrypt.hashSync(req.body.password)
    }).then(dbUser => {
      res.json(dbUser);
    });
  });

  // Authentication Home
  app.post("/home", signIn.signinAuthentication(db, bcrypt));

  app.post("/input:id", (req, res, db, bcrypt) => {
    auth.requireAuth(db, bcrypt);
  });
  app.get("/home", (req, res) => {});

  // config var

  const firebaseAPIKey = process.env.FIREBASE_API_KEY;
  const firebaseDBURL = process.env.FIREBASE_DB_URL;
  const firebaseDomain = process.env.FIREBASE_DOMAIN;
  const firebaseProject = process.env.FIREBASE_PROJECT_ID;
  const firebaseSender = process.env.FIREBASE_SENDER_ID;
  const firebaseStgBucket = process.env.FIREBASE_STG_BUCKET;

  const config = {
    apiKey: firebaseAPIKey,
    authDomain: firebaseDomain,
    databaseURL: firebaseDBURL,
    projectId: firebaseProject,
    storageBucket: firebaseStgBucket,
    messagingSenderId: firebaseSender
  };

  app.post("/input", config.json());

  // app.post("/input", (req, res) => {
  //   res.json(config);
  // });

  // Delete an example by id
  app.delete("/api/examples/:id", function(req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function(
      dbExample
    ) {
      res.json(dbExample);
    });
  });
};
