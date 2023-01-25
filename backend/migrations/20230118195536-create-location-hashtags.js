'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Location_Hashtags', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      locationID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Locations',
          key: 'id',
          onDelete: 'CASCADE',
          onUpdate: 'NO ACTION'
        }
      },
      hashtagID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Hashtags',
          key: 'id',
          onDelete: 'CASCADE',
          onUpdate: 'NO ACTION'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Location_Hashtags');
  }
};