"use strict";

module.exports = function(sequelize, DataTypes)
{
  var Aplicacion = sequelize.define("aplicaciones",
  {
    id:{ DataTypes.STRING, primaryKey:true, autoIncrement:true},
    nombre: DataTypes.STRING
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
