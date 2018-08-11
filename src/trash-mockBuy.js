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
