'use strict';

module.exports = {
  up: function (queryInterface, Sequelize)
  {
    queryInterface.createTable('observaciones',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      texto:
      {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      },
      reporte:
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:
        {
          model: 'reportes',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
    }

    },
    {
      engine: 'InnoDB',                     // default: 'InnoDB'
      charset: 'null',                    // default: null
      schema: 'public'                      // default: public, PostgreSQL only.
    });
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.dropTable('observaciones');
  }
};
