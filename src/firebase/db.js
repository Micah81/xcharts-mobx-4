import { db } from './firebase';
import * as sq from '../utils/robinhood/stockQuote';
import * as creds from '../utils/robinhood/credentials';
import moment from 'moment';
const { DateTime } = require('luxon');
DateTime.utc(-6);
var Promise = require('promise');

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

export const voteBegin = (symbol, now, user) => {
  return new Promise(function (fulfill, reject){
    let returnArr4 = [];
    db.ref('/users/' +user+ '/begin/' +now+ '/').push({
      begin: true
    })
    db.ref('/users/' +user+ '/mocktrades/symbols/').once("value", function(snapshot) {
        snapshot.forEach(function(data) {
          returnArr4.push(data.key)
        })
        fulfill(returnArr4)
    })
  })
}

///--------------------------------------------------------------------------------------
// User Control Panel API
let id = 0;
function createData(symbol, date, cost, quote, pl) {
  id += 1;
  return { id, symbol, date, cost, quote, pl };
}
let id2 = 0;
function createDataClosedTrades(symbol, dateOpened, priceOpened, dateClosed, priceClosed, pl) {
  id2 += 1;
  return { id2, symbol, dateOpened, priceOpened, dateClosed, priceClosed, pl };
}

function createDataAcctHistory(dateClosed, tradeProfitLoss) {
    return { x: String(dateClosed), y: parseFloat(tradeProfitLoss.toFixed(2)) }
}

export function getOpenTrades(user){
  let returnArr = [];
  db.ref('/users/' +user+ '/mocktrades/holdings/').on("value", function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      childSnapshot.forEach(async function(item) {
        let quote = 1000;// await sq.stockQuote(String(childSnapshot.key), creds.credentials)
        //if(quote){console.log('quote:',quote)}
        let itemVal = item.val()
        let newData = createData(String(childSnapshot.key), itemVal.dateOpened, itemVal.priceOpened, quote, quote-itemVal.priceOpened)
        returnArr.push(newData);
      })
    })
  })
  return(
      returnArr
  )
}

export function getClosedTrades(user){
  let returnArr2 = [];
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

export function updateAcctHistory(user, today, acctHistNumPeriods, acctHistTimeFrame, accountBalance){
  let returnArr3 = [];
  // I know their time frame. The chart only needs the data points within that time frame.
    let timeFrame = acctHistNumPeriods // 30 (days)
  // What are the first date of the time frame?
    let firstDate = moment().subtract(acctHistNumPeriods, acctHistTimeFrame).format('L');
    let dupsArray = []
    let children
    let runningTotal = accountBalance
    //console.log('runningTotal:',runningTotal)
  // How many data points are there?
    db.ref('/users/' +user+ '/mocktrades/history/')
    .orderByChild('dateClosed')
    .startAt(firstDate)
    .on("value", function(snapshot) {
      children = snapshot.numChildren()
      snapshot.forEach(function(childSnapshot) {
        let itemVal = childSnapshot.val()
          // Get a total p/l for each date
          //console.log('--------------------------------------')
          //console.log('itemVal.dateClosed:',itemVal.dateClosed)
          //console.log('dupsArray1:',dupsArray)
          let inDupsArray = dupsArray.includes(itemVal.dateClosed);
          if(inDupsArray){
            //console.log('DATE IS ALREADY IN THIS ARRAY')
            children--
            let newTotal = itemVal.profitLoss + dupsArray[1]
            dupsArray[1] = newTotal
            //console.log('dupsArray2:',dupsArray)
            //console.log('children:',children)
            if(children===0){
              runningTotal = runningTotal + dupsArray[1]
              let res = createDataAcctHistory( dupsArray[0], runningTotal )
              returnArr3.push(res)
              //console.log('returnArr3:',returnArr3)
            }
          } else {
            //console.log('DATE IS NOT IN THE ARRAY')
              children--
              // process the previous, if any exists
                if( dupsArray.length!=0  &&  dupsArray[0]!=undefined) {
                  //console.log('Condition 1')
                  runningTotal = runningTotal + dupsArray[1]
                  let res = createDataAcctHistory( dupsArray[0], runningTotal )
                  returnArr3.push(res)
                  //console.log('returnArr3:',returnArr3)
                  dupsArray.length=0
                  dupsArray[0] = itemVal.dateClosed
                  dupsArray[1] = itemVal.profitLoss
                } else if (dupsArray.length===0){
                  //console.log('Condition 2')
                  dupsArray[0] = itemVal.dateClosed
                  dupsArray[1] = itemVal.profitLoss
                } else {
                  //console.log('Condition 3')
                    dupsArray.length = 0
                    // input new data to array
                      dupsArray[0] = itemVal.dateClosed
                      dupsArray[1] = itemVal.profitLoss
                      console.log('dupsArray3:',dupsArray)
                }
          }
      })
    })
  return(
      //console.log('returnArr3:',returnArr3)
      returnArr3
      /*[
        { x: '01011986', y: 20000 },
        { x: '01011996', y: 3500 },
        { x: '01012006', y: 82000 },
        { x: '01012016', y: 60000 }
      ]*/
  )
}

export function addTopStocksToFirebase(user, symbol){
  db.ref('/users/' +user+ '/mocktrades/symbols/' +symbol+ '/').push({
      symbol: symbol
    })
}

export function addSymbol(user, symbol){
  let returnArr4 = [];
  return new Promise(function (fulfill, reject){
    db.ref('/users/' +user+ '/mocktrades/symbols/' +symbol+ '/').once("value", function(snapshot) {
      if(snapshot.val()==null) {
        console.log('Adding',symbol,'to this users symbols in Firebase.')
        db.ref('/users/' +user+ '/mocktrades/symbols/' +symbol+ '/').push({
            symbol: symbol
          }).then(() => {
            db.ref('/users/' +user+ '/mocktrades/symbols/').once("value", function(snapshot) {
              snapshot.forEach(function(data) {
                returnArr4.push(data.key)
              })
              fulfill(returnArr4)
            })
          })
      }
      else {
        db.ref('/users/' +user+ '/mocktrades/symbols/').once("value", function(snapshot) {
          snapshot.forEach(function(data) {
            returnArr4.push(data.key)
          })
          fulfill(returnArr4)
        })
      }
    })
  })
}

export function removeSymbol(user, symbol){
  let returnArr4 = [];
  return new Promise(function (fulfill, reject){
    db.ref('/users/' +user+ '/mocktrades/symbols/' +symbol+ '/').once("value", function(snapshot) {
      if(snapshot.val()!=null) {
        console.log('Adding',symbol,'to this users symbols in Firebase.')
        db.ref('/users/' +user+ '/mocktrades/symbols/' +symbol+ '/').remove().then(() => {
            db.ref('/users/' +user+ '/mocktrades/symbols/').once("value", function(snapshot) {
              snapshot.forEach(function(data) {
                returnArr4.push(data.key)
              })
              fulfill(returnArr4)
            })
          })
      }
      else {
        db.ref('/users/' +user+ '/mocktrades/symbols/').once("value", function(snapshot) {
          snapshot.forEach(function(data) {
            returnArr4.push(data.key)
          })
          fulfill(returnArr4)
        })
      }
    })
  })
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
  db.ref('/users/' +user+ '/mocktrades/holdings/' +symbol+ '/').once("child_added", function(snapshot) {
    let tradeDaysLength
    if(snapshot.val()==null){
      console.log('No trade is currently open for '+symbol+'.')
    } else {
      if (today - snapshot.val().dateOpened == NaN){
        tradeDaysLength = 0;
      } else {
        tradeDaysLength = snapshot.val().dateOpened;
      }
      console.log('A trade for '+symbol+' is open and is being closed at ' +currentPrice+ '.')

      // update account history
      db.ref('/users/' +user+ '/mocktrades/history/').push ({
        symbol: symbol,
        dateClosed: today,
        priceClosed: currentPrice,
        dateOpened: snapshot.val().dateOpened,
        priceOpened: snapshot.val().priceOpened,
        profitLoss: currentPrice - snapshot.val().priceOpened,
        tradeDaysLength: tradeDaysLength
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

///--------------------------------------------------------------------------------------
// Chart Data API
export function currentChartData(symbol, time1, time2){

  return new Promise(function (fulfill, reject){
    db.ref('/chartData/' +symbol+ '/').limitToLast(1).once("value", function(snapshot) {
      if(snapshot.val()!=null){
        snapshot.forEach(function(childSnapshot) {
          let dbTime = DateTime.fromISO( childSnapshot.val().time )
          if (time2 > dbTime) { fulfill(false) }
            else { fulfill(true) }
        })
      } else {
        fulfill(false)
      }
    })
  })
}

export function putChartDataIntoFB(symbol, data, time){
   console.log('symbol:',symbol)
  db.ref('/chartData/' +symbol+ '/').push({
    time: time,
    data: data
  }).then(() => {
    console.log("Added "+symbol+" chart data to FB.")
  })
}

export function getFBChartData(symbol){
  return new Promise(function (fulfill, reject){
  db.ref('/chartData/' +symbol+ '/').orderByChild('time').limitToLast(1).once("value", function(snapshot){
      snapshot.forEach(function(childSnapshot) {
        fulfill(childSnapshot.val().data)
      })
    })
  })
}
