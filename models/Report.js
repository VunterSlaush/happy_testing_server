"use strict";

module.exports = function(sequelize, DataTypes)
{
  var Report = sequelize.define("reportes",
  {
    id:{DataTypes.STRING, primaryKey:true, autoIncrement:true},
    nombre: { type: Sequelize.STRING, allowNull: false},
    createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  },
  {
    classMethods:
    {
      associate: function(models)
      {
        Report.belongsTo(models.User,{foreignKey: 'owner', targetKey: 'id'}),
        Report.belongsTo(models.App, {foreignKey: 'aplicacion', targetKey: 'id'}),
        Report.hasMany(models.Observation)
      }
    }
  });
  return Report;
};
