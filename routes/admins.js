const express = require('express');
const router = express.Router();
const adminCtrl = require('../controller/admin');
const bcrypt = require("bcrypt");
const verify=require('../helper/common');
const jwt=require('jsonwebtoken');

//Admin Register
router.post('/v1/siginup',verify.verifyStaticToken, verify.verifyapp, (req,res)=>{

    jwt.verify(req.statictoken,process.env.StaticTokenKey,(err,authData)=>{
        if(err){
            res.status(401).send({success:false,message:"Unauthorized Token"});     
        }else{
                if(req.body.Name==''||req.body.Name==undefined){
                   res.status(400).send({success:false,message:"Name  is required!"})
                }else if(req.body.MobileNo==''||req.body.MobileNo==undefined){
                   res.status(400).send({success:false,message:"Mobile No is required!"})
                }
               else if(!verify.phonenumber(req.body.MobileNo)){
                  res.status(400).send({success:false,message:"Mobile No is Invalid!"})
               }
                else if(req.body.Email==''||req.body.Email==undefined){
                   res.status(400).send({success:false,message:"Email is required!"})
                }
                else if(!verify.validate(req.body.Email)){
                  res.status(400).send({success:false,message:"Invalid Email ID, Please Enter Valid Email!!!"})
               }
                else if(req.body.Password==''||req.body.Password==undefined){
                   res.status(400).send({success:false,message:"Password is required!"})
                }
                else if(req.body.Password.length <= 5){
                  res.status(400).send({success:false,message:"Password is minimum 6 digit!"})
               }
               
                else{
               
                (async () => {
                     let obj={...req.body}
                    
                     const salt = await bcrypt.genSalt(10);
                     obj.Password = await bcrypt.hash(obj.Password, salt);
                     adminCtrl.addAdmin(obj,(result)=>{
                        res.status(201).send({success:false,message:result})
                     })
                    
                  })();
                   
                  
                } 
        }
    });
});
//Admin Login
router.post('/v1/login',verify.verifyStaticToken, verify.verifyapp, (req,res)=>{

   jwt.verify(req.statictoken,process.env.StaticTokenKey,(err,authData)=>{
       if(err){
           res.status(401).send({success:false,message:"Unauthorized Token"});     
       }else{
               if(req.body.Email==''||req.body.Email==undefined){
                  res.status(400).send({success:false,message:"Email is required!"})
               }
               else if(!verify.validate(req.body.Email)){
                 res.status(400).send({success:false,message:"Invalid Email ID, Please Enter Valid Email!!!"})
              }
               else if(req.body.Password==''||req.body.Password==undefined){
                  res.status(400).send({success:false,message:"Password is required!"})
               }          
               else{            
                    let obj={...req.body}
 
                    adminCtrl.login(obj,(result)=>{
                     if(result==1){
                        res.status(401).json({success:false,message:"User does not exist"});
                     } 
                     if(result==2){
                        res.status(401).json({success:false,message:"User deactivate!!"});
                     }
                     else{                  
                        (async () => {                     
                        const validPassword = await bcrypt.compare(obj.Password, result.Password);
                        if (validPassword) {
                           let data= {
                              Name: result.Name,
                              MobileNo: result.MobileNo,
                              Photo: "NA",
                              Email: result.Email , 
                              Status: result.Status, 
                             }
                             jwt.sign(data, process.env.JWTTokenKey,(err,token)=>{ 
                              if(err) throw err;
                              else{
                                  adminCtrl.updateLoginStatus(1,obj.Email,results=>{
                                      res.setHeader('Authorization','Bearer '+token,'Content-Type', 'application/json');
                                      res.status(200).send({ success:true,message: 'Successfully Login!',data});
                                    
                                  });                                       
                              }                                   
                           });        
                         
                        } else {
                          res.status(400).json({success:false,message:"Invalid Password!"});
                        }
                     
                    })();
                   
                  } 
                  });
               }
            }
         });
});
//Admin Logout
router.get('/v1/logout', verify.token,verify.verifyapp,(req, res)=>{
   jwt.verify(req.token,process.env.JWTTokenKey,(err,authData)=>{
     if(err){
         res.status(401).send({success:false,message:"Unauthorized Token"});
      
     }else{
     
           adminCtrl.blacklistSelectToken(req.token,result=>{
               if(result==undefined || result==null){
                   adminCtrl.blacklistToken(req.token,resData=>{
                       adminCtrl.updateLoginStatus(0,authData.Email,results=>{
                       res.status(200).send({success:true,message:"Logged out Successfully"});
                       });
                   });
               }else{
                   res.status(401).send({success:false,message:"You are already Logout!!"});
               }
           });
         }
   });
 });
 


module.exports = router;
