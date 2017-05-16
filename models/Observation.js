"use strict";

module.exports = function(sequelize, DataTypes)
{
  var Observation = sequelize.define("observaciones",
  {
    id:{DataTypes.STRING, primaryKey:true, autoIncrement:true},
    texto: { type: Sequelize.STRING, allowNull: false}
  },
  {
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
