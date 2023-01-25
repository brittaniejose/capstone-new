'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Like.belongsTo(models.Post, {
        foreignKey: 'postID'
      })
      Like.belongsTo(models.Comment, {
        foreignKey: 'commentID'
      })
      Like.belongsTo(models.Location, {
        foreignKey: 'locationID'
      })
      Like.belongsTo(models.User, {
        foreignKey: 'userID'
      })
    }
  }
  Like.init({
    userID: DataTypes.INTEGER,
    postID: DataTypes.INTEGER,
    commentID: DataTypes.INTEGER,
    locationID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Like',
  });
  return Like;
};