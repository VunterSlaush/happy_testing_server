"use strict";

module.exports = function(sequelize, DataTypes)
{
  var Image = sequelize.define("imagenes",
  {
    id:{DataTypes.STRING, primaryKey:true, autoIncrement:true},
    direccion: { type: Sequelize.STRING, allowNull: false}
  },
  {
      classMethods:
      {
        associate: function(models)
        {
          Image.belongsTo(models.Observation,{foreignKey: 'observacion', targetKey: 'id'})
        }
      }
    });
  return Image;
};
