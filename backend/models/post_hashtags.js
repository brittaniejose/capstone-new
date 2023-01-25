'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post_Hashtag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Post_Hashtag.belongsToMany(models.Hashtag, {
        through: 'Post_Hashtags',
        foreignKey: 'hashtagID',
        otherKey: 'postID',
      });
      Post_Hashtag.belongsToMany(models.Post, {
        through: 'Post_Hashtags',
        foreignKey: 'postID',
        otherKey: 'hashtagID',
      });
    }
  }
  Post_Hashtag.init({
    hashtagID: { 
      type: DataTypes.INTEGER,
      references: {
        model: 'Hashtags',
        key: 'id',
      }
    },
    postID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Posts',
        key: 'id',
      }
    },
  }, {
    sequelize,
    modelName: 'Post_Hashtag',
  });
  return Post_Hashtag;
};