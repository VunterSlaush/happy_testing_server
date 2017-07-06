var models = require('../models');
var App = models.App;
var Report = models.Report;
var Imagen = models.Image;
var User = models.User;
var Observation = models.Observation;
var docManager = require('../services/writeDoc.js');
var imageSaver = require('../services/ImageSaver.js');



module.exports =
{
    create: function (req, res)
    {
        console.log("Buscando Aplicacion:"+ req.body.aplicacion);
        App.findOne({where:{id: req.body.aplicacion}}).then(app =>
          {
            app.canDoItSomething(req.user, (canDoIt) =>
            {
              if(canDoIt)
                crearReporte(req,res);
              else
                res.json({success:false, error:"no tiene acceso a esta aplicacion"});
            });


          }).catch(error => {res.json({success:false, error:'aplicacion no encontrada'});});
    },

    delete: function(req, res) // TODO TOTAL
    {
        Report.findOne({where:{id: req.body.id}}).then(report =>
          {
            if(report.app.isMyOwner(req.user))
            {
              //TODO eliminar archivo?
              report.destroy().then(() => res.json({success: true}))
                    .catch(error => res.json({success:false, error: 'no se pudo eliminar este reporte'}));
            }
            else
                res.json({success:false, error:"no tiene acceso a esta aplicacion"});
          }).catch(error => res.json({success:false, error:'aplicacion no encontrada'}));

    },

    publicar: function (req, res)
    {
      Report.findOne({where:{id:req.body.reporte}}).then(report =>
      {
        docManager.createDocFromReport(report, (dir) =>
        {
          if(dir != null)
            res.json({success:true, link:dir});
          else
            res.json({success:false, error:"no se pudo crear el archivo"});
        })
      }).catch(error => {
                            res.json({success: false, error:"Reporte no encontrado"});
                          });
    },

    get: function (req, res)
    {

      Report.findOne({where:{id:req.params.id}, include:[{model: User, attributes:["nombre", "username","id"]},
      {model:App}, {model:Observation, include:[{model:Imagen, as:'images'}]}]}).then(report =>
      {
          report.App.canDoItSomething(req.user, function (canDoIt)
          {
              if(canDoIt)
              {
                res.json({success:true,report:report});
              }
              else
                res.json({success:false, error:"no tienes acceso a esta aplicacion"});
          });
        }).catch(error => {
                            res.json({success: false, error:error});
                          });
    }
};


function crearReporte(req,res) // TODO testear esto
{
    if (!req.files)
      return res.status(400).json({success:false, error:'No hay archivos subidos'});

    Report.create({aplicacion:req.body.aplicacion, nombre: req.body.nombre, owner:req.user.id }).then(reporte =>
    {
      imageSaver.procesarArchivos(req,reporte, (images) => procesarObservaciones(req,reporte, images,
                                          () => {
                                                  res.json({success:true, res: reporte});
                                                })); // Muevo los Archivos de las imagenes a carpetas

    }).catch(error => {res.json({success:false, error:'error al crear reporte'}); console.log("ERROR REPORTE", error); });

    /* ESTO LO NECESITO!
    let path = 'C:/Users/user/Google\ Drive/'+sampleFile.name;
    */
}

function procesarObservaciones(req, reporte, images, callback)
{
  let promises = [];
  req.body.observaciones = JSON.parse(req.body.observaciones);
  for (var i = 0; i < req.body.observaciones.length; i++)
  {
    let observationImages = findImages(images,req.body.observaciones[i].correlativo);
    promises.push(Observation.create({reporte:reporte.id,
                                     texto: req.body.observaciones[i].texto,
                                     images: observationImages
                                   },{
                                      include:[{ model:Imagen, as: 'images'}]
                                   }));
  }
  Promise.all(promises).then(() => callback()).catch(error => console.log("ERROR", error));
}

function findImages(images, correlativo)
{
  let imagesFinded = [];
  for (var i = 0; i < images.length; i++)
  {
    if(images[i].observacion == correlativo)
      imagesFinded.push({direccion: images[i].direccion});
  }
  return imagesFinded;
}
