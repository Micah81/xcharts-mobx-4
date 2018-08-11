db.ref('/users/' +user+ '/mocktrades/holdings/' +symbol+ '/' +data.key+ '/').on("value", function(snapshot) {
  console.log('snapshot.val().quantity: ',snapshot.val())

})

if ( snapshot.val().quantity === 0 || snapshot.val() == null ){
  // if not, buy it.
  db.ref('/mocktrades/' +symbol+ '/' +today+ '/users/' +user+ '/').push({
    priceOpened: currentPrice
  }).then(()=>{
   db.ref('/users/'+user+ '/mocktrades/' +today+ '/' +symbol+ '/').push({
     priceOpened: currentPrice
   })
}).then(()=>{
 db.ref('/users/'+user+ '/mocktrades/holdings/' +symbol+ '/' +data.key+ '/').set({
   quantity: 1
 })
})
}

db.ref('/users/' +user+ '/mocktrades/holdings/' +symbol+ '/' +data.key+ '/').on("value", function(snapshot) {
  console.log('snapshot.val().quantity: ',snapshot.val().quantity)

})

export const mockBuy = (symbol, today, user, currentPrice) =>
  if ( db.ref('/users/' +user+ '/mocktrades/holdings/' +symbol+ '/') ){
    console.log('There is something in there!')
  } else {
    console.log('Nothing in there yet!')
  }
