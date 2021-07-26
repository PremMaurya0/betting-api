//include the model
const db = require('../DBConnection'); 

  //create class
var plateform = {
   
     addPlateForm: function(obj,callback){
      
        db.query('SELECT * from platformuser where Email='+db.escape(obj.Email), function (error, results) {
            if (error) {
            callback(error,null);
            }
            else{
        
          if(results.length==0){
                var sqlquery="INSERT INTO platformuser(`firstname`,`lastname`,`email`,`mobileno`,`photo`,`userpassword`,`setlimit`,`apikey`,`expapikey`,`apikeystatus`,`setlimitstatus`,`userstatus`,`loginstatus`,`authtoken`) VALUES ('"+obj.firstname+"','"+obj.lastname+"','"+obj.email+"','"+obj.mobileno+"','NA','"+obj.userpassword+"','"+0+"','NA','NA','"+0+"','"+0+"','"+1+"','"+0+"','"+obj.authtoken+"')";
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

    existemail: function(obj,callback){
      
      db.query('SELECT * from platformuser where Email='+db.escape(obj.Email), function (error, results) {
          if (error) {
          callback(error,null);
          }
          else{
            if(results.length==0){
              callback(1,null); 
            }else{
              callback(2,null); 
            }
         
        }

     
      });

  },

  
    AllPlateForm: function(callback){    
        db.query('SELECT * from platformuser', function (error, results) {
            if (error) {
            callback(error,null);
            }
            else{     
          if(results.length==0){
              callback(1,null);
               
          }else{
            callback(results,null); 
          }
        }
        });

    },
    generateKey: function(obj,callback){    
        var sql = "UPDATE platformuser SET setlimit='"+obj.setlimit+"',apikey = '"+obj.apikey+"',	apikeystatus='"+obj.apikeystatus+"' WHERE id ="+db.escape(obj.id);
        db.query(sql, function (error, results) {
            if (error) {
            callback(error,null);
            }
            else{     
          if(results.length==0){
              callback(1,null);
               
          }else{
            callback("Api key Generated successfully!!",null); 
          }
        }
        });

    },
    setlimit: function(obj,callback){    
      var sql = "UPDATE platformuser SET setlimit='"+obj.setlimit+"',	apikeystatus='"+obj.apikeystatus+"' WHERE id ="+db.escape(obj.id);
      db.query(sql, function (error, results) {
          if (error) {
          callback(error,null);
          }
          else{     
        if(results.length==0){
            callback(1,null);
             
        }else{
          callback("Limit Added Successfully!!",null); 
        }
      }
      });

  },
  getPlateForm: function(obj,callback){    
    db.query('SELECT * from platformuser where id='+db.escape(obj.userid), function (error, results) {
        if (error) {
        callback(error,null);
        }
        else{     
      if(results.length==0){
          callback(1,null);
           
      }else{
        callback(results[0],null); 
      }
    }
    });

},
userstatusupdate: function(obj,callback){    
  var sql = "UPDATE platformuser SET userstatus='"+obj.userstatus+"' WHERE id ="+db.escape(obj.id);
  db.query(sql, function (error, results) {
      if (error) {
      callback(error,null);
      }
      else{     
    if(results.length==0){
        callback(1,null);
         
    }else{
      callback("Status Change Successfully!!",null); 
    }
  }
  });

},

login: function (obj,callback) {
       
  db.query('SELECT * from platformuser where email='+db.escape(obj.Email), function (error, results) {
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
  //console.log(Email);
  var sql = "UPDATE platformuser SET loginstatus='"+status+"',updateddate = CURRENT_TIMESTAMP() WHERE email ="+db.escape(Email);
  db.query(sql,function (error, results) {
      if (error) {
      callback(error,null);
      }
      else{
       // console.log(results);
      callback(1,null);
  }
  });
  //db.end();
},


}

module.exports = plateform;