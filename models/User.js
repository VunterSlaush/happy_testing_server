"use strict";
var encrypter = require('../services/encrypt');
module.exports = function(sequelize, DataTypes)
{
  var User = sequelize.define("User",
  {
    id:{type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
    username: {type: DataTypes.STRING, unique:true, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
    nombre: DataTypes.STRING
  },
  {
    tableName: 'usuarios',
    classMethods:
    {
      associate: function(models)
      {
        User.hasMany(models.App,  {foreignKey: 'owner', sourceKey: 'id'}),
        User.hasMany(models.Report, {foreignKey: 'owner', sourceKey: 'id'}),
        User.belongsToMany(models.App,
        {
          through: {
            model: models.UserApp,
            unique: false,
          },
          as: 'canEditApps',
          foreignKey: 'usuario',
          constraints: false
        });
      }
    },
    hooks:
    {
      beforeCreate: function (user,options)
      {
          user.password = encrypter.encrypt(user.password);
      }
    },

    instanceMethods:
    {
     getAllMyApps: function (callback) // TODO
      {
        this.getApps().then(apps => {return apps});
      }
    }
  });
  return User;
};
