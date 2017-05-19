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
            console.log(error);
            res.status(403).json({success:false, error:"usuario existente"});
          });
    },

    delete: function(user, res)
    {
      consoe.log("NOT WORKING!");
    },

    update: function(user, res)
    {
      if(user.id)
      {
        User.update(user,{ where:{id:user.id}, fields: ['nombre','password'] }).then((userUpdated) => res.json(userUpdated))
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

               if(encrypter.compare(userFinded.password,password))
                 return done(null, userFinded);
               else
                 return done(null, false, {success:false, error:"contaseña incorrecta"});
      })
        .catch(error => {

        console.log(error);
        return done(null, false, {success:false, error:"usario no encontrado"})
      });
    },

    getApps: function (req, res)
    {
      if(req.user)
        req.user.getApps().then(apps => res.json(apps));
      else
        res.json({success:false, error:"sesion no iniciada"});
    },

    getReports: function (req, res)
    {
      if(req.user)
        req.user.getReports().then(reports => res.json(reports));
      else
        res.json({success:false, error:"sesion no iniciada"});
    }
};
