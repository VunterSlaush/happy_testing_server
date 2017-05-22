"use strict";

module.exports = function(sequelize, DataTypes)
{
  var Observation = sequelize.define("Observation",
  {
    id:{ type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
    texto: { type: DataTypes.STRING, allowNull: false},
    reporte:{
       type: DataTypes.INTEGER,
       references:
       {
         model: "reportes",
         key: 'id'
       }
    },
  },
  {
    tableName: 'observaciones',
    classMethods:
    {
      associate: function(models)
      {
        Observation.belongsTo(models.Report,{foreignKey: 'reporte', targetKey: 'id'}),
        Observation.hasMany(models.Image, {foreignKey: 'observacion', sourceKey: 'id', as:'images'})
      }
    }
  });
  return Observation;
};
