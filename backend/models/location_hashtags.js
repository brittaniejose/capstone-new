'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Location_Hashtag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Location_Hashtag.belongsToMany(models.Location, {
        through: "Location_Hashtags",
        foreignKey: "locationID",
        otherKey: "hashtagID"
      })
      Location_Hashtag.belongsToMany(models.Hashtag, {
        through: "Location_Hashtags",
        foreignKey: "hashtagID",
        otherKey: "locationID"
      })
    }
  }
  Location_Hashtag.init({
    locationID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Locations',
        key: 'id',
      }
    },
    hashtagID: { 
      type: DataTypes.INTEGER,
      references: {
        model: 'Hashtags',
        key: 'id',
      }
    },
  }, {
    sequelize,
    modelName: 'Location_Hashtag',
  });
  return Location_Hashtag;
};