var ObservationsController = require('../controllers/Observation.js');

module.exports = function (app)
{
  app.post('/observations/create', function(req, res)
  {
    ObservationsController.create(req,res);
  });

  app.post('/observations/delete', function(req, res)
  {
    ObservationsController.delete(req,res);
  });
}
