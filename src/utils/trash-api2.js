var axios = require('axios');
var key = require('./apiKey')

function fetchChartData (instrument) {
  return new Promise((resolve, reject) => {
    var latestQuotes = [];
    var encodedURI = window.encodeURI('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + instrument + '&apikey=' + key);
    return(axios.get(encodedURI))
      .then(function (response){
        if(response.data.hasOwnProperty('Time Series (Daily)')) {
          var hash = response.data['Time Series (Daily)']
          var keys = Object.keys(hash)
          keys.forEach((key, i)=>{
            //getQuotes(hash[key], latestQuotes)
            let period = hash[key]
            latestQuotes.push({
                               'open':   parseFloat(period['1. open']),
                               'high':   parseFloat(period['2. high']),
                               'low':    parseFloat(period['3. low']),
                               'close':  parseFloat(period['4. close'])//,
                               //'x':      period['']
                               //'x':      parseFloat(period['5. volume'])
                            });
                          })
              resolve(latestQuotes.reverse())
        }
      })
      .catch(function (error) {
        console.log("=============================")
        console.log('Error getting chartData:',error)
        console.log("=============================")
      })
  });
}


module.exports = {
  fetchChartData: function (instrument) {

  }
}
