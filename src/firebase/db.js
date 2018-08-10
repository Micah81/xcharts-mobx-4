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

// VOTING - MOCK TRADING API
export const mockBuy = (symbol, today, user, currentPrice) =>
  // does user already have a trade open for this symbol?
  //db.ref(  '/users/' +user+ '/mocktrades/' +today+ '/' +symbol+ '/').once("value", function(snapshot) {
  db.ref(  '/users/' +user+ '/mocktrades/holdings/' +symbol+ '/').once("value", function(snapshot) {
    console.log('mockBuy snapshot: ',snapshot.val());
    if(snapshot.val()==null){
      // if not, buy it.
      db.ref('/mocktrades/' +symbol+ '/' +today+ '/users/' +user+ '/').push({
        priceOpened: currentPrice
      }).then(()=>{
       db.ref('/users/'+user+ '/mocktrades/' +today+ '/' +symbol+ '/').push({
         priceOpened: currentPrice
       })
    }).then(()=>{
     db.ref('/users/'+user+ '/mocktrades/holdings/' +symbol+ '/').push({
       quantity: 1
     })
  })
    }
    else {
      console.log('This user already traded this instrument on this day.')
      snapshot.forEach(function(data) {
        console.log('data.key: ',data.key)
        db.ref('/users/' +user+ '/mocktrades/holdings/' +symbol+ '/' +data.key+ '/').once("value", function(snapshot) {
          console.log('maybe? ', snapshot.val().quantity)
        })
      })
    }
  }
)
// if they do have a trade in this already open (find sym, compare dates), don't open another. Maybe this should be an option.
