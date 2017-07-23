var UserController = require('../controllers/User.js');
var passport = require('passport');

module.exports = function(app)
{

  app.post('/signup', function(req, res)
  {
      UserController.create(req.body,res);
  });


  app.post('/login', passport.authenticate('local', {}), function(req, res)
  {
    res.json({success:true,id:req.user.id, nombre: req.user.nombre});
  });

  app.post('/user/update', function(req, res)
  {
      UserController.update(req,res);
  });

  app.post('/logout', function (req,res)
  {
    req.session.destroy();
    req.logout();
    res.json({success:true});
  });

  app.get('/user/apps',function (req,res)
  {
    UserController.getApps(req,res);
  });

  app.get('/user/reports',function (req,res)
  {
    UserController.getReports(req,res);
  });

  app.post('/users/delete',function (req,res)
  {
    UserController.delete(req,res);
  });

  app.get('/users',function (req,res)
  {
    UserController.getAllUsers(req,res);
  });

}
