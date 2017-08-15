var Observation  = require('../models').Observation;
var Image = require('../models').Image;
var Report = require('../models').Report;
var imageSaver = require('../services/ImageSaver.js');


module.exports =
{
    create: function (req, res)
    {
        console.log("Create Images:",req.body, " USER:", req.user);
        Observation.findOne({where:{id: req.body.observacion}}).then(observation =>
        {
          console.log("OBSERVATION:",observation);
          observation.getReport().then((report) =>
          {
            if(report.isMyOwner(req.user))
            {
              imageSaver.procesarArchivos(req,report, (images) => saveImages(req.body.observacion,images, res)); // Muevo los Archivos de las imagenes a carpetas
            }
            else
                res.json({success:false, error:"no tiene acceso a este Reporte"});
          }).catch(error =>
            {
              console.log("CREATE IMAGE ERROR", error);
              res.json({success:false, error:'no tiene acceso a este Reporte'})
            });

        }).catch(error => res.json({success:false, error:'Observacion no encontrada'}));
    },

    delete: function(req, res)
    {

      Observation.findOne({where:{id: req.body.observacion}}).then(observation =>
      {
        observation.getReport().then((report) =>
        {
          if(report.isMyOwner(req.user))
          {
            Image.destroy({ where:{id : req.body.images}})
                 .then( (resp) => res.json({success:true, res:resp}))
                 .catch( () =>  res.json({success:true, error:"Error al agregar imagenes"}));
          }
          else
              res.json({success:false, error:"no tiene acceso a esta aplicacion"});
        }).catch(error => res.json({success:false, error:'no tiene acceso a este Reporte'}));

      }).catch(error => res.json({success:false, error:'Observacion no encontrada'}));
    }
};

function saveImages(observation,images, res)
{

  for(var i = 0; i< images.length; i++)
  {
    try {
      images[i].observacion = observation;
    } catch (e) {

    }
  }

  console.log("images",images);
  Image.bulkCreate(images,{returning: true}).then( (resp) => res.json({success:true, res:resp}))
                          .catch( () =>  res.json({success:true, error:"Error al agregar imagenes"}));
}
