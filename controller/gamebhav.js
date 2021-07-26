//include the model
const db = require('../DBConnection'); 

  //create class
var admins = {
   
     createbhav: function(obj,callback){
            console.log(obj);
          var sqlquery="INSERT INTO gamebhav(`AddValue`,`matchid`,`actionvalue`,`bhav1`,`bhav2`,`back`,`lay`,`gamestatus`,`gamestatusText`,`othercheckbox`,`suspendall`,`suspendother`) VALUES ('"+obj.AddValue+"','"+obj.actionvalue+"','"+obj.bahv1+"','"+obj.bhav2+"','"+obj.back+"','"+obj.lay+"','"+obj.gamestatus+"','"+obj.gamestatusText+"','"+obj.othercheckbox+"','"+obj.suspendall+"','"+obj.suspendother+"')";
            db.query(sqlquery, function (error,result) {
                if (error) {
                 callback(error,null);
               }
              else{    
            callback('1 record inserted',null);
           }
      });
  
    },
    fetchbhav: function (obj,callback) {
     //  console.log(obj.bhavID)
        db.query('SELECT * from gamebhav where matchid='+db.escape(obj.bhavID), function (error, results) {
            if (error) {
            callback(error,null);
            }
            else{             
                if(results.length==1){        
                    if(results[0].Status==0){
                        callback(2,null);
                     }else{
                       //console.log(results[0]);
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

    updatebhav: function (obj,callback) {
        console.log(obj);
        var sql = "UPDATE gamebhav SET AddValue='"+obj.AddValue+"',actionvalue='"+obj.actionvalue+"',bhav1='"+obj.bhav1+"',bhav2='"+obj.bhav2+"', back='"+obj.back+"',lay='"+obj.lay+"',gamestatus='"+obj.gamestatus+"',gamestatusText='"+obj.gamestatusText+"'  WHERE matchid ="+db.escape(obj.matchid);
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

}

module.exports = admins;