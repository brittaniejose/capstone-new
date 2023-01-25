'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bookmark extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Bookmark.belongsTo(models.User, {
        foreignKey: 'userID'
      })
      Bookmark.belongsTo(models.Post, {
        foreignKey: 'postID'
      })
      Bookmark.belongsTo(models.Location, {
        foreignKey: 'locationID'
      })
    }
  }
  Bookmark.init({
    userID: DataTypes.INTEGER,
    postID: DataTypes.INTEGER,
    locationID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Bookmark',
  });
  return Bookmark;
};