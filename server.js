const express = require("express");
const exphbs = require("express-handlebars");
const db = require("./models");
const app = express();
const bcrypt = require("bcrypt-nodejs");
const PORT = process.env.PORT || 3000;
const morgan = require("morgan");

const signIn = require("./routes/signIn");
const register = require("./routes/register");
const profile = require("./routes/profile");
const auth = require("./routes/authorization");

require("dotenv").config();

// Middleware
app.use(morgan("combined"));
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
app.post("/home", signIn.signinAuthentication(db, bcrypt));
app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});
app.get("/home/:id", auth.requireAuth, (req, res) => {
  profile.handleProfileGet(req, res, db);
});
app.post("/home/:id", auth.requireAuth, (req, res) => {
  profile.handleProfileUpdate(req, res, db);
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
