const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
  debugger;
  if (!email || !name || !password) {
    return res.status(400).json("incorrect form submission");
  }
};

module.exports = {
  handleRegister: handleRegister
};
