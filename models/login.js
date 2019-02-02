module.exports = (sequelize, DataTypes) => {
  const Login = sequelize.define("Login", {
    hash: {
      type: DataTypes.JSON,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    }
  });
  return Login;
};
