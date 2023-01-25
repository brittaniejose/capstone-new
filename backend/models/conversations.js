'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Conversation.belongsToMany(models.User, {
        as: 'Sender',
        through: 'Conversation_Senders',
        foreignKey: 'conversationID',
        otherKey: 'senderID'
      })
      Conversation.belongsToMany(models.User, {
        as: 'Receiver',
        through: 'Conversation_Receivers',
        foreignKey: 'conversationID',
        otherKey: 'receiverID'
      })
      Conversation.hasMany(models.Message, {
        foreignKey: 'conversationID'
      })
    }
  }
  Conversation.init({
    senderID: DataTypes.INTEGER,
    receiverID: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Conversation',
  });
  return Conversation;
};