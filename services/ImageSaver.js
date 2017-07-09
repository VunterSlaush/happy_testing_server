var path = require('path');
var mkdirp = require('mkdirp');
var nodePath = __dirname.replace('\services','');

module.exports =
{
  procesarArchivos: function(req, reporte, callback) // TODO true si no hay imagenes!
  {
      req.body.images = JSON.parse(req.body.images);
      let images = [];
      let errors = [];
      let dir = nodePath+'/storage/apps/'+reporte.aplicacion+'/'+reporte.id+'/images/';
      let filePath;
      var promises = [];

      mkdirp(dir, function(err) {

        if(!err)
        {
          Object.keys(req.files).forEach(function(k)
          {
              filePath = generatePath(dir,req.files[k].name, req)
              promises.push(req.files[k].mv(filePath.direccionFisica,function (error)
              {

              }));
              images.push(filePath);
          });
          Promise.all(promises)
                 .then(() => callback(images))
                 .catch(error => console.log("ERROR", error));
        }
        else
          callback(null);

    });
  }
}

function generatePath(dir,filename, req)
{
  let dirName;

  for (var i = 0; i < req.body.images.length; i++)
  {
    if(req.body.images[i].name == filename)
    {
      dirName = dir + i + '-' + filename; // Directorio + posicion de la imagen en insercion + '-' + nombre imagen;
      return {direccionFisica:dirName,direccion:dirName.replace(nodePath,''),observacion:req.body.images[i].observacion};
    }
  }
  return {};
}
