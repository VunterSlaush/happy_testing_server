var ImagesController = require('../controllers/Image.js');

module.exports = function (app)
{
  app.post('/images/create', function(req, res)
  {
    ImagesController.create(req,res);
  });

  app.post('/images/delete', function(req, res)
  {
    ImagesController.delete(req,res);
  });
}
