//include the model
const db = require('../DBConnection'); 

  //create class
var matches = {
   
     creatematch: function(obj,callback){
   
        db.query('SELECT * from matches where securecode='+db.escape(obj.securecode), function (error, results) {
            if (error) {
            callback(error,null);
            }
            else{
        
          if(results.length==0){
                var sqlquery="INSERT INTO matches(`securecode`,`sportname`,`gametype`,`matchname`,`venue`,`matchstatus`,`matchdate`,`matchtime`) VALUES ('"+obj.securecode+"','"+obj.sportname+"','"+obj.gametype+"','"+obj.matchname+"','"+obj.venue+"','"+obj.matchstatus+"','"+obj.matchdate+"','"+obj.matchtime+"')";
                db.query(sqlquery, function (error,result) {
                    if (error) {
                    callback(error,null);
                    }
                    else{    

                      var sqlquery="INSERT INTO gamebhav(`matchid`,`AddValue`,`actionvalue`,`bhav1`,`bhav2`,`gamestatus`,`gamestatusText`,`othercheckbox`,`suspendall`,`suspendother`) VALUES ('"+obj.securecode+"','0','0','0','0','0','NA','0','0','0')";
                      db.query(sqlquery, function (error,result) {
                          if (error) {
                           callback(error,null);
                         }
                        else{    
                      callback('1 record inserted',null);
                     }
                });
                  //  callback('1 record inserted',null);


                }
                 });
          }else{
            callback("Secure Code is already Used.. Please enter another Secure Code!!",null); 
          }

        }
        });

    },
    allMatch: function(callback){    
        db.query('SELECT * from matches', function (error, results) {
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
    matchmapped: function(obj,callback){ 

      db.query('SELECT * from platformuser where email='+db.escape(obj.userid), function (error, plateform) {
        if (error) {
        callback(error,null);
        }
        else{
          
      db.query('SELECT * from mapped where matchid='+db.escape(obj.matchid)+' and userid='+db.escape(plateform[0].id), function (error, results) {
        if (error) {
        callback(error,null);
        }
        else{
    
      if(results.length==0){
        
       
             var sqlquery="INSERT INTO mapped(`matchid`,`userid`,`matchstatus`) VALUES ('"+obj.matchid+"','"+plateform[0].id+"','1')";
                  db.query(sqlquery, function (error,result) {
                      if (error) {
                       callback(error,null);
                     }
                    else{    
                  callback('1 record inserted',null);
                 }
            });
      

      }else{
        callback("This User and match Already Mapped",null); 
      }
  
    }
  })
   
    }
    });
  },
  allUserMatch: function(obj,callback){   

    db.query("SELECT * FROM matches WHERE securecode IN (select matchid from mapped  WHERE userid="+db.escape(obj.userid)+")", function (error, results) {
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
allUserActiveMatch: function(obj,callback){   
    
  db.query("SELECT * FROM matches WHERE securecode AND matchstatus=0 IN (select matchid from mapped  WHERE userid="+db.escape(obj.userid)+")", function (error, results) {
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
MatchDetails: function(obj,callback){    
  db.query('SELECT * from matches where securecode='+db.escape(obj.id), function (error, results) {
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
matchstatusupdate: function(obj,callback){    
  var sql = "UPDATE matches SET matchstatus='"+obj.matchstatus+"' WHERE id ="+db.escape(obj.id);
  db.query(sql, function (error, results) {
      if (error) {
      callback(error,null);
      }
      else{     
    if(results.length==0){
        callback(1,null);
         
    }else{
      callback("Match Status Change Successfully!!",null); 
    }
  }
  });

},

mappedstatusupdate: function(obj,callback){    
 // console.log(obj);
  var sql = "UPDATE mapped SET matchstatus='"+obj.matchstatus+"' WHERE userid="+db.escape(obj.id)+" and matchid="+db.escape(obj.matchid);
  db.query(sql, function (error, results) {
      if (error) {
      callback(error,null);
      }
      else{     
    if(results.length==0){
        callback(1,null);
         
    }else{
      callback("Match Status Change Successfully!!",null); 
    }
  }
  });

},

}

module.exports = matches;