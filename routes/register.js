const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, phone, password } = req.body;
  if (!email || !name || !phone || !password) {
    return res.status(400).json("incorrect form submission");
  }
};

module.exports = handleRegister;
