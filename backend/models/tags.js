'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Tag.belongsToMany(models.Post, {
        through: 'Post_Tags',
        foreignKey: 'tagID', 
        otherKey: 'postID'
      })
    }
  }
  Tag.init({
    name: {
    type: DataTypes.ENUM('tip', 'tutorial', 'location'),
    },
  }, {
    sequelize,
    modelName: 'Tag',
  });
  return Tag;
};