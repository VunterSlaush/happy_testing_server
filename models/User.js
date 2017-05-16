"use strict";

module.exports = function(sequelize, DataTypes)
{
  var User = sequelize.define("usuarios",
  {
    id:{DataTypes.STRING, primaryKey:true, autoIncrement:true},
    username: {type: DataTypes.STRING, unique:true},
    password: DataTypes.STRING,
    nombre: DataTypes.STRING
  },
  {
    classMethods:
    {
      associate: function(models)
      {
        User.hasMany(models.App),
        User.hasMany(models.Report),
        User.belongsToMany(models.App,
        {
          through: {
            model: models.UserApp,
            unique: false,
          },
          foreignKey: 'usuario',
          constraints: false
        });
      }
    }
  });
  return User;
};
