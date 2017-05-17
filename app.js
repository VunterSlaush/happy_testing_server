'use strict';
const PORT = 1234;
var os = require('os');
var ifaces = os.networkInterfaces();
var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser')
var server = require('http').createServer(app).listen(PORT);
var io = require('socket.io')(server);
const fileUpload = require('express-fileupload');

var localIp;
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

io.on('connection', function (socket)
{
  console.log("Connected!");
  socket.emit('happy testing', { url: "http://"+localIp+":"+PORT }); // 1234 es el PUERTO!
  socket.on('disconnect',function () {
    console.log('desconectado!');
  });
});


//Esto carga todas las rutas dinamicamente!
fs.readdirSync('./routes').forEach(function (file)
{
  if(file.substr(-3) == '.js')
  {
      require('./routes/' + file)(app);
  }
});


app.post('/upload', function(req, res)
{

  if (!req.files)
    return res.status(400).send('No files were uploaded.');

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


Object.keys(ifaces).forEach(function (ifname)
{
  var alias = 0;

  ifaces[ifname].forEach(function (iface)
  {
    if ('IPv4' !== iface.family || iface.internal !== false)
      return;

    if (alias >= 1)
    {
      console.log(ifname + ':' + alias, iface.address);
      localIp = iface.address;
    }
    else
    {
      // this interface has only one ipv4 adress
      console.log(ifname, iface.address);
      localIp = iface.address;
    }
    ++alias;
  });
});
