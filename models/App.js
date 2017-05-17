"use strict";

module.exports = function(sequelize, DataTypes)
{
  var Aplicacion = sequelize.define("App",
  {
    id: { type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
    nombre: DataTypes.STRING,
    tableName: 'aplicaciones'
  },
  {
    classMethods:
    {
      associate: function(models)
      {
        Aplicacion.belongsTo(models.User, {foreignKey: 'owner', targetKey: 'id'}),
        Aplicacion.hasMany(models.Report),
        Aplicacion.belongsToMany(models.User,
        {
          through: {
            model: models.UserApp,
            unique: false,
          },
          foreignKey: 'aplicacion',
          constraints: false
        });
      }
    }
  });
  return Aplicacion;
};
