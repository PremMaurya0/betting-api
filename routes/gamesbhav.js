const express = require('express');
const router = express.Router();
const gameBhavCtrl = require('../controller/gamebhav');
const verify=require('../helper/common');
const jwt=require('jsonwebtoken');

module.exports=function(io){

router.post('/v1/createbhav', (req,res)=>{
   // console.log(req.body)
    let obj={...req.body}
     gameBhavCtrl.createbhav(obj,(result)=>{
        res.status(200).send({success:true,message:result})
     })
     
});

router.post('/v1/getbhav', (req,res)=>{
   // console.log(req.body.bhavID)
    let obj={...req.body}
    gameBhavCtrl.fetchbhav(obj,(result)=>{
        res.status(200).send({success:true,message:result})
     })
  
                  
});

router.post('/v1/updatebhav', (req,res)=>{
    // console.log(req.body)
     let obj={...req.body}
      gameBhavCtrl.updatebhav(obj,(result)=>{
         res.status(200).send({success:true,message:result})
      })
      
 });

router.get('/v1/getdata', (req,res)=>{
         res.status(200).send({success:true,message:"Hello World!"});   
 });


 let interval;

 io.on("connection", (socket) => {
  // console.log(socket.id)
   if (interval) {
     clearInterval(interval);
   }
   interval = setInterval(() => getApiAndEmit(socket), 100);
   socket.on("disconnect", () => {
   //  console.log("Client disconnected");
     clearInterval(interval);
   });
 });
 
 const getApiAndEmit = socket => {
  //  console.log(socket.handshake.query['foo']);
  //  console.log(socket.handshake.query['userid']);
    gameBhavCtrl.fetchbhav({bhavID:socket.handshake.query['foo']},result=>{   
      io.sockets.emit('event', result)
    });
 };


 router.post('/v1/matchbhav', verify.tokeninner, verify.verifyapp,verify.blacklisttoken, (req,res)=>{
  jwt.verify(req.tokeninner,process.env.JWTTokenKey,(err,authData)=>{   
    if(err){
        res.status(401).send({success:false,message:"Unauthorized Token"});     
     }
     else{
      if(req.body.bhavID==''||req.body.bhavID==undefined){
        res.status(400).send({success:false,message:"Something is wrong"})
     }
     else{

   let obj={...req.body}
    gameBhavCtrl.fetchbhav(obj,(result)=>{
       res.status(200).send({success:true,message:result})
     })


    }
    }
  });
    
});
 


return router;

}
