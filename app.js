'use strict';
const PORT = 1234;
var os = require('os');
var ifaces = os.networkInterfaces();
var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var server = require('http').createServer(app).listen(PORT);
var io = require('socket.io')(server);
var models  = require('./models');
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

app.post('/createRandomUser',function (req,res)
{
  models.User.create
  ({
    username: req.body.username,
    password: req.body.password,
    nombre:   req.body.nombre,
  }).then(function(data)
  {
    res.json(data);
  });
});

Object.keys(ifaces).forEach(function (ifname)
{
  var alias = 0;

  ifaces[ifname].forEach(function (iface)
  {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1)
    {
      // this single interface has multiple ipv4 addresses
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
