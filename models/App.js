"use strict";

module.exports = function(sequelize, DataTypes)
{
  var Aplicacion = sequelize.define("App",
  {
    id: { type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
    nombre: DataTypes.STRING,
    owner:
    {
      type: DataTypes.INTEGER,
      references:
      {
             model: "usuarios",
             key: 'id'
      }
    }
  },
  {
    tableName: 'aplicaciones',
    classMethods:
    {
      associate: function(models)
      {
        Aplicacion.belongsTo(models.User, {foreignKey: 'owner', targetKey: 'id'}),
        Aplicacion.hasMany(models.Report, {foreignKey: 'aplicacion', sourceKey: 'id'}),
        Aplicacion.belongsToMany(models.User,
        {
          through: {
            model: models.UserApp,
            unique: false,
          },
          as:'canEditMe',
          foreignKey: 'aplicacion',
          constraints: false
        });
      }
    },

    instanceMethods:
    {
      isMyOwner: function(user)
      {
        return this.owner == user.id;
      },

      canDoItSomething: function(user, next)
      {

        this.getCanEditMe().then(editList =>
        {
            let canEdit = false;
            for (var i = 0; i < editList.length; i++)
            {
              if(editList[i].usuario = user.id)
                canEdit = true;
            }
            next(canEdit || this.isMyOwner(user));
        });
      }
    }
  });
  return Aplicacion;
};
