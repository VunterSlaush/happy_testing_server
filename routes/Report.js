var ReportsController = require('../controllers/Report.js');

module.exports = function (app) // TODO finalizar esto !
{
  app.post('/reportes/create', function(req, res)
  {
    ReportsController.create(req,res);
  });

  app.delete('/user_app', function(req, res)
  {
    ReportsController.delete(req,res);
  });
}
