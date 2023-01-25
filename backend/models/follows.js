'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Follow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Follow.belongsToMany(models.User, {
        as: 'Follower',
        through: 'Follow_Follower',
        foreignKey: 'followID',
        otherKey: 'followerID'
      })
      Follow.belongsToMany(models.User, {
        as: 'Following',
        through: 'Follow_Following',
        foreignKey: 'followID',
        otherKey: 'followingID'

      })
    }
  }
  Follow.init({
    followerID: DataTypes.INTEGER,
    followingID: DataTypes.INTEGER,
    blocked: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Follow',
  });
  return Follow;
};