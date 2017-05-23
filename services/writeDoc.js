var officegen = require('officegen');
var path = require('path');
var nodePath = __dirname.replace('\services','');
var models = require('../models');
var Observation = models.Observation;
var Imagen = models.Image;
var fs = require('fs');

module.exports =
{
  createDocFromReport: function(report, callback)
  {
    var docx = officegen ('docx');
    Observation.findAll({ where:{reporte:report.id}, include:[{ model:Imagen, as: 'images'}]})
               .then(obs =>
                 { // TODO a;adir Header al documento !
                    for (var i = 0; i < obs.length; i++)
                    {
                      var pObj = docx.createP ();
                      pObj.options.align = 'center';
                      for (var j = 0; j < obs[i].images.length; j++)
                      {
                        pObj.addImage(path.resolve(nodePath, obs[i].images[j].direccion.substring(1)));
                      }
                      pObj.addLineBreak();
                      pObj.addText(obs[i].texto);
                      pObj.addLineBreak();
                      if((i+1) % 2 == 0)
                        docx.putPageBreak();
                    }
                    var outDir = 'storage/apps/'+report.aplicacion+'/'+report.id+'/'+report.nombre+'.docx';
                    var out =  fs.createWriteStream (nodePath+outDir);
                    docx.generate(out);
                 });

  }

}
