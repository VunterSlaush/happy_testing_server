var models = require('../models');
var App = models.App;
var Report = models.Report;
var Imagen = models.Imagen;
var Observation = models.Observation;

module.exports =
{
    create: function (req, res)
    {
        App.findOne({where:{id: req.body.aplicacion}}).then(app =>
          {
            if(app.canDoItSomething(req.user))
            {
              crearReporte(req,res);
            }
            else
                res.json({success:false, error:"no tiene acceso a esta aplicacion"});
          }).catch(error => res.json({success:false, error:'aplicacion no encontrada'}));
    },

    delete: function(req, res)
    {
        App.findOne({where:{id: req.body.aplicacion}}).then(app =>
          {
            if(app.isMyOwner(req.user))
            {

            }
            else
                res.json({success:false, error:"no tiene acceso a esta aplicacion"});
          }).catch(error => res.json({success:false, error:'aplicacion no encontrada'}));

    },

    update: function (req, res)
    {

    }
};


function crearReporte(req,res)
{

    if (!req.files)
      return res.status(400).json({success:false, error:'No hay archivos subidos'});

    Report.create({aplicacion:req.body.aplicacion, nombre: generateReportName(req) }).then(reporte =>
    {
      let observaciones = procesarObservaciones(req);
      reporte.setObservations(observaciones);
      res.json({success:true, res: reporte});
    }).catch(error => res.json({success:false, error:'error al crear reporte'}));

/*
    let path = 'C:/Users/user/Google\ Drive/'+sampleFile.name;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(path, function(err) {
      if (err)
        return res.status(500).send(err);

      res.status(200).json({success:true});
    });*/
}

function procesarObservaciones(req) // TODO .. esto es muy importante, y al parecer hardcore?
{

}

function generateReportName(req)// TODO PENSAR ESTO BIEN!
{
    var date = new Date();
    return req.user.nombre+"_"+date.getDate()+"-"+(1+date.getMonth())+"-"date.getFullYear()+"_"+date.getHours()+"-"+date.getMinutes();
}
