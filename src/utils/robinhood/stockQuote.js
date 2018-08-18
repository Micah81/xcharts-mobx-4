var promise;

module.exports = {
  stockQuote: function (symbol, credentials) {
    var Robinhood = require('robinhood')(credentials, function(){
        Robinhood.quote_data(symbol, function(err, response, body){
            if(err){
                console.error(err);
            }else{
                console.log(symbol,"quote_data:",body.results[0].last_trade_price);
                //{
                //    results: [
                //        {
                //            ask_price: String, // Float number in a String, e.g. '735.7800'
                //            ask_size: Number, // Integer
                //            bid_price: String, // Float number in a String, e.g. '731.5000'
                //            bid_size: Number, // Integer
                //            last_trade_price: String, // Float number in a String, e.g. '726.3900'
                //            last_extended_hours_trade_price: String, // Float number in a String, e.g. '735.7500'
                //            previous_close: String, // Float number in a String, e.g. '743.6200'
                //            adjusted_previous_close: String, // Float number in a String, e.g. '743.6200'
                //            previous_close_date: String, // YYYY-MM-DD e.g. '2016-01-06'
                //            symbol: String, // e.g. 'AAPL'
                //            trading_halted: Boolean,
                //            updated_at: String, // YYYY-MM-DDTHH:MM:SS e.g. '2016-01-07T21:00:00Z'
                //        }
                //    ]
                //}
            }
        })
    });
  }
}
