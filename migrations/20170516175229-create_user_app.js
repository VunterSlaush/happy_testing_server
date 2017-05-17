'use strict';

module.exports = {
  up: function (queryInterface, Sequelize)
  {
    queryInterface.createTable('usuario_aplicacion',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      },
      aplicacion:
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:
        {
          model: 'aplicaciones',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      usuario:
      {
       type: Sequelize.INTEGER,
       allowNull: false,
       references:
       {
         model: 'usuarios',
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
    queryInterface.dropTable('usuario_aplicacion');
  }
};
