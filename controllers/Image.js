var Observation  = require('../models').Observation;
var Image = require('../models').Image;
var Report = require('../models').Report;
var imageSaver = require('../services/ImageSaver.js');


module.exports =
{
    create: function (req, res)
    {
        Report.findOne({where:{id: req.body.id}}).then(report =>
          {
            if(report.isMyOwner(req.user))
            {
              imageSaver.procesarArchivos(req,report, (images) => saveImages(images, res)); // Muevo los Archivos de las imagenes a carpetas
            }
            else
                res.json({success:false, error:"no tiene acceso a esta aplicacion"});

          }).catch(error => res.json({success:false, error:'reporte no encontrado'}));
    },

    delete: function(req, res)
    {
        Report.findOne({where:{id: req.body.report}}).then(report =>
          {
            if(report.isMyOwner(req.user))
            {
              Image.destroy({where:{id: req.body.images}})
                     .then(response => res.json({success:true, res:response}))
                     .catch(error => res.json({success:false, error:"error al eliminar"}));
            }
            else
                res.json({success:false, error:"no tiene acceso a este reporte"});

          }).catch(error => res.json({success:false, error:'aplicacion no encontrada'}));
    }
};

function saveImages(observation,images, res)
{
  for(var i = 0; images.length; i++)
    images[i].observacion = observation;

  Image.bulkCreate(images).then( (resp) => res.json({success:true, res:resp}))
                          .catch( () =>  res.json({success:true, error:"Error al agregar imagenes"}));
}
