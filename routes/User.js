var UserController = require('../controllers/User.js');
var passport = require('passport');

module.exports = function(app)
{

  app.post('/signup', function(req, res)
  {
      UserController.create(req.body,res);
  });

  app.post('/login', passport.authenticate('local', {}),
  function(req, res)
  {
    res.json({success:true,id:req.user.id, nombre: req.user.nombre});
  });

  app.put('/user', function(req, res)
  {
      UserController.update(req.user,res);
  });

  app.get('/user/apps',function (req,res)
  {
    UserController.getApps(req,res);
  });

  app.get('/user/reports',function (req,res)
  {
    UserController.getReports(req,res);
  });

}
