var models = require('../models');
var App = models.App;
var Report = models.Report;
var Imagen = models.Image;
var Observation = models.Observation;
var path = require('path');
var mkdirp = require('mkdirp');

module.exports =
{
    create: function (req, res)
    {
        console.log("Buscando Aplicacion:"+ req.body.aplicacion);
        App.findOne({where:{id: req.body.aplicacion}}).then(app =>
          {
            //if(app.canDoItSomething(req.user))
            //{
            console.log("REQ",req);
              crearReporte(req,res);
            //}
          //  else
              //  res.json({success:false, error:"no tiene acceso a esta aplicacion"});
          }).catch(error => {res.json({success:false, error:'aplicacion no encontrada'}); console.log("ERROR", error)});
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

    }
};


function crearReporte(req,res) // TODO testear esto
{
    console.log("Entrando en CREAR REPORTE");
    if (!req.files)
      return res.status(400).json({success:false, error:'No hay archivos subidos'});

    //TODO en OWNER va req.user.id
    Report.create({aplicacion:req.body.aplicacion, nombre: generateReportName(req), owner:24 }).then(reporte =>
    {
      console.log("REPORTE CREADO?");
      procesarArchivos(req,reporte, (images) => procesarObservaciones(req,reporte, images,
                                          () => res.json({success:true, res: reporte}))); // Muevo los Archivos de las imagenes a carpetas

    }).catch(error => {res.json({success:false, error:'error al crear reporte'}); console.log("ERROR REPORTE", error); });

    /* ESTO LO NECESITO!
    let path = 'C:/Users/user/Google\ Drive/'+sampleFile.name;
    */
}


function procesarArchivos(req, reporte, callback)
{
  req.body.images = JSON.parse(req.body.images);
  console.log("PROCESANDO ARCHIVOS", req.files.length);
  let images = [];
  let errors = [];
  let dir = __dirname+'/storage/apps/'+reporte.aplicacion+'/'+reporte.id+'/images/';
  let filePath;
  var promises = [];

  mkdirp(dir, function(err) {

    if(!err)
    {
      Object.keys(req.files).forEach(function(k)
      {

          console.log(k + ' - ' + req.files[k]);
          filePath = generatePath(dir,req.files[k].name, req)
          promises.push(req.files[k].mv(filePath.direccion,function (error) {
            console.log("Error insertando Archivo:",error);
          }));
          images.push(filePath);
      });
      console.log("LLAMANDO A PROMISE ALL!!");
      Promise.all(promises).then(() => callback(images)).catch(error => console.log("ERROR", error));
    }

});
}

//TODO pensar en cambiar el PATH!
function generatePath(dir,filename, req)
{
  console.log("ENTRANDO EN GENERATE PATH",req.body.images, filename);
  let dirName;

  for (var i = 0; i < req.body.images.length; i++)
  {
    if(req.body.images[i].name == filename)
    {
      dirName = dir + i + '-' + filename; // Directorio + posicion de la imagen en insercion + '-' + nombre imagen;
      return {direccion:dirName,observacion:req.body.images[i].observacion};
    }
  }
  return {};
}

function procesarObservaciones(req, reporte, images, callback)
{
  console.log("Entrando en PROCESAR OBSERVACIONES", req.body.observaciones);
  let promises = [];
  req.body.observaciones = JSON.parse(req.body.observaciones);
  for (var i = 0; i < req.body.observaciones.length; i++)
  {
    let observationImages = findImages(images,req.body.observaciones[i].correlativo);
    console.log('insertando observacion',req.body.observaciones[i].texto, observationImages);
    promises.push(Observation.create({reporte:reporte.id,
                                     texto: req.body.observaciones[i].texto,
                                     images: observationImages
                                   },{
                                      include:[{ model:Imagen, as: 'images'}]
                                   }));
  }
  console.log("PROMISES ALL!");
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
    console.log("GENERANDO NOMBRE DEL REPORTE");
    var date = new Date();
    // AQUI VA req.user.nombre ! TODO
    return "MOTA"+"_"+date.getDate()+"-"+(1+date.getMonth())+"-"+date.getFullYear()+"_"+date.getHours()+"-"+date.getMinutes()+"-"+date.getSeconds();
}
