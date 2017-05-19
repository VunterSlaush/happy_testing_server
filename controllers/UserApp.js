var UserApp  = require('../models').UserApp;
var App = require('../models').App;
module.exports =
{
    create: function (req, res)
    {
      if(req.user)
      {
        App.findOne({where:{id: req.body.aplicacion}}).then(app =>
          {
            if(app.isMyOwner(req.user))
            {
              UserApp.create({usuario:req.body.usuario, aplicacion:req.body.aplicacion})
                  .then((res) => res.json({success:true, res:res}))
                  .catch((error) =>
                  {
                    console.log(error);
                    res.status(403).json({success:false, error:"usuario existente"});
                  });
            }
            else
                res.json({success:false, error:"no tiene acceso a esta aplicacion"});
          }).catch(error => res.json({success:false, error:'aplicacion no encontrada'}));
      }
      else
        res.json({success:false, error:"sesion no iniciada"});

    },

    delete: function(req, res)
    {
      if(req.user)
      {
        App.findOne({where:{id: req.body.aplicacion}}).then(app =>
          {
            if(app.isMyOwner(req.user))
            {
              UserApp.destroy({where:{aplicacion:req.body.aplicacion, usuario:req.body.usuario}})
                     .then(response => res.json({success:true, res:response}))
                     .catch(error => res.json({success:false, error:"error al eliminar"}));
            }
            else
                res.json({success:false, error:"no tiene acceso a esta aplicacion"});
          }).catch(error => res.json({success:false, error:'aplicacion no encontrada'}));
      }
      else
        res.json({success:false, error:"sesion no iniciada"});

    }
};
