var models = require('../models');
var App = models.App;
var Report = models.Report;
var Imagen = models.Image;
var User = models.User;
var Observation = models.Observation;
var docManager = require('../services/writeDoc.js');
var path = require('path');
var mkdirp = require('mkdirp');
var nodePath = __dirname.replace('\controllers','');


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

    delete: function(req, res)
    {
        App.findOne({where:{id: req.body.aplicacion}}).then(app =>
          {
            if(app.isMyOwner(req.user))
            {
              //TODO eliminar archivo?
              Report.destroy({where:{id:req.body.reporte}})
                    .then(() => res.json({success: true}))
                    .catch(error => res.json({success:false, error: 'no se pudo eliminar este reporte'}));
            }
            else
                res.json({success:false, error:"no tiene acceso a esta aplicacion"});
          }).catch(error => res.json({success:false, error:'aplicacion no encontrada'}));

    },

    update: function (req, res)
    {

    },

    get: function (req, res)
    {
      console.log("REPORTGET IN");
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
                            console.log("ERROR AQUI", error);
                          });
    }
};


function crearReporte(req,res) // TODO testear esto
{
    console.log("Entrando en CREAR REPORTE");
    if (!req.files)
      return res.status(400).json({success:false, error:'No hay archivos subidos'});

    Report.create({aplicacion:req.body.aplicacion, nombre: generateReportName(req), owner:req.user.id }).then(reporte =>
    {
      procesarArchivos(req,reporte, (images) => procesarObservaciones(req,reporte, images,
                                          () => { docManager.createDocFromReport(reporte,null);
                                                  res.json({success:true, res: reporte});
                                                })); // Muevo los Archivos de las imagenes a carpetas

    }).catch(error => {res.json({success:false, error:'error al crear reporte'}); console.log("ERROR REPORTE", error); });

    /* ESTO LO NECESITO!
    let path = 'C:/Users/user/Google\ Drive/'+sampleFile.name;
    */
}


function procesarArchivos(req, reporte, callback)
{
  req.body.images = JSON.parse(req.body.images);
  let images = [];
  let errors = [];
  let dir = nodePath+'/storage/apps/'+reporte.aplicacion+'/'+reporte.id+'/images/';
  let filePath;
  var promises = [];

  mkdirp(dir, function(err) {

    if(!err)
    {
      Object.keys(req.files).forEach(function(k)
      {
          filePath = generatePath(dir,req.files[k].name, req)
          promises.push(req.files[k].mv(filePath.direccionFisica,function (error)
          {

          }));
          images.push(filePath);
      });
      Promise.all(promises).then(() => callback(images)).catch(error => console.log("ERROR", error));
    }
    else
      callback(null);

});
}

//TODO pensar en cambiar el PATH!
function generatePath(dir,filename, req)
{
  let dirName;

  for (var i = 0; i < req.body.images.length; i++)
  {
    if(req.body.images[i].name == filename)
    {
      dirName = dir + i + '-' + filename; // Directorio + posicion de la imagen en insercion + '-' + nombre imagen;
      return {direccionFisica:dirName,direccion:dirName.replace(nodePath,''),observacion:req.body.images[i].observacion};
    }
  }
  return {};
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

function generateReportName(req)// TODO PENSAR ESTO BIEN!
{
    var date = new Date();
    return req.user.nombre+"_"+date.getDate()+"-"+(1+date.getMonth())+"-"+date.getFullYear()+"_"+date.getHours()+"-"+date.getMinutes()+"-"+date.getSeconds();
}
