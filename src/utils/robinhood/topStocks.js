var promise;

module.exports = {
  TopStocks: function (credentials) {
    return promise = new Promise(function(resolve, reject) {
      var Robinhood = require('robinhood')(credentials, function(){
          Robinhood.sp500_up(function(err, response, body){
              if(err){
                  console.error(err);
              }else{
                  //console.log("array sp500_up:");
                  //console.log("symbol: ",body.results[0].symbol);
                  //console.log(body.results)
                  //resolve(body.results[0].symbol)
                  resolve(body.results)
              }
          })
      })
    })
  }
}
