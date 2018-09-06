import moment from 'moment';
import { db } from '../firebase';
var axios = require('axios');
var key = require('./apiKey')

function getQuotes (period, latestQuotes) {
  latestQuotes.push({
                     'open':   parseFloat(period['1. open']),
                     'high':   parseFloat(period['2. high']),
                     'low':    parseFloat(period['3. low']),
                     'close':  parseFloat(period['4. close'])//,
                     //'x':      period['']
                     //'x':      parseFloat(period['5. volume'])
                  });
}

// fetchChartData MUST RETURN A PROMISE
export function fetchChartData (instrument) {
  return new Promise(function (fulfill, reject){
    var latestQuotes = [];
    var encodedURI = window.encodeURI('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + instrument + '&apikey=' + key);
    return(axios.get(encodedURI))
      .then(function (response){
        if(response.data.hasOwnProperty('Time Series (Daily)')) {
          var hash = response.data['Time Series (Daily)']
          var keys = Object.keys(hash)
          keys.forEach((key, i)=>{
            getQuotes((hash[key]), latestQuotes)
          })

          if (latestQuotes){
            fulfill (
              latestQuotes.reverse()
            )
          } else {
            fulfill (
              [
                {open: 5, close: 10, high: 15, low: 0},
                {open: 10, close: 15, high: 20, low: 5},
                {open: 15, close: 20, high: 22, low: 10},
                {open: 20, close: 10, high: 25, low: 7},
                {open: 10, close: 8, high: 15, low: 5}
              ]
            )
          }
        }
      })
      .catch(function (error) {
        console.log('Error getting chartData:',error)
      })
    })
  }
