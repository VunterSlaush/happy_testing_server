var UserApp  = require('../models').UserApp;
var App = require('../models').App;
module.exports =
{
    create: function (req, res)
    {
        App.findOne({where:{id: req.body.aplicacion}}).then(app =>
          {
            if(app.isMyOwner(req.user))
            {
              UserApp.create({usuario:req.body.usuario, aplicacion:req.body.aplicacion})
                  .then((res) => res.json({success:true, res:res}))
                  .catch((error) =>
                  {
                    console.log("Error en user Apps:"+error);
                    res.status(403).json({success:false, error:"usuario existente"});
                  });
            }
            else
                res.json({success:false, error:"no tiene acceso a esta aplicacion"});
          }).catch(error => res.json({success:false, error:'aplicacion no encontrada'}));
    },

    createByList: function (req, res)
    {
      App.findOne({where:{id: req.body.aplicacion}}).then(app =>
        {
          let userApps = [];
          if(app.isMyOwner(req.user))
          {
              for (var i = 0; i < req.body.users.length; i++)
              {
                userApps.push({usuario: req.body.users[i]});
              }

              app.setCanEditMe(userApps).then((res) => res.json({success:true, res:res}))
              .catch((error) =>
              {
                console.log("Error en user Apps:"+error);
                res.status(403).json({success:false, error:"usuario existente"});
              });
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
              UserApp.destroy({where:{aplicacion:req.body.aplicacion, usuario:req.body.usuario}})
                     .then(response => res.json({success:true, res:response}))
                     .catch(error => res.json({success:false, error:"error al eliminar"}));
            }
            else
                res.json({success:false, error:"no tiene acceso a esta aplicacion"});
          }).catch(error => res.json({success:false, error:'aplicacion no encontrada'}));

    }
};
