import { db } from '../firebase';
import moment from 'moment';


export default function recordUpVote(instr, user){
    if (db === null) return () => new Promise(resolve => resolve());
    var today = moment().format('MMDDYYYY');

    // Find out if user already voted on this chart on this day
    var rootRef = db.ref('/votes/' +today+ '/' +instr+ '/');
    rootRef.child('voters').orderByChild('user').equalTo(user).on("value", function(snapshot) {

        console.log(snapshot.val());

        if(snapshot.val()==null){
          // Record the vote
          db.ref('/votes/' +today+ '/' +instr+ '/voters/').push({
            user: user
              }).then(()=>{
               db.ref('/users/'+user+ '/votes/' + today+ '/').push({
                 instrument: instr,
                 vote: 'up'
               }).then(()=>{
                 db.ref('/votes/' +today+ '/' +instr+ '/upVotes').transaction(function(upVotes) {
                   return upVotes + 1
                 });
               });
          });
         }

        snapshot.forEach(function(data) {
            if(data.key==null){
              // Record the vote
              db.ref('/votes/' +today+ '/' +instr+ '/voters/').push({
                user: user
                  }).then(()=>{
                   db.ref('/users/'+user+ '/votes/' + today+ '/').push({
                     instrument: instr,
                     vote: 'up'
                   }).then(()=>{
                     db.ref('/votes/' +today+ '/' +instr+ '/upVotes').transaction(function(upVotes) {
                       return upVotes + 1
                     });
                   });
              });
            } else {
              console.log("This user already voted on this instrument on this day. Change chart state.")
            }
        });
    });

  } // end recordUpVote
