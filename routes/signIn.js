const jwt = require("jsonwebtoken");
const redis = require("redis");
const bcrypt = require("bcrypt-nodejs");
var db = require("../models");

const redisClient = redis.createClient(process.env.REDIS);

const signToken = (username) => {
  const jwtPayload = { username };
  return jwt.sign(jwtPayload, "JWT_SECRET_KEY", { expiresIn: "2 days" });
};

const setToken = (key, value) => Promise.resolve(redisClient.set(key, value));

const createSession = (user) => {
  db.User.findAll({
    where: {
      email: email,
      id: id
    }
  })
  const { email, id } = user;
  const token = signToken(email);
  // db.User.findAll({
  //   where: {
  //     email: email,
  //     id: id
  //   }
  // });
  return setToken(token, id);
    // .then(() => {
    //   return { success: "true", userId: id, token, user };
    // })
    // .catch(console.log);
};

const handleSignin = (db, req, res) => {
 
  // const { email, password } = req.body;
  // if (!email || !password) {
  //   return Promise.reject("incorrect form submission");
  // }
  return db.User.findAll({
    where: {
      email: email,
      id: id
    }
  })
  .then(data => {
    const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        db.User.findAll({
          where: {
            email: email,
            password: password
          }
        })
        // .then(user => user[0])
    //     .catch(err => res.status(400).json("unable to get user"))
    // } else {
    //   return Promise.reject("wrong credentials");
    // }
    // })
    // .catch(err => err);
};

const getAuthTokenId = (req, res) => {
  const { authorization } = req.headers;
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(401).send("Unauthorized");
    }
    return res.json({ id: reply });
  });
};

var signinAuthentication = function signinAuthentication(db, bcrypt) {
  return function(req, res) {
    var authorization = req.headers.authorization;
    console.log(authorization);
    return authorization
      ? getAuthTokenId(req, res)
      : handleSignin(db, bcrypt, req, res)
        .then(function(data) {
          console.log(data)
          const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid) {
              return createSession(data[0]);
            } else {
              // Promise.reject(data)
              return Promise.reject("wrong credentials");
            }
          })
        .then(function(session) {
          console.log(session);
          // { success: "true", userId: id, token, user }
          return res.json(session);
          })
          .catch(function(err) {
            return res.status(400).json(err);
        });
  };
};

module.exports = {
  signinAuthentication: signinAuthentication,
  redisClient: redisClient
};
