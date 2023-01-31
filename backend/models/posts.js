'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Post.belongsTo(models.User, {
        foreignKey: 'userID'
      })
      Post.hasMany(models.Comment, {
        foreignKey: 'postID'
      })
      Post.hasMany(models.Like, {
        foreignKey: 'postID'
      })
      Post.belongsToMany(models.Tag, {
        through: 'Post_Tags',
        foreignKey: 'postID',
        otherKey: 'tagID'
      })
      Post.belongsToMany(models.Hashtag, {
        through: 'Post_Hashtags',
        foreignKey: 'postID',
        otherKey: 'hashtagID'
      })
    }
  }
  Post.init({
    title: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [1-50]
      }
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    media: DataTypes.ARRAY(DataTypes.JSON),
    userID: DataTypes.INTEGER,
    deleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};