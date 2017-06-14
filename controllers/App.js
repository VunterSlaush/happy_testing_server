"use strict";
var User  = require('../models').User;
var App  = require('../models').App;
var report  = require('../models').Report;
var UserApp = require('../models').UserApp;

module.exports =
{
  create: function (req, res)
  {
      console.log("BODY", req.body);
      App.create({nombre:req.body.nombre, owner:req.user.id})
         .then(app =>
           {
             let userApps = [];
             for (var i = 0; i < req.body.users.length; i++)
             {
               userApps.push({usuario: req.body.users[i], aplicacion: app.id});
             }
             console.log("User Apps a insertar:", userApps);
             UserApp.bulkCreate(userApps).then(() => res.json({success: true, res: app}))
                               .catch(error => {
                                                  res.json({success: false, error: "Error al asociar usuarios"})
                                                  console.log('ERROR!:', error);
                                                  });
           })
         .catch(error => res.json({success: false, error: "Aplicacion existente"}));
  },

  update: function (req, res)
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
  },

  delete: function (req, res)
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
  },

  getReports: function (req, res)
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
  },

  get: function (req, res)
  {
    App.findOne({where:{id:req.params.id}, include:[{model: report},{model: User, attributes:["nombre", "username","id"]},
      {model: User, as:"canEditMe", attributes:["nombre", "username","id"]}]}).then(app =>
      {
        app.canDoItSomething(req.user, function (canDoIt)
        {
            if(canDoIt)
            {
              res.json({success:true,app:app});
            }
            else
              res.json({success:false, error:"no tienes acceso a esta aplicacion"});
        });
      }).catch(error => res.json({success: false, error:error}));
  }
};
