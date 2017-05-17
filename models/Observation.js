"use strict";

module.exports = function(sequelize, DataTypes)
{
  var Observation = sequelize.define("Observation",
  {
    id:{ type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
    texto: { type: DataTypes.STRING, allowNull: false},

  },
  {
    tableName: 'observaciones',
    classMethods:
    {
      associate: function(models)
      {
        Observation.belongsTo(models.Report,{foreignKey: 'reporte', targetKey: 'id'}),
        Observation.hasMany(models.Image)
      }
    }
  });
  return Observation;
};
