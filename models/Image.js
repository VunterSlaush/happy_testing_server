"use strict";

module.exports = function(sequelize, DataTypes)
{
  var Image = sequelize.define("Image",
  {
    id:{ type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
    direccion: { type: DataTypes.STRING, allowNull: false},

  },
  {
      tableName: 'imagenes',
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
