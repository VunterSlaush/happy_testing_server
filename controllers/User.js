var User  = require('../models').User;
var Report  = require('../models').Report;
var App  = require('../models').App;
var encrypter = require('../services/encrypt');

module.exports =
{
    create: function (user, res)
    {
      User.create(user)
          .then((userCreated) => {

            res.json({success:true, user:userCreated})}
          )
          .catch((error) =>
          {

            res.json({success:false, error:"usuario existente"});
          });
    },

    delete: function(req, res)
    {
      User.findOne({where:{id: req.body.id}}).then(user =>
      {
          user.destroy()
              .then(() => res.json({success: true}))
              .catch(error => res.json({success:false, error: 'no se pudo eliminar este usuario'}));

      }).catch(error =>
      {
         res.json({success:false, error:'Usuario no encontrado'});
      });
    },

    update: function(req, res)
    {
        if(req.body.password != null)
          req.body.password = encrypter.encrypt(req.body.password); // TODO esto es valido??


        User.update(req.body,{ where:{id:req.user.id}, fields: ['username','nombre','password'] })
        .then((userUpdated) => {
          req.user.username = req.body.username;
          res.json({success:true, user:userUpdated});
        })
        .catch((error) =>
        {
          res.json({success:false, error:"no se pudieron actualizar algunos campos"});
        });
    },

    authStrategy: function (username, password, done)
    {
      User.findOne({where: {username:username}})
          .then(userFinded =>
            {
               if(userFinded && encrypter.compare(userFinded.password,password))
               {
                  return done(null, userFinded);
               }
               else
                 return done(null, false, {success:false, error:"contaseña incorrecta"});
       }).catch(error =>
         {

        console.log("Error en authStrategy:"+error);
        return done(null, false, {success:false, error:"usario no encontrado"})
      });
    },

    getApps: function (req, res) 
    {
        req.user.getCanEditApps().then(canEdit =>
        {

          req.user.getApps().then(apps =>
          {
              for (var i = 0; i < canEdit.length; i++) {
                apps.push(canEdit[i]);
              }
              res.json({success:true, apps: apps});

          }).catch(error => res.json({success:false, error:"no se pudieron consultar las aplicaciones"}));

        }).catch(error => res.json({success:false, error:"no se pudieron consultar las aplicaciones"}));


    },

    getReports: function (req, res)
    {
        Report.findAll({where:{ owner:req.user.id}, include:[{model: App}]}).then(reports => res.json({success:true, reports:reports}));
    },

    getAllUsers: function (req, res)
    {
        User.findAll({attributes: ['id', 'nombre','username'], where: {id:{ $ne : req.user.id }}}).then(users => res.json({success:true, users:users}))
                      .catch(error => res.json({success:false, error:"no se pudieron consultar usuarios"}));
    }
};
