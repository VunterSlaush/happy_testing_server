var ReportsController = require('../controllers/Report.js');

module.exports = function (app) // TODO finalizar esto !
{
  app.post('/reportes/create', function(req, res)
  {
    ReportsController.create(req,res);
  });

  app.post('/reportes/delete', function(req, res)
  {
    ReportsController.delete(req,res);
  });

  app.delete('/user_app', function(req, res)
  {
    ReportsController.delete(req,res);
  });

  app.get('/reportes/:id', function (req, res)
  {
    ReportsController.get(req,res);
  });

  app.post('/reportes/publicar', function (req, res)
  {
    ReportsController.publicar(req,res);
  });
}
