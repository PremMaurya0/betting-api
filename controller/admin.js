//include the model
const db = require('../DBConnection'); 

  //create class
var admins = {
   
     addAdmin: function(obj,callback){
      
        db.query('SELECT * from users where Email='+db.escape(obj.Email), function (error, results) {
            if (error) {
            callback(error,null);
            }
            else{
        
          if(results.length==0){
                var sqlquery="INSERT INTO users(`Name`,`MobileNo`,`Photo`,`Email`,`Password`,`Status`,`LoginStatus`) VALUES ('"+obj.Name+"','"+obj.MobileNo+"','NA','"+obj.Email+"','"+obj.Password+"','"+1+"','"+0+"')";
                db.query(sqlquery, function (error,result) {
                    if (error) {
                    callback(error,null);
                    }
                    else{    
                    callback('1 record inserted',null);
                }
                 });
          }else{
            callback("Email Id is already Used.. Please enter another email id!!",null); 
          }

        }
        });

    },
    login: function (obj,callback) {
       
        db.query('SELECT * from users where Email='+db.escape(obj.Email), function (error, results) {
            if (error) {
            callback(error,null);
            }
            else{             
                if(results.length==1){        
                    if(results[0].Status==0){
                        callback(2,null);
                     }else{
                        callback(results[0],null);
                         
                     }
                }  
                else{
                    callback(1,null);
                }
        }
    });
         //db.end();
    },

    updateLoginStatus: function (status,Email,callback) {
        var sql = "UPDATE users SET LoginStatus='"+status+"',UpdatedDateTime = CURRENT_TIMESTAMP() WHERE email ="+db.escape(Email);
        db.query(sql,function (error, results) {
            if (error) {
            callback(error,null);
            }
            else{
            callback(results[0],null);
        }
        });
        //db.end();
    },

     blacklistToken:function(token,callback){
        var sql = "INSERT INTO blacklists(`jwt_token`) Values ('"+token+"')";
        db.query(sql,function (error, results) {
            if (error) {
            callback(error,null);
            }
            else{
            callback(`1 row inserted!!`,null);
        }
        });

     },
     blacklistSelectToken:function(token,callback){
        var sql = 'SELECT * from blacklists WHERE jwt_token='+db.escape(token);
        db.query(sql,function (error, results) {
            if (error) {
            callback(error,null);
            }
            else{
            callback(results[0],null);
        }
        });

     }
}

module.exports = admins;