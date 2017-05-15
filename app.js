var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var server = require('http').createServer(app).listen(1234);
const fileUpload = require('express-fileupload');
//var portName = process.argv[2]; // 2do argumento de la llamada!


app.set('superSecret', 'mmm');

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(function(err, req, res, next) { // Acciones en caso de un error inesperado del parseo!
  console.error(err.stack);
  res.status(500).json({success:"false", m:"Error general!"});
});

app.use(fileUpload());
app.get('/', function(req, res)
{
  res.sendFile(__dirname + '/index.html');
});

app.post('/upload', function(req, res)
{

  if (!req.files)
    return res.status(400).send('No files were uploaded.');

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.file1;

  console.log(req.files);

  let path = 'C:/Users/user/Google\ Drive/'+sampleFile.name;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(path, function(err) {
    if (err)
      return res.status(500).send(err);

    res.status(200).json({success:true});
  });
});
