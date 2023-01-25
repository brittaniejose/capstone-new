'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Comment.belongsTo(models.Post, {
        foreignKey: 'postID'
      })
      Comment.belongsTo(models.User, {
        foreignKey: 'userID'
      })
      Comment.hasMany(models.Like, {
        foreignKey: 'commentID'
      })
      Comment.belongsToMany(models.Hashtag, {
        through: 'Comment_Hashtags',
        foreignKey: 'commentID',
        otherKey: 'hashtagID'
      })
    }
  }
  Comment.init({
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userID: DataTypes.INTEGER,
    postID: DataTypes.INTEGER,
    locationID: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};