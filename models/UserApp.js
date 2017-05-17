"use strict";

module.exports = function(sequelize, DataTypes)
{
  var UserApp = sequelize.define("UserApp",
  {
    id:{ type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
    aplicacion:
    {
       type: DataTypes.INTEGER,

       references: {
         model: "aplicaciones",
         key: 'id'
       }
    },
   usuario:
   {
      type: DataTypes.INTEGER,

      references: {
        model: "usuarios",
        key: 'id'
      }
    },

  },
  {
      tableName: 'usuario_aplicacion',
      classMethods:
      {
        associate: function(models)
        {

        }
      }
    });
  return UserApp;
};
