const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, phone, password } = req.body;
  if (!email || !name || !phone || !password) {
    return res.status(400).json("incorrect form submission");
  }
//   return db.transaction(function (t) {
//     return Login.create({
//       hash: hash,
//       email: email
//       }, {transaction: t}).then(function (user) {
//       return user.setShooter({ 
//         hash: hash,
//         email: email
//         }, {transaction: t})
//       })
//   }).then(function (result) {
//       console.log(result)
//     }).catch(err => res.status(400).json("unable to register"));
};

module.exports = handleRegister;
