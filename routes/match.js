const express = require('express');
const router = express.Router();
const matches = require('../controller/matches');
const bcrypt = require("bcrypt");
const verify=require('../helper/common');
const jwt=require('jsonwebtoken');

//Admin Register
router.post('/v1/create-match', (req,res)=>{

                if(req.body.securecode==''||req.body.securecode==undefined){
                   res.status(400).send({success:false,message:"Secure Code  is required!"})
                }
                else if(req.body.sportname==''||req.body.sportname==undefined){
                   res.status(400).send({success:false,message:"Sport Name is required!"})
                }          
                else if(req.body.gametype==''||req.body.gametype==undefined){
                   res.status(400).send({success:false,message:"Game Type is required!"})
                }
                else if(req.body.matchname==''||req.body.matchname==undefined){
                   res.status(400).send({success:false,message:"Match Name is required!"})
                }
                else if(req.body.venue==''||req.body.venue==undefined){
                    res.status(400).send({success:false,message:"Venue is required!"})
                 }
                 else if(req.body.matchdate==''||req.body.matchdate==undefined){
                    res.status(400).send({success:false,message:"Match Date is required!"})
                 }
                 else if(req.body.matchtime==''||req.body.matchtime==undefined){
                    res.status(400).send({success:false,message:"Match Time is required!"})
                 }
                  
                else{
               let obj={...req.body}
               console.log(obj);
                     matches.creatematch(obj,(result)=>{
                        res.status(201).send({success:true,message:result})
                     })
                }
    
        });

        router.get('/v1/list-match',(req,res)=>{
            
            matches.allMatch((result)=>{
              res.status(200).send({success:true,message:result})
            })

        });
        router.post('/v1/match-mapped',(req,res)=>{
         if(req.body.matchid==''||req.body.matchid==undefined){
            res.status(400).send({success:false,message:"Match id  is required!"})
         }
         else if(req.body.userid==''||req.body.userid==undefined){
            res.status(400).send({success:false,message:"Sport Name is required!"})
         } else{
            let obj={...req.body}
            matches.matchmapped(obj,(result)=>{
               res.status(200).send({success:true,message:result})
             })
         }
         

     });

     router.post('/v1/match-user',verify.tokeninner, verify.verifyapp, verify.apikey,verify.blacklisttoken,(req,res)=>{
       
      jwt.verify(req.tokeninner,process.env.JWTTokenKey,(err,authData)=>{   
         if(err){
             res.status(401).send({success:false,message:"Unauthorized Token"});     
          }
          else{

            if(req.body.userid==''||req.body.userid==undefined){
                  res.status(400).send({success:false,message:"Something is missing!"})
               } else{
                  let obj={...req.body}
               
                  matches.allUserMatch(obj,(result)=>{
                     res.status(200).send({success:true,message:result})
                  })
               }
            }
         });

  });
  router.post('/v1/activematch-user',(req,res)=>{
   if(req.body.userid==''||req.body.userid==undefined){
        res.status(400).send({success:false,message:"Sport Name is required!"})
     } else{
        let obj={...req.body}
        matches.allUserActiveMatch(obj,(result)=>{
           res.status(200).send({success:true,message:result})
         })
     }
     

 });
  router.post('/v1/match-details',verify.tokeninner, verify.verifyapp, verify.apikey,verify.blacklisttoken,(req,res)=>{

   jwt.verify(req.tokeninner,process.env.JWTTokenKey,(err,authData)=>{   
      if(err){
          res.status(401).send({success:false,message:"Unauthorized Token"});     
       }
       else{

   if(req.body.id==''||req.body.id==undefined){
        res.status(400).send({success:false,message:"Sport Name is required!"})
     } else{
        let obj={...req.body}
        matches.MatchDetails(obj,(result)=>{
           res.status(200).send({success:true,message:result})
         })
     }
     
   }
   });

 });

 router.post('/v1/match-status',(req,res)=>{
   if(req.body.id==''||req.body.id==undefined){
        res.status(400).send({success:false,message:"Something is missing!!"})
     } else{
        let obj={...req.body}
        matches.matchstatusupdate(obj,(result)=>{
           res.status(200).send({success:true,message:result})
         })
     }
     

 });


 router.post('/v1/match-mappedstatus', verify.tokeninner, verify.verifyapp, verify.apikey,verify.blacklisttoken,(req,res)=>{

   jwt.verify(req.tokeninner,process.env.JWTTokenKey,(err,authData)=>{   
      if(err){
          res.status(401).send({success:false,message:"Unauthorized Token"});     
       }
       else{

         if(req.body.id==''||req.body.id==undefined){
            res.status(400).send({success:false,message:"User ID is missing!!"})
         } 
         else if(req.body.matchid==''||req.body.matchid==undefined){
            res.status(400).send({success:false,message:"Match Id is missing!!"})
         }
         else{
            let obj={...req.body}
            matches.mappedstatusupdate(obj,(result)=>{
               res.status(200).send({success:true,message:result})
               })
         }
   
   }
});

 });




module.exports = router;
