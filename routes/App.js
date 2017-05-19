var AppController = require('../controllers/App.js');

module.exports = function(app)
{

  app.post('/apps/create', function(req, res)
  {
      AppController.create(req,res);
  });

  app.put('/apps', function(req, res)
  {
      AppController.update(req,res);
  });

  app.delete('/apps', function(req, res)
  {
    AppController.delete(req,res);
  });

  app.get('/apps/:id/reports', function(req,res)
  {
    AppController.getReports(req,res);
  });

}