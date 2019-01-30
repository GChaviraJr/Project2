var db = require("../models");

module.exports = function(app) {
  // GET route for getting all of the users
  app.get("/home", (req, res) => {
    db.User.findAll({})
    .then((dbusers) => {
      res.json(dbusers);
      });
  });

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

  // Retrieving data from users Register
  app.post("/register", (req, res) => {
    db.User.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone
    })
    .then((dbUser) => {
      res.json(dbUser);
    });
  });

  //Retrieving data from hash Register
  // app.post("/register", (req, res) => {
  //   db.Example.create(req.body)
  //   .then((dbExample) => {
  //     res.json(dbExample);
  //   });
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