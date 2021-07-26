const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

// Init App
const app = express();
app.set('deviceKey', 'PremMaurya');
const http = require('http').Server(app); 
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"]
  }
});
require("./DBConnection");

//Route Define
var admin = require('./routes/admins');
var gamebhav = require('./routes/gamesbhav')(io);
var plateforms = require('./routes/plateforms');
var match = require('./routes/match');

app.use(bodyParser.json({limit: '500000mb'}));
app.use(bodyParser.urlencoded({limit: '500000mb', extended: true, parameterLimit: 10000000000}));
//app.use(require(`${servers}/www.${domain}`)());
// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next)=>{

  const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
       res.setHeader('Access-Control-Allow-Origin', origin);
  }

  //res.writeHead(statusCode)
  //res.header('Access-Control-Allow-Origin','*');
  res.header('Access-Control-Allow-Headers','Origin, X-Requested-with, Accept, Authorization, authorization');
  res.header('Access-Control-Allow-Methods','OPTIONS,GET, POST, PUT, DELETE');
   next();
});

 app.use(cors({
    exposedHeaders: ['Authorization', 'authorization','x-api-key','x-token','x-authorization','x-Authorization',],
  }));
  //app.use(methodOverride());

app.use('/api', admin);
app.use('/api', gamebhav);
app.use('/api', plateforms);
app.use('/api', match);

// io.on('connection', function(socket) {
//   console.log('A user connected');
//     // socket.on("dustbinpickup",(page,pagenumber,id)=>{
//     //     getAllData(page,pagenumber,socket,id);            
//     // });
//   //Whenever someone disconnects this piece of code executed
//   socket.on('disconnect', function () {
//      console.log('A user disconnected');
//   });

// });



http.listen(3002,(err)=>{
    if(err) throw err;
      console.log('Listing To port http://localhost:3002');
})
  