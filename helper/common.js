
const db = require('../DBConnection'); 
const jwt=require('jsonwebtoken');
//Format of token

module.exports.blacklisttoken=function(req,res,next){
   
        var sql = 'SELECT * from blacklists WHERE jwt_token='+db.escape(req.tokeninner);
        db.query(sql,function (error, results) {
            if(error)throw err;
            if(results[0]==undefined){
                next(); 
            }else{ 
             res.status(401).send({success:false, message:"Invalid token",logoutstatus:true });
            }
        });
      
    }


//Format of token

module.exports.token=function(req,res,next){
    //Get auth header value
    //console.log(req.headers['authorization']);

    const bearerHeader=req.headers['authorization'];
  //  console.log(bearerHeader);
    //check if bearer is undefined
    if(typeof bearerHeader!=='undefined'){
       //split at the space
      
       const bearer=bearerHeader.split(' ');
       //Get Token from array
       const bearerToken=bearer[1];
       //Set the token
      // console.log(bearerToken);
       req.token=bearerToken;
       //Next middleware
       next();
    }else{
       
        res.sendStatus(403);
    }
}
module.exports.tokeninner=function(req,res,next){
    //Get auth header value
    //console.log(req.headers['authorization']);
  
    const bearerHeader=req.headers['x-token'];
   
    //check if bearer is undefined
    if(typeof bearerHeader!=='undefined'){
       //split at the space
     
       const bearer=bearerHeader.split(' ');
       //Get Token from array
       const bearerToken=bearer[1];
       //Set the token
      // console.log(bearerToken);
       req.tokeninner=bearerToken;
       //Next middleware
       next();
    }else{
       
        res.sendStatus(403);
    }
}


module.exports.apikey=function(req,res,next){
    //Get auth header value
    const bearerHeader=req.headers['x-api-key'];
  
    //check if bearer is undefined
    if(typeof bearerHeader!=='undefined'){
       //split at the space
       const apikey=bearerHeader.split(' ');
       //Get Token from array
       const apiToken=apikey[0];
       //Set the token
       
       db.query("SELECT * from platformuser WHERE apikey="+db.escape(apiToken),function(error, results){
           if(error) throw err;
           else{  
           if(results.length==1){
            jwt.verify(req.tokeninner,process.env.JWTTokenKey,(err,authData)=>{   
                if(err){
                    res.status(401).send({success:false,message:"Unauthorized Token"});     
                 }
                 else{     
                    if(authData.Email===results[0].email){
                        next(); 
                    }else{
                        res.status(403).send({success:false, message:"Api-key is Invalid" });
                    }
                 }

                });

           }  
           else{ 
            res.status(401).send({success:false, message:"Api-key is Invalid" });
           }
        }
       
    });

    
    }else{   
        res.status(403).send({success:false,message:"Api key is required!!!"})
    }
}
//Format of token

module.exports.verifyStaticToken=function(req,res,next){
    //Get auth header value

    const bearerHeader=req.headers['authorization'];
    //check if bearer is undefined
    if(typeof bearerHeader!=='undefined'){
       //split at the space
       const bearer=bearerHeader.split(' ');
       //Get Token from array
       const bearerToken=bearer[1];
       //Set the token
       req.statictoken=bearerToken;
     
       //Next middleware
       next();
    }else{
        res.sendStatus(403);
    }
}


module.exports.StaticToken=function(req,res,next){
    //Get auth header value

    const bearerHeader=req.headers['x-authorization'];
    //check if bearer is undefined
    if(typeof bearerHeader!=='undefined'){
       //split at the space
       const bearer=bearerHeader.split(' ');
       //Get Token from array
       const bearerToken=bearer[1];
       //Set the token
       req.statictokennew=bearerToken;
      // console.log(req.statictokennew);
       db.query("SELECT * from platformuser WHERE authtoken="+db.escape(bearerToken),function(error, results){
        if(error) throw err;
        else{  
        if(results.length==1){
         jwt.verify(req.statictokennew,process.env.JWTTokenKey,(err,authData)=>{   
             if(err){
            
              res.json({success:false,message:"Unauthorized Token"});     
              }
              else{     
                 
                 if(authData.email===results[0].email){
                     next(); 
                 }else{ 
                    res.send({success:false, message:"Auth Token is Invalid" });
                 }
              }

             });

        }  
        else{ 
         res.send({success:false, message:"Auth Token is Invalid" });
       
        }
     }
    
 });

    }else{
        res.sendStatus(403);
    }
}




module.exports.verifyapp=async function(req,res,next){
    //Get auth header value

    const appHeader=req.headers['x-access-app'];
    //check if bearer is undefined
    if(typeof appHeader!=='undefined'){
       //split at the space
       const axeed=appHeader.split(' ');
       //Get Token from array
       const bearerToken=axeed[1];
       //Set the token
      // console.log(bearerToken);
       if(bearerToken=="PremMaurya"){
        req.apptoken= bearerToken;
        next();
       }else{
        res.status(422).send({success:false,message:"App Name is is Invalid!!!"}) 
       }
      
     
       //Next middleware
     
    }else{
        res.status(422).send({success:false,message:"App Name is required!!!"})
    }
}


module.exports.validate = (email) => {
    const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i
  
    return expression.test(String(email).toLowerCase())
  }
  module.exports.phonenumber=(inputtxt)=>
{
  var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  if(inputtxt.match(phoneno))
     {
	   return true;
	 }
   else
     {
	  // console.log("Not a valid Phone Number");
	   return false;
     }
}