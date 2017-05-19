"use strict";
var User  = require('../models').User;
var App  = require('../models').App;
module.exports =
{
  create: function (req, res)
  {
    console.log("Creando Aplicacion");
    if(req.user)
    {
      App.create({nombre:req.body.nombre, owner:req.user.id}).then(response => res.json({success: true, res: response}))
                                                             .catch(error => res.json({success: false, error: "Aplicacion existente"}));
    }
    else
    {
      res.json({success:false, error:"sesion no iniciada"});
    }
  },

  update: function (req, res)
  {
    if(req.user)
    {
      App.findOne({where:{id:req.body.id}}).then(app =>
        {
          if(app.isMyOwner(req.user))
          {
            app.update(req.body).then(function() {
              res.json({success:true, app:app});
            });
          }
          else
            res.json({success:false, error:"no tienes acceso a esta aplicacion"});
        }).catch(error => res.json({success: false, error:"error al Actualizar"}));
    }
    else
    {
      res.json({success:false, error:"sesion no iniciada"});
    }
  },

  delete: function (req, res)
  {
    if(req.user)
    {
      App.findOne({where:{id:req.body.id}}).then(app =>
        {
          if(app.isMyOwner(req.user))
          {
            app.destroy({force:true}).then(function() {
              res.json({success:true});
            });
          }
          else
            res.json({success:false, error:"no tienes acceso a esta aplicacion"});
        }).catch(error => res.json({success: false, error:"error al borrar"}));
    }
    else
    {
      res.json({success:false, error:"sesion no iniciada"});
    }
  },

  getReports: function (req, res)
  {
    console.log("reportes de app:"+req.params.id);
    if(req.user)
    {
      App.findOne({where:{id:req.params.id}}).then(app =>
        {
          console.log("App Buscada:"+app.id)
          app.canDoItSomething(req.user, function (canDoIt)
          {
              if(canDoIt)
              {
                app.getReports().then(reports => res.json({success:true,reports:reports}))
                                .catch(error => res.json({success:false, error:"no se consiguieron reportes"}));
              }
              else
                res.json({success:false, error:"no tienes acceso a esta aplicacion"});
          });
        }).catch(error => res.json({success: false, error:error}));
    }
    else
    {
      res.json({success:false, error:"sesion no iniciada"});
    }
  },
};
