module.exports = function(sequelize, DataTypes) {
  var Results = sequelize.define("Results", {
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    URL: DataTypes.STRING
  });
  return Results;
};
