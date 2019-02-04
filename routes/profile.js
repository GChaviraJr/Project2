const handleProfileGet = (req, res, db) => {
  const User = db.User;
  const { id } = req.params;
  User.findAll({
    where: {
      id: id
    }
  }).then(User => {
    if (User.length) {
      res.json(User[0])
    } else {
      res.status(400).json("Not found");
    }
  }).catch(err => res.status(400).json("error getting user"));
};

const handleProfileUpdate = (req, res, db) => {
  const { id } = req.params;
  const { name, age, pet } = req.body.formInput;

  db.User.update(req.body, {
    where: {
      id: id
    }
  }).then(resp => {
    if (resp) {
      res.json("success");
    } else {
      res.status(400).json("Not found");
    }
  }).catch(err => res.status(400).json("error updating user"));
};

module.exports = {
  handleProfileGet,
  handleProfileUpdate
};
