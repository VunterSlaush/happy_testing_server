var UserController = require('../controllers/User.js');

module.exports = function(app)
{

  app.post('/signup', function(req, res)
  {
      UserController.create(req.body,res);
  });

  app.post('/login', function(req, res)
  {
      UserController.login(req.body,res);
  });

  app.put('/user', function(req, res)
  {
      UserController.update(req.body,res);
  });

}
