'use strict';
const PORT = 1234;
var os = require('os');
var ifaces = os.networkInterfaces();
var express = require('express');
var passport = require('passport');
var app = express();
var fs = require('fs');
var Finder = require('fs-finder');
var bodyParser = require('body-parser')
var server = require('http').createServer(app).listen(PORT);
var io = require('socket.io')(server);
const fileUpload = require('express-fileupload');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var User = require('./models').User;
var LocalStrategy = require('passport-local').Strategy;
var UserController = require('./controllers/User.js');
var SessionPolicies = require('./policies/SessionPolicies');
var localIp;
//var portName = process.argv[2]; // 2do argumento de la llamada!


app.set('superSecret', 'mmm');

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(function(err, req, res, next) { // Acciones en caso de un error inesperado del parseo!
  console.error(err.stack);
  res.status(500).json({success:false, m:"Error Desconocido"});
});

app.use(fileUpload());

//app.use(require('connect-multiparty')()); TODO ¿Para que funciona esto?
app.use(cookieParser());
app.use(session({ secret: 'super-secret' }));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res)
{
  if(!req.user)
    res.sendFile(__dirname + '/public/production/login.html');
  else
    res.sendFile(__dirname + '/public/production/index.html');
});

app.use('/storage',express.static(__dirname +'/storage'));
app.use('/',express.static(__dirname +'/public'));


app.use(SessionPolicies.hasSession);

passport.use(new LocalStrategy(function(username, password, done)
{
    UserController.authStrategy(username, password,done);
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done)
{
   User.findOne({where:{ id: id }}).then(function(user) {
      done(null, user);
    });
});

let dirs = Finder.from('C:/Users/').findDirectories('*Google Drive');
for (var i = 0; i < dirs.length; i++)
{
  //console.log("INDEX OF:", dirs[i].indexOf("Drive"), " VS LENGTH:", dirs[i].length);
  if( ( dirs[i].indexOf("Drive") + 5) >= dirs[i].length )
  {
    global.drivePath = dirs[i];
    console.log("DRIVE PATH:", global.drivePath);
    break;
  }
}

//Esto carga todas las rutas dinamicamente!
fs.readdirSync('./routes').forEach(function (file)
{
  if(file.substr(-3) == '.js')
  {
      require('./routes/' + file)(app);
  }
});

io.on('connection', function (socket)
{
  console.log("Connected!");
  socket.emit('happy testing', { url: "http://"+localIp+":"+PORT }); // 1234 es el PUERTO!
  socket.on('disconnect',function () {
    console.log('desconectado!');
  });
});


//TODO mover esto a otro archivo ??
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
      console.log(ifname, iface.address);
      localIp = iface.address;
    }
    ++alias;
  });
});
