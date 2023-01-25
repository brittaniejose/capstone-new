'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Post, {
        foreignKey: 'userID'
      })
      User.hasMany(models.Repost, {
        foreignKey: 'userID'
      })
      User.hasMany(models.Message, {
        foreignKey: 'userID'
      })
      User.hasMany(models.Location, {
        foreignKey: 'userID'
      })
      User.hasMany(models.Like, {
        foreignKey: 'userID'
      })
      User.hasMany(models.Comment, {
        foreignKey: 'userID'
      })
      User.hasMany(models.Bookmark, {
        foreignKey: 'userID'
      })
      User.belongsToMany(models.User, { 
        as: 'Following',
        through: 'Follow_Following', 
        foreignKey: 'followingID',
        otherKey: 'followID' 
      });
      User.belongsToMany(models.User, { 
        as: 'Follower',
        through: 'Follow_Follower', 
        foreignKey: 'followerID',
        otherKey: 'followID' 
      });
      User.hasMany(models.Message, {
        foreignKey: 'senderID'
      })
      User.hasMany(models.Message, {
        foreignKey: 'receiverID'
      })
      User.belongsToMany(models.Conversation, {
        as: 'Sender',
        through: 'Conversation_Senders',
        foreignKey: 'senderID',
        otherKey: 'conversationID'
      });
      User.belongsToMany(models.Conversation, {
        as: 'Receiver',
        through: 'Conversation_Receivers',
        foreignKey: 'receiverID',
        otherKey: 'conversationID'
      });
    }
  }
  User.init({
    icon: DataTypes.JSON,
    displayName: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [1, 25],
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [4, 25],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 100],
      }
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};