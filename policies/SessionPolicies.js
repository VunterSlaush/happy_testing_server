var unsecureRoutes = require('../config/unsecure_routes.json');

module.exports =
{
  hasSession : function (req,res, next)
  {
    console.log("pasando por la politica:"+req.path);
    console.log("unsecure routes:",unsecureRoutes.routes.indexOf(req.path));
    if(req.user || unsecureRoutes.routes.indexOf(req.path) != -1 || routeContainsSomeMatches(unsecureRoutes.matches,req.path))
    {
      console.log("pase la politica!");
      next();
    }
    else
      res.json({success:false, error:"no hay sesion iniciada"});
  }
}


function routeContainsSomeMatches(matches, route)
{
  for (var i = 0; i < matches.length; i++) {
    if(route.indexOf(matches[i]) != -1)
      return true;
  }
  return false;
}
