'use strict';

module.exports = {
  up: function (queryInterface, Sequelize)
  {
    queryInterface.createTable('aplicaciones',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre:
      {
        type: Sequelize.STRING,
        unique: true,
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      },
      owner:
      {
        type: Sequelize.INTEGER,
        references:
        {
          model: 'usuarios',
          key: 'id'
        }
    }

    },
    {
      engine: 'InnoDB',                     // default: 'InnoDB'
      charset: 'null',                    // default: null
      schema: 'public'                      // default: public, PostgreSQL only.
    });
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.dropTable('aplicaciones');
  }
};
