'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Hashtag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Hashtag.belongsToMany(models.Post, {
        through: 'Post_Hashtags',
        foreignKey: 'hashtagID',
        otherKey: 'postID'
      })
      Hashtag.belongsToMany(models.Location, {
        through: "Location_Hashtags",
        foreignKey: "hashtagID",
        otherKey: "locationID"
      })
      Hashtag.belongsToMany(models.Comment, {
        through: "Comment_Hashtags",
        foreignKey: "hashtagID",
        otherKey: "commentID"
      })
    }
  }
  Hashtag.init({
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Hashtag',
  });
  return Hashtag;
};