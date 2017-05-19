var unsecureRoutes = require('../config/unsecure_routes.json');

module.exports =
{
  hasSession : function (req,res, next)
  {
    console.log("pasando por la politica:"+req.path);
    console.log("unsecure routes:",unsecureRoutes.routes.indexOf(req.path));
    if(req.user || unsecureRoutes.routes.indexOf(req.path) != -1)
      next();
    else
      res.json({success:false, error:"no hay sesion iniciada"});
  }
}
