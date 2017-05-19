"use strict";

module.exports = function(sequelize, DataTypes)
{
  var Report = sequelize.define("Report",
  {
    id:{ type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
    nombre: { type: DataTypes.STRING, allowNull: false},
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    aplicacion:
    {
       type: DataTypes.INTEGER,
       references:
       {
         model: "aplicaciones",
         key: 'id'
       }
    },
  },
  {
    tableName: 'reportes',
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
