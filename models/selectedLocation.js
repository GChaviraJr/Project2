module.exports = function(sequelize, DataTypes) {
  var SelectedLocation = sequelize.define("Selected_Location", {
    name: DataTypes.STRING,
    address: DataTypes.STRING
  });
  return SelectedLocation;
};
