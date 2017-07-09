var officegen = require('officegen');
var path = require('path');
var nodePath = __dirname.replace('\services','');
var models = require('../models');
var Observation = models.Observation;
var Imagen = models.Image;
var App = models.App;
var App = models.User;
var fs = require('fs');


module.exports =
{
  createDocFromReport: function(report, callback)
  {
    var docx = officegen ('docx');
    console.log(docx);
    Observation.findAll({ where:{reporte:report.id}, include:[{ model:Imagen, as: 'images'}]})
               .then(obs =>
                 {
                   var header = docx.createP ();
                   header.options.align = 'left';
                   header.addText("Aplicacion:"+report.App.nombre,{ font_face: 'Arial', font_size: 14 });
                   header.addLineBreak();
                   header.addText("Autor:"+report.User.nombre,{ font_face: 'Arial', font_size: 14 });
                   header.addLineBreak();
                   header.addText("Fecha:"+getCurrentDate(),{ font_face: 'Arial', font_size: 14 });
                   header.addLineBreak();
                    for (var i = 0; i < obs.length; i++)
                    {
                      var pObj = docx.createP ();
                      pObj.options.align = 'center';
                      console.log("A;adiendo observacion:"+obs[i].texto);
                      console.log("Imagenes:"+obs[i].images.length);
                      for (var j = 0; j < obs[i].images.length; j++)
                      {
                        pObj.addImage(path.resolve(nodePath, obs[i].images[j].direccion.substring(1)), { cx: 250, cy: 350});
                      }
                      pObj.addLineBreak();
                      pObj.addText(obs[i].texto,{ font_face: 'Arial', font_size: 14 });
                      pObj.addLineBreak();
                      if((i+1) % 2 == 0)
                        docx.putPageBreak();
                    }
                    var outDir = 'storage/apps/'+report.aplicacion+'/'+report.id+'/'+report.nombre+'.docx';
                    var out =  fs.createWriteStream (nodePath+outDir.replace(/\s/g,''));
                    docx.generate(out);
                    callback(outDir.replace(/\s/g,''));
                 }).catch((error) =>
                 {
                   console.log("Publish Report Error:", error);
                   callback(null);
                 });

  }

}

function getCurrentDate()
{
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!

  var yyyy = today.getFullYear();
  if(dd<10){
    dd='0'+dd;
  }
  if(mm<10){
    mm='0'+mm;
  }
  var today = dd+'/'+mm+'/'+yyyy;
  return today;
}
