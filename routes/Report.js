module.exports = function (app)
{
  app.post('/user_app/create', function(req, res)
  {
    ReportsController.create(req,res);
  });

  app.delete('/user_app', function(req, res)
  {
    ReportsController.delete(req,res);
  });
}
