'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Message.belongsTo(models.Conversation, {
        foreignKey: 'conversationID'
      })
      Message.belongsTo(models.User, {
        foreignKey: 'senderID'
      })
      Message.belongsTo(models.User, {
        foreignKey: 'receiverID'
      })
    }
  }
  Message.init({
    conversationID: DataTypes.INTEGER,
    senderID: DataTypes.INTEGER,
    receiverID: DataTypes.INTEGER,
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};