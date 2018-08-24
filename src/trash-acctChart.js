/*
  1. Define the first data using the date range
  2. Get a list of ALL the closed trades
    3. for each date, get a list of ALL the trades closed on that day
      4. Add up the p/l in a single variable named dateTotal
        5. Then pass the date and the dateTotal into the createDataAcctHistory function.
*/
let returnArr3 = [];
export function updateAcctHistory(user, today, acctHistNumPeriods, acctHistTimeFrame){
  returnArr3.length = 0
  let j = 0, k = 0
  let activeDate = moment().subtract(acctHistNumPeriods, acctHistTimeFrame).format('L');
  let datesUsedArray = [], totalsArray = [], index
  while(j < acctHistNumPeriods) {
    db.ref('/users/' +user+ '/mocktrades/history/').orderByChild('dateClosed').on("value", function(snapshot) {
      let itemVal, thisIndex
      snapshot.forEach(function(childSnapshot) {
        itemVal = childSnapshot.val()
        let newDateClosed = moment(itemVal.dateClosed, "MMDDYYYY").format('L');
        if(activeDate < newDateClosed){
          activeDate = newDateClosed
        }
        if(newDateClosed == activeDate){

          let res = datesUsedArray.includes(activeDate);
          let newData
          if(!res) {
            datesUsedArray.push(activeDate) /////////////////////
            totalsArray.push(itemVal.profitLoss) //////////////
          } else {
            index = datesUsedArray.indexOf(activeDate)
            let profit = totalsArray[index]
            let newTotal = profit + itemVal.profitLoss
            totalsArray[index] = newTotal  //////////////////////
          }
        }
      })
    })
    j++
  }
  return(
      //returnArr3
      [
        { x: new Date(1986, 1, 1), y: 20000 },
        { x: new Date(1996, 1, 1), y: 3500 },
        { x: new Date(2006, 1, 1), y: 82000 },
        { x: new Date(2016, 1, 1), y: 60000 }
      ]
  )
}
