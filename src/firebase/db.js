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
