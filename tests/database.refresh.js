const db = require("../database");

let count = 0

console.log("****************************************")
console.log("Deleting data...")  

const sql = 'DELETE FROM votes'

db.run(sql, [], function(err){
    if(err) throw err

    console.log("Votes: All data deleted")
    count++

    const sql = 'DELETE FROM questions'

    db.run(sql, [], function(err){
        if(err) throw err
    
        console.log("Questions: All data deleted")
        count++
    
        const sql = 'DELETE FROM attendees'
    
        db.run(sql, [], function(err){
            if(err) throw err
        
            console.log("Attendees: All data deleted")
            count++

            const sql = 'DELETE FROM events'
    
            db.run(sql, [], function(err){
                if(err) throw err
        
                console.log("Events: All data deleted")
                count++
        
                const sql = 'DELETE FROM users'
        
                db.run(sql, [], function(err){
                    if(err) throw err
                
                    console.log("Users: All data deleted")
                    count++

                    const sql = "UPDATE `sqlite_sequence` SET `seq` = 0 WHERE `name` = 'users'";

                    db.run(sql, [], function(err){
                        if(err) throw err

                        console.log("Users: reset ID counter")
                        count++

                        const sql = "UPDATE `sqlite_sequence` SET `seq` = 0 WHERE `name` = 'events'";
                        db.run(sql, [], function(err){
                            if(err) throw err

                            console.log("Events: reset ID counter")
                            count++

                            const sql = "UPDATE `sqlite_sequence` SET `seq` = 0 WHERE `name` = 'questions'";
                            db.run(sql, [], function(err){
                                if(err) throw err

                                console.log("Questions: reset ID counter")
                                count++

                                console.log("All data deleted from all tables") 
                                console.log("****************************************")
                            })
                        })
                    })
                    
                    
                })
            })
        })
    })
})