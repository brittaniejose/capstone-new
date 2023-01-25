'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post_Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Post_Tag.belongsToMany(models.Tag, {
        through: 'Post_Tags',
        foreignKey: 'tagID',
        otherKey: 'postID',
      });
      Post_Tag.belongsToMany(models.Post, {
        through: 'Post_Tags',
        foreignKey: 'postID',
        otherKey: 'tagID',
      });
    }
  }
  Post_Tag.init({
    tagID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Tags',
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
    modelName: 'Post_Tag',
  });
  return Post_Tag;
};