var db = require("../models");

module.exports = function(app) {
  app.get("/", function(req, res) {
    db.Results.findAll({}).then(function(dbRestaurants) {
      res.render("../views/home.handlebars", {
        msg: "Welcome!",
        restaurants: dbRestaurants
      });
    });
  });

  app.get("/register", function(req, res) {
    db.Results.findAll({}).then(function() {
      res.render("../views/register.handlebars", {});
    });
  });

  app.get("/input", function(req, res) {
    db.Results.findAll({}).then(function() {
      res.render("../views/input.handlebars", {});
    });
  });

  app.get("/restaurants", function(req, res) {
    res.render("../views/input.handlebars", {
      msg: "Welcome!",
      restaurants: apiResults
    });
  });

  // Load example page and pass in an example by id
  app.get("/example/:id", function(req, res) {
    db.Example.findOne({ where: { id: req.params.id } }).then(function(
      dbExample
    ) {
      res.render("example", {
        example: dbExample
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
