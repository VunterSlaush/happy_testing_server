var Observation  = require('../models').Observation;
var Report = require('../models').Report;
module.exports =
{
    create: function (req, res)
    {
        Report.findOne({where:{id: req.body.reporte}}).then(report =>
          {
            if(report.isMyOwner(req.user))
            {
              console.log("CREAR OBSERVACION!");
              Observation.create({texto:req.body.texto, reporte:req.body.reporte})
                  .then((resp) => res.json({success:true, res:resp}))
                  .catch((error) =>
                  {
                    console.log("ERROR OBSERVACION",error);
                    res.json({success:false, error:"No se pudo crear la observacion"});
                  });
            }
            else
                res.json({success:false, error:"no tiene acceso a esta aplicacion"});

          }).catch(error => res.json({success:false, error:'reporte no encontrado'}));
    },


    delete: function(req, res)
    {
        console.log("MOTA--->",req.body);
        Observation.findOne({where:{id: req.body.id}}).then(observation =>
          {
              observation.getReport().then((report) =>
              {
                if(report.isMyOwner(req.user))
                {
                  Observation.destroy({where:{id:req.body.id}})
                         .then(response => res.json({success:true, res:response}))
                         .catch(error => res.json({success:false, error:"error al eliminar"}));
                }
                else
                    res.json({success:false, error:"no tiene acceso a este reporte"});

              }) .catch(error => res.json({success:false, error:"error al eliminar"}));

          }).catch(error => res.json({success:false, error:'reporte no encontrado'}));
    }
};
