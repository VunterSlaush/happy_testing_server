"use strict";

module.exports = function(sequelize, DataTypes)
{
  var UserApp = sequelize.define("usuario_aplicacion",
  {
    id:{DataTypes.STRING, primaryKey:true, autoIncrement:true},
    aplicacion:
    {
       type: Sequelize.INTEGER,

       references: {
         model: App,
         key: 'id',
         deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
       }
    },
   usuario:
   {
      type: Sequelize.INTEGER,

      references: {
        model: User,
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
      }
    },
  },
  {
      classMethods:
      {
        associate: function(models)
        {

        }
      }
    });
  return UserApp;
};
