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

    login: function (user, res)
    {
       User.findOne({where: {username:user.username}})
            .then(userFinded =>
              {
                if(encrypter.compare(userFinded.password,user.password))
                  res.json({success:true, user:userFinded});
                else
                  res.json({success:false, error:"contaseña incorrecta"});
             }).catch(error => { console.log(error); res.json({success:false, error:"usario no encontrado"})});
    },

    delete: function(user, res)
    {
      consoe.log("NOT WORKING!");
    },

    update: function( user, res)
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
    }
};
