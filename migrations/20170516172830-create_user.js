'use strict';

module.exports = {
  up: function (queryInterface, Sequelize)
  {
    queryInterface.createTable('usuarios',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username:
      {
        type: Sequelize.STRING,
        unique: true,
      },
      password:
      {
        type: Sequelize.STRING
      },
      nombre:
      {
        type: Sequelize.STRING
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      },

    },
    {
      engine: 'InnoDB',                     // default: 'InnoDB'
      charset: 'null',                    // default: null
      schema: 'public'                      // default: public, PostgreSQL only.
    });
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.dropTable('usuarios');
  }
};
