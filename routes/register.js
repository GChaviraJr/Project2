
// const reload = () => {
//   location.reload();
// };

// const handleRegister = (req, res, db, bcrypt) => {
//   const { email, name, password } = req.body;
//   debugger;
//   if (!email || !name || !password) {
//     return res.status(400).json('incorrect form submission');
//   }
//   const hash = bcrypt.hashSync(password);
//   db.transaction(trx => {
//     trx.insert({
//       hash: hash,
//       email: email
//     })
//         .into('login')
//         .returning('email')
//         .then(loginEmail => {
//           return trx('users')
//             .returning('*')
//             .insert({
//               email: loginEmail[0],
//               name: name,
//               joined: new Date()
//             })
//             .then(user => {
//               res.json(user[0]);
//             })
//         })
//         .then(trx.commit)
//         .catch(trx.rollback)
//       })
//       .catch(err => res.status(400).json('unable to register'))
//   }

//   module.exports = {
//     handleRegister: handleRegister
//   };

const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, phone, password } = req.body;
  if (!email || !name || !phone || !password) {
    return res.status(400).json("incorrect form submission");
  }
  const hash = bcrypt.hashSync(password);
  return sequelize.transaction(function (t) {
    return Login.create({
      hash: hash,
      email: email,
      phone: phone
      }, {transaction: t}).then(function (user) {
      return User.setShooter({
        hash: hash,
        email: email,
        phone: phone
        }, {transaction: t})
      })
  }).then(function (result) {
    }).catch(err => res.status(400).json("unable to register"));

//   db.transaction(trx => {
//     trx.insert({
//       hash: hash,
//       email: email,
//       phone: phone
//     })
//       .into("login")
//       .returning("email")
//       .then(loginEmail => {
//         return trx("users")
//           .returning("*")
//           .insert({
//             email: loginEmail[0],
//             name: name,
//             phone: phone,
//             joined: new Date()
//           })
//           .then(user => {
//             res.json(user[0]);
//           });
//       })
//       .then(trx.commit)
//       .catch(trx.rollback)
//   }).catch(err => res.status(400).json("unable to register"));
};
module.exports = {
  handleRegister: handleRegister
};

