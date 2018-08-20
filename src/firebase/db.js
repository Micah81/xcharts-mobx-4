import { db } from './firebase';
import * as sq from '../utils/robinhood/stockQuote';
import * as creds from '../utils/robinhood/credentials';

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
    //console.log(snapshot.val());
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
          console.log("This user already voted on this instrument on this day.")
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
          console.log("This user already voted on this instrument on this day.")
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
          console.log("This user already voted on this instrument on this day.")
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
          console.log("This user already voted on this instrument on this day.")
        }
    });
})

export const voteBegin = (symbol, now, user) =>
  db.ref('/users/' +user+ '/begin/' +now+ '/').push({
    begin: true
  })

///--------------------------------------------------------------------------------------
// User Control Panel API
let id = 0;
function createData(symbol, date, cost, quote, pl) {
  id += 1;
  return { id, symbol, date, cost, quote, pl };
}
function createDataClosedTrades(symbol, dateOpened, priceOpened, dateClosed, priceClosed, pl) {
  id += 1;
  return { id, symbol, dateOpened, priceOpened, dateClosed, priceClosed, pl };
}

let returnArr = [];
export function getOpenTrades(user){
  db.ref('/users/' +user+ '/mocktrades/holdings/').on("value", function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      childSnapshot.forEach(function(item) {
        let quote = 1000 // sq.stockQuote(String(childSnapshot.key), creds.credentials)
        //if(quote){console.log('quote:',quote)}
        let itemVal = item.val()
        let newData = createData(String(childSnapshot.key), itemVal.dateOpened, itemVal.priceOpened, quote, quote-itemVal.priceOpened)
        returnArr.push(newData);
      })
    })
  })
  console.log('returnArr',returnArr)
  return(
      returnArr
  )
}

let returnArr2 = [];
export function getClosedTrades(user){
  db.ref('/users/' +user+ '/mocktrades/history/').on("value", function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      let itemVal = childSnapshot.val()
      let newData = createDataClosedTrades( itemVal.symbol, itemVal.dateOpened, itemVal.priceOpened, itemVal.dateClosed, itemVal.priceClosed, itemVal.profitLoss )
        returnArr2.push(newData);
    })
  })
  return(
      returnArr2
  )
}


///--------------------------------------------------------------------------------------
// Mock trading API
export const mockBuy = (symbol, today, user, currentPrice) =>
  // does user already have a trade open for this symbol?
  db.ref('/users/' +user+ '/mocktrades/holdings/' +symbol+ '/').once("value", function(snapshot) {
    if(snapshot.val()==null){
      // if not, buy it.
      db.ref('/mocktrades/' +symbol+ '/' +today+ '/users/' +user+ '/').push({
        priceOpened: currentPrice
      }).then(()=>{
     db.ref('/users/'+user+ '/mocktrades/holdings/' +symbol+ '/').push({
       quantity: 1,
       priceOpened: currentPrice,
       dateOpened: today
     })
  })
    }
    else {
      console.log('This user already traded this instrument on this day.')
    }
  }
)

export const mockSell = (symbol, today, user, currentPrice) =>
  // does user already have a trade open for this symbol?
  db.ref('/users/' +user+ '/mocktrades/holdings/' +symbol+ '/').once("child_added", function(snapshot) {
    if(snapshot.val()==null){
      console.log('No trade is currently open for '+symbol+'.')
    } else {
      console.log('A trade for '+symbol+' is open and is being closed at ' +currentPrice+ '.')

      // update account history
      db.ref('/users/' +user+ '/mocktrades/history/').push ({
        symbol: symbol,
        dateClosed: today,
        priceClosed: currentPrice,
        dateOpened: snapshot.val().dateOpened,
        priceOpened: snapshot.val().priceOpened,
        profitLoss: currentPrice - snapshot.val().priceOpened,
        tradeDaysLength: today - snapshot.val().dateOpened
      }).then(()=>{
        // remove trade from user's holdings
        db.ref('/users/' +user+ '/mocktrades/holdings/' +symbol+ '/').remove(function(error) {
          console.log(error ? "Trade not removed from holdings." : "Trade removed from holdings.")
        })
      }).then(()=>{
        // add close action to the mocktrades
        db.ref('/mocktrades/' +symbol+ '/' +today+ '/users/' +user+ '/').push({
          priceClosed: currentPrice
        })
      })
    }
  })

// short / cover
