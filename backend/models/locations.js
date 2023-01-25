'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Location extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Location.belongsTo(models.User, {
        foreignKey: 'userID'
      })
      Location.hasMany(models.Like, {
        foreignKey: 'locationID'
      })
      Location.belongsToMany(models.Hashtag, {
        through: "Location_Hashtags",
        foreignKey: "locationID",
        otherKey: "hashtagID"
      })
    }
  }
  Location.init({
    content: DataTypes.STRING,
    header: DataTypes.STRING,
    coordinates: DataTypes.JSON,
    name: DataTypes.STRING,
    userID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Location',
  });
  return Location;
};