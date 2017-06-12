var UserAppsController = require('../controllers/UserApp.js');

module.exports = function (app)
{
  app.post('/user_app/create', function(req, res)
  {
      UserAppsController.create(req,res);
  });

  app.delete('/user_app', function(req, res)
  {
    UserAppsController.delete(req,res);
  });

  app.post('/user_app/create_by_list', function (req, res)
  {
    UserAppsController.createByList(req,res);
  });

}
