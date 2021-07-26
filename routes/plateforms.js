const express = require('express');
const router = express.Router();
const plateform = require('../controller/plateform');
const bcrypt = require("bcrypt");
const verify=require('../helper/common');
const jwt=require('jsonwebtoken');
const adminCtrl = require('../controller/admin');
//Admin Register
router.post('/v1/create-plateform', (req,res)=>{


                if(req.body.firstname==''||req.body.firstname==undefined){
                   res.status(400).send({success:false,message:"Name  is required!"})
                }
                else if(req.body.mobileno==''||req.body.mobileno==undefined){
                   res.status(400).send({success:false,message:"Mobile No is required!"})
                }
               else if(!verify.phonenumber(req.body.mobileno)){
                  res.status(400).send({success:false,message:"Mobile No is Invalid!"})
               }
                else if(req.body.email==''||req.body.email==undefined){
                   res.status(400).send({success:false,message:"Email is required!"})
                }
                else if(!verify.validate(req.body.email)){
                  res.status(400).send({success:false,message:"Invalid Email ID, Please Enter Valid Email!!!"})
               }
                else if(req.body.userpassword==''||req.body.userpassword==undefined){
                   res.status(400).send({success:false,message:"Password is required!"})
                }
                else if(req.body.userpassword.length <= 5){
                  res.status(400).send({success:false,message:"Password is minimum 6 digit!"})
               }
               
                else{
               
                (async () => {
                     let obj={...req.body}
                    
                     const salt = await bcrypt.genSalt(10);
                     obj.userpassword = await bcrypt.hash(obj.userpassword, salt);

                     plateform.existemail(obj,(result)=>{
                       
                        if(result==2){
                          // console.log(1);
                           res.status(200).send({success:false,message:"Email Id is already Used.. Please enter another email id!!"});
                        }else{
                        //   console.log(process.env.JWTTokenKey)
                          
                     jwt.sign({email:obj.email,name:obj.firstname,mobileno:obj.mobileno},process.env.JWTTokenKey,(err,token)=>{ 
                        if(err) throw err;
                        else{
                          // console.log(token);
                                  obj.authtoken=token;
                                //  console.log(obj);
                                  plateform.addPlateForm(obj,(result)=>{
                                      res.status(201).send({success:true,message:result});

                                  })
                             }
                      });
                   }
               });
   
                    
            })();
                   
                  
                } 
    
});

router.get('/v1/list-plateform',(req,res)=>{

         plateform.AllPlateForm((result)=>{
             res.status(200).send({success:true,message:result})
 })

});


router.post('/v1/generate-apikey', (req,res)=>{


    if(req.body.id==''||req.body.id==undefined){
       res.status(400).send({success:false,message:"Something is wrong"})
    }
    else if(req.body.apikey==''||req.body.apikey==undefined){
       res.status(400).send({success:false,message:"api-key  is required!"})
    }
    else if(req.body.setlimit==''||req.body.setlimit==undefined){
       res.status(400).send({success:false,message:"Limit is required!"})
    }

    else if(req.body.apikeystatus==''||req.body.apikeystatus==undefined){
       res.status(400).send({success:false,message:"api status is required!"})
    }
   
   
    else{
   let obj={...req.body};
         plateform.generateKey(obj,(result)=>{
             
             if(result===1){
                res.status(400).send({success:false,message:"Invalid User Id"})
             }else{
                res.status(201).send({success:true,message:result})
             }
           
         })
        
    
      
    } 

});
router.post('/v1/set-limit', (req,res)=>{


   if(req.body.id==''||req.body.id==undefined){
      res.status(400).send({success:false,message:"Something is wrong"})
   }
   else if(req.body.setlimit==''||req.body.setlimit==undefined){
      res.status(400).send({success:false,message:"Limit is required!"})
   }

  
   else{
  let obj={...req.body};
        plateform.setlimit(obj,(result)=>{
            
            if(result===1){
               res.status(400).send({success:false,message:"Invalid User Id"})
            }else{
               res.status(201).send({success:true,message:result})
            }
          
        })
       
   
     
   } 

});

router.post('/v1/get-user',verify.tokeninner, verify.verifyapp, verify.apikey,verify.blacklisttoken,(req,res)=>{   

   jwt.verify(req.tokeninner,process.env.JWTTokenKey,(err,authData)=>{   
      if(err){
          res.status(401).send({success:false,message:"Unauthorized Token"});     
       }
       else{
  
         if(req.body.userid==''||req.body.userid==undefined){
            res.status(400).send({success:false,message:"Something is wrong"})
         }
         else{
                obj={...req.body};
                 plateform.getPlateForm(obj,(result)=>{
                  
                  if(result===1){
                     res.status(400).send({success:false,message:"Invalid User Id"})
                  }else{
                     res.status(201).send({success:true,message:result})
                  }
               
            });
         } 
      }
   });
});

router.post('/v1/status-update', (req,res)=>{

   if(req.body.id==''||req.body.id==undefined){
      res.status(400).send({success:false,message:"Something is wrong"})
   }
   else{
  let obj={...req.body};
        plateform.userstatusupdate(obj,(result)=>{    
            if(result===1){
               res.status(400).send({success:false,message:"Invalid User Id"})
            }else{
               res.status(201).send({success:true,message:result})
            }
          
        })
       
   
     
   } 

});


//Admin Login
router.post('/v1/platform-login',verify.StaticToken, verify.verifyapp,(req,res)=>{
  
   jwt.verify(req.statictokennew,process.env.JWTTokenKey,(err,authData)=>{   
     if(err){
        //console.log("xx")
         res.status(401).send({success:false,message:"Unauthorized Token"});  
      }
      else{

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
         
            plateform.login(obj,(result)=>{
             if(result==1){
                res.status(401).json({success:false,message:"User does not exist"});
             } 
             if(result==2){
                res.status(401).json({success:false,message:"User deactivate!!"});
             }
             else{    
              
                (async () => {                     
                  const validPassword = await bcrypt.compare(obj.Password, result.userpassword);
                 
                if (validPassword) {
                   let data= {
                      Id:result.id,
                      Name: result.firstname,
                      MobileNo: result.mobileno,
                      Photo: "NA",
                      Email: result.email , 
                      Status: result.userstatus, 
                      token:""
                     }
                     jwt.sign(data, process.env.JWTTokenKey,(err,token)=>{ 
                      if(err) throw err;
                      else{
                        data.token='Bearer '+token;
                          plateform.updateLoginStatus(1,data.Email,results=>{ 
                              res.setHeader('Authorization','Bearer '+token,'Content-Type', 'application/json');
                              res.status(200).send({ success:true,message: 'Successfully Login!',data});
                      
                         });                                       
                      }                                   
                   });        
                 
                } else {
                  res.status(400).send({success:false,message:"Invalid Password!"});
                }
               })();
            
           
             } 
           });
        }
      }
      
   });
});
//Admin Logout
router.get('/v1/platform-logout', verify.tokeninner, verify.verifyapp,verify.blacklisttoken,(req, res)=>{
   jwt.verify(req.tokeninner,process.env.JWTTokenKey,(err,authData)=>{
     if(err){
         res.status(401).send({success:false,message:"Unauthorized Token"});
      
     }else{
     
           adminCtrl.blacklistSelectToken(req.tokeninner,result=>{
               if(result==undefined || result==null){
                   adminCtrl.blacklistToken(req.tokeninner,resData=>{
                     plateform.updateLoginStatus(0,authData.Email,results=>{
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
