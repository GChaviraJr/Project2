require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const exphbs = require("express-handlebars");
const db = require("./models");

const app = express();
const bcrypt = require("bcrypt-nodejs");
const PORT = process.env.PORT || 3000;
const register = require("./routes/register");

// Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);
app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

const syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(() => {
  app.listen(PORT, () => {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;
