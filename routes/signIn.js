const jwt = require("jsonwebtoken");

const redisClient = require("redis").createClient(process.env.REDIS_URL);

const signToken = username => {
  const jwtPayload = { username };
  return jwt.sign(jwtPayload, "JWT_SECRET_KEY", { expiresIn: "2 days" });
};

// test 
const setToken = (key, value) => Promise.resolve(redisClient.set(key, value));

const createSession = (db, user) => {
  console.log("start of createSession");
  const { email, id } = user;
  console.log("after first const of createSession");
  const token = signToken(email);
  console.log("right before first return of createSession");
  return db.User.findAll({
    where: {
      email: email,
      id: id
    }
  }).then(() => setToken(token, id))
    .then(() => {
      return { success: "true", userId: id, token, user };
    })
    .catch(console.log);
};

const handleSignin = (db, bcrypt, req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  if (!email || !password) {
    return Promise.reject("incorrect form submission");
  }
  return db.User.findAll({
    where: {
      email: email
    }
  })
    .then(data => {
      console.log("handleSignin rist then");
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        console.log("is this valid?")
         return db.User.findAll({
          where: {
            email: email
          }
        })
          .then(user => user[0])
          .catch(err => res.status(400).json("unable to get user"));
      } else {
        return Promise.reject("wrong credentials");
      }
    })
    .catch(err => err);
};

const getAuthTokenId = (req, res) => {
  const { authorization } = req.headers;
  console.log("getAuthTokenId started")
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      console.log("if statement of getAuthTokenId")
      return res.status(401).send("Unauthorized");
    }
    return res.json({ id: reply });
  });
};

var signinAuthentication = function signinAuthentication(db, bcrypt) {
  return function(req, res) {
    console.log("starting signinAuth func")
    var authorization = req.headers.authorization;
    return authorization
      ? getAuthTokenId(req, res)
      : handleSignin(db, bcrypt, req, res)
        .then(function(data) {
          console.log("first then of main func")
              return data.id && data.email
              ? createSession(db, data)
              : Promise.reject(data)
          })
        .then(function(session) {
          console.log("session then")
          res.json(session);
          })
        .catch(function(err) {
          console.log(err);
          res.status(400).json("Unable to start session");
        });
  };
};

module.exports = {
  signinAuthentication: signinAuthentication,
  redisClient: redisClient
};
