import { db } from './firebase';

// User API
export const doCreateUser = (id, username, email) =>
  db.ref(`users/${id}`).set({
    username,
    email,
  });

export const onceGetUsers = () =>
  db.ref('users').once('value');

// Voting API
export const voteUp = (symbol, today, user) =>
  db.ref('/votes/' +today+ '/' +symbol+ '/').child('voters').orderByChild('user').equalTo(user).on("value", function(snapshot) {
    console.log(snapshot.val());
    if(snapshot.val()==null){
      db.ref('/votes/' +today+ '/' +symbol+ '/voters/').push({
        user: user
      }).then(() =>{
        db.ref('/users/' +user+ '/votes/' +today+ '/').push({
          symbol: symbol,
          vote: 'up'
        }).then(() => {
          db.ref('/votes/' +today+ '/' +symbol+ '/upVotes').transaction(function(upVotes){
            return upVotes + 1
          })
        })
      })
    }
    snapshot.forEach(function(data) {
        if(data.key==null){
          // Record the vote
          db.ref('/votes/' +today+ '/' +symbol+ '/voters/').push({
            user: user
              }).then(()=>{
               db.ref('/users/'+user+ '/votes/' + today+ '/').push({
                 symbol: symbol,
                 vote: 'up'
               }).then(()=>{
                 db.ref('/votes/' +today+ '/' +symbol+ '/upVotes').transaction(function(upVotes) {
                   return upVotes + 1
                 });
               });
          });
        } else {
          console.log("This user already voted on this instrument on this day. Change chart state.")
        }
    });
})

export const voteDown = (symbol, today, user) =>
  db.ref('/votes/' +today+ '/' +symbol+ '/').child('voters').orderByChild('user').equalTo(user).on("value", function(snapshot) {
    console.log(snapshot.val());
    if(snapshot.val()==null){
      db.ref('/votes/' +today+ '/' +symbol+ '/voters/').push({
        user: user
      }).then(() =>{
        db.ref('/users/' +user+ '/votes/' +today+ '/').push({
          symbol: symbol,
          vote: 'down'
        }).then(() => {
          db.ref('/votes/' +today+ '/' +symbol+ '/downVotes').transaction(function(downVotes){
            return downVotes + 1
          })
        })
      })
    }
    snapshot.forEach(function(data) {
        if(data.key==null){
          // Record the vote
          db.ref('/votes/' +today+ '/' +symbol+ '/voters/').push({
            user: user
              }).then(()=>{
               db.ref('/users/'+user+ '/votes/' + today+ '/').push({
                 symbol: symbol,
                 vote: 'down'
               }).then(()=>{
                 db.ref('/votes/' +today+ '/' +symbol+ '/downVotes').transaction(function(downVotes) {
                   return downVotes + 1
                 });
               });
          });
        } else {
          console.log("This user already voted on this instrument on this day. Change chart state.")
        }
    });
})

export const voteSideways = (symbol, today, user) =>
  db.ref('/votes/' +today+ '/' +symbol+ '/').child('voters').orderByChild('user').equalTo(user).on("value", function(snapshot) {
    console.log(snapshot.val());
    if(snapshot.val()==null){
      db.ref('/votes/' +today+ '/' +symbol+ '/voters/').push({
        user: user
      }).then(() =>{
        db.ref('/users/' +user+ '/votes/' +today+ '/').push({
          symbol: symbol,
          vote: 'sideways'
        }).then(() => {
          db.ref('/votes/' +today+ '/' +symbol+ '/sidewaysVotes').transaction(function(sidewaysVotes){
            return sidewaysVotes + 1
          })
        })
      })
    }
    snapshot.forEach(function(data) {
        if(data.key==null){
          // Record the vote
          db.ref('/votes/' +today+ '/' +symbol+ '/voters/').push({
            user: user
              }).then(()=>{
               db.ref('/users/'+user+ '/votes/' + today+ '/').push({
                 symbol: symbol,
                 vote: 'sideways'
               }).then(()=>{
                 db.ref('/votes/' +today+ '/' +symbol+ '/sidewaysVotes').transaction(function(sidewaysVotes) {
                   return sidewaysVotes + 1
                 });
               });
          });
        } else {
          console.log("This user already voted on this instrument on this day. Change chart state.")
        }
    });
})

export const voteUnsure = (symbol, today, user) =>
  db.ref('/votes/' +today+ '/' +symbol+ '/').child('voters').orderByChild('user').equalTo(user).on("value", function(snapshot) {
    console.log(snapshot.val());
    if(snapshot.val()==null){
      db.ref('/votes/' +today+ '/' +symbol+ '/voters/').push({
        user: user
      }).then(() =>{
        db.ref('/users/' +user+ '/votes/' +today+ '/').push({
          symbol: symbol,
          vote: 'unsure'
        }).then(() => {
          db.ref('/votes/' +today+ '/' +symbol+ '/unsureVotes').transaction(function(unsureVotes){
            return unsureVotes + 1
          })
        })
      })
    }
    snapshot.forEach(function(data) {
        if(data.key==null){
          // Record the vote
          db.ref('/votes/' +today+ '/' +symbol+ '/voters/').push({
            user: user
              }).then(()=>{
               db.ref('/users/'+user+ '/votes/' + today+ '/').push({
                 symbol: symbol,
                 vote: 'unsure'
               }).then(()=>{
                 db.ref('/votes/' +today+ '/' +symbol+ '/unsureVotes').transaction(function(unsureVotes) {
                   return unsureVotes + 1
                 });
               });
          });
        } else {
          console.log("This user already voted on this instrument on this day. Change chart state.")
        }
    });
})
