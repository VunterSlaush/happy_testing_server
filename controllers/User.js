var User  = require('../models').User;
var encrypter = require('../services/encrypt');
module.exports =
{
    create: function (user, res)
    {
      User.create(user)
          .then((userCreated) => res.json(userCreated))
          .catch((error) =>
          {
            console.log("Error Creando user:"+error);
            res.status(403).json({success:false, error:"usuario existente"});
          });
    },

    delete: function(user, res)
    {
      consoe.log("NOT WORKING!");
    },

    update: function(req, res)
    {
      if(user.id)
      {
        User.update(req.body.user,{ where:{id:req.body.id}, fields: ['nombre','password'] }).then((userUpdated) => res.json(userUpdated))
        .catch((error) =>
        {
          res.status(403).json({success:false, error:"no se pudieron actualizar algunos campos"});
        });
      }
      else
      {
        res.status(404).json({success:false, error:"no se puede updatear el usuario sin su identificador"});
      }
    },

    authStrategy: function (username, password, done)
    {
      User.findOne({where: {username:username}})
          .then(userFinded => {
               if(userFinded && encrypter.compare(userFinded.password,password))
                 return done(null, userFinded);
               else
                 return done(null, false, {success:false, error:"contaseña incorrecta"});
      })
        .catch(error => {

        console.log("Error en authStrategy:"+error);
        return done(null, false, {success:false, error:"usario no encontrado"})
      });
    },

    getApps: function (req, res)
    {
        req.user.getApps().then(apps => res.json(apps));
    },

    getReports: function (req, res)
    {
        req.user.getReports().then(reports => res.json(reports));
    }
};
