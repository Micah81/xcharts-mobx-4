import { db } from './firebase';
import moment from 'moment';

// User API

export const doCreateUser = (id, username, email) =>
  db.ref(`users/${id}`).set({
    username,
    email,
  });

export const onceGetUsers = () =>
  db.ref('users').once('value');

export function recordUpVote(instr, user) {
  var today = moment().format('MMDDYYYY');

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
            console.log("This user already voted on this instrument on this day. Update chart.")
          }
      });
  });

}
