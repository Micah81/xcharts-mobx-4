childSnapshot.forEach(function(item) {
  let itemVal = item.val()
  //let newData = createData(String(childSnapshot.key), itemVal.dateOpened, itemVal.priceOpened, quote, quote-itemVal.priceOpened)
  //let newData = createData(String(childSnapshot.key), itemVal.dateOpened, itemVal.priceOpened, quote, quote-itemVal.priceOpened)
  returnArr.push(newData);
// })
})


/*
function createDataClosedTrades(symbol, dateOpened, dateClosed, cost, soldAt, pl) {
  id += 1;
  return { id, symbol, dateOpened, dateClosed, cost, soldAt, pl };
}
*/


childSnapshot.forEach(function(item) {
  let itemVal = item.val()
  //console.log('itemVal.dateOpened:',itemVal.dateOpened)
  console.log('item.dateOpened:',item.val().dateOpened)
  returnArr.push(itemVal);
})
