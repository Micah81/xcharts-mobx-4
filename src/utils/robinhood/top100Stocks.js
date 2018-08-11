100-most-popular(100-most-popular, callback)

var promise;

module.exports = {
  Top100Stocks: function (credentials) {
    return promise = new Promise(function(resolve, reject) {
      var Robinhood = require('robinhood')(credentials, function(){
          Robinhood.100-most-popular(function(err, response, body){
              if(err){
                  console.error(err);
              }else{
                  console.log("100-most-popular:");
                  //console.log("symbol: ",body.results[0].symbol);
                  console.log(body.results)
                  //resolve(body.results[0].symbol)
                  resolve(body.results)
              }
          })
      })
    })
  }
}
