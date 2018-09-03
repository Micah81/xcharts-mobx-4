import React from 'react';
import { action, observable, runInAction } from 'mobx';
import { db } from '../firebase';
import moment from 'moment';
import * as api from '../utils/api';
import * as ts from '../utils/robinhood/topStocks';
import * as creds from '../utils/robinhood/credentials';
import * as imo from '../utils/isMarketOpen';
var Promise = require('promise');

//----------------------------------------
function shuffle(sourceArray) {
    for (var i = 0; i < sourceArray.length - 1; i++) {
        var j = i + Math.floor(Math.random() * (sourceArray.length - i));
        var temp = sourceArray[j];
        sourceArray[j] = sourceArray[i];
        sourceArray[i] = temp;
    }
    return sourceArray;
}

let id = 0;
function createData(symbol, date, cost, quote, pl) {
  id += 1;
  return { id, symbol, date, cost, quote, pl };
}
function createDataClosedTrades(symbol, dateOpened, priceOpened, dateClosed, priceClosed, pl) {
  id += 1;
  return { id, symbol, dateOpened, priceOpened, dateClosed, priceClosed, pl };
}
//----------------------------------------

class ChartStore {

  @observable acctHistNumPeriods = 30
  @observable acctHistTimeFrame = 'days'
  @observable accountHistory = [
    { x: new Date(1986, 1, 1), y: 10000 },
    { x: new Date(1996, 1, 1), y: 6300 },
    { x: new Date(2006, 1, 1), y: 8200 },
    { x: new Date(2016, 1, 1), y: 15500 }
  ]
  @action updateAccountHistory(user, today, acctHistNumPeriods, acctHistTimeFrame, accountBalance){
    try {
      this.accountHistory= db.updateAcctHistory(user, today, acctHistNumPeriods, acctHistTimeFrame, accountBalance)
    } catch (error) {
        runInAction(() => {
            console.log('Error in chartStore in updateAccountHistory:', error)
        })
    }
  }

  @observable isMarketOpen = false;
  @action updateIsMarketOpen(today){
    try {
      this.isMarketOpen = imo.isMarketOpen(today)
    } catch (error) {
        runInAction(() => {
            console.log('Error in chartStore in updateIsMarketOpen:', error)
        })
    }
  }

  @observable rows = [
    createData('AMZN', '8/11/2018', 100.00, 1400.00, 1300.00),
    createData('WMT', '8/15/2018', 9.00, 39.00, 30.00)
  ]

  @action
  async updateRows(user){
    try {
      this.rows = db.getOpenTrades(user)
    } catch (error) {
        runInAction(() => {
            console.log('Error in chartStore in updateRows:', error)
        })
    }
  }

  @observable closedTrades = [
    createDataClosedTrades('ZOES', '8/11/2018', 100.00, '8/14/2018', 1400.00, 1300.00),
    createDataClosedTrades('IZEA', '8/15/2018', 9.00,   '8/17/2018', 39.00,   30.00)
  ]

  @action
  async updateClosedTrades(user){
    try {
      this.closedTrades = db.getClosedTrades(user)
    } catch (error) {
        runInAction(() => {
            console.log('Error in chartStore in updateClosedTrades:', error)
        })
    }
  }

  @observable accountBalance = 0

  @observable allSymbols = ['AMZN', 'WMT', 'AMD', 'SQ']


  @action addSymbol(user, symbol){
    return new Promise(function (fulfill, reject){
      db.addSymbol(user, symbol).done(function (res){
        try {
          runInAction(() => {
            fulfill(res);
          })
        } catch (err) {
          reject(err);
        }
      }, reject)
    })
  }

  @action removeSymbol(user, symbol){
    return new Promise(function (fulfill, reject){
      db.removeSymbol(user, symbol).done(function (res){
        try {
          runInAction(() => {
            fulfill(res);
          })
        } catch (err) {
          reject(err);
        }
      }, reject)
    })
  }

  @observable activeSymbol = 'AMZN'

  @observable n = 0

  @action
  async updateSymbolsArray(user, symbol){
    try {
      const sdata = await ts.TopStocks(creds.credentials)
      runInAction(() => {
        sdata.map((data) => (
          db.addTopStocksToFirebase(user, data.symbol)
        ))
      })
    } catch (error) {
        runInAction(() => {
            console.log('Error in chartStore in updateSymbolsArray', error)
        })
    }
  }


  @action
  async updateChart(ActiveSymbol, Vote, User) {
    var today = moment().format('MMDDYYYY');
    var now = moment().format();

    // record vote
    if (Vote === 'Up') {
      this.allSymbols = await this.addSymbol(User, ActiveSymbol)
      this.updateRows(User)
      db.voteUp(ActiveSymbol, today, User)
      db.mockBuy(ActiveSymbol, today, User, this.currentPrice)
      this.updateAccountHistory(User, today, this.acctHistNumPeriods, this.acctHistTimeFrame, this.accountBalance)
    } else if (Vote ==='Down') {
      db.voteDown(ActiveSymbol, today, User)
      db.mockSell(ActiveSymbol, today, User, this.currentPrice)
      this.allSymbols = await this.removeSymbol(User, ActiveSymbol)
      this.updateClosedTrades(User)
      this.updateAccountHistory(User, today, this.acctHistNumPeriods, this.acctHistTimeFrame, this.accountBalance)
    } else if (Vote === 'Sideways') {
      db.voteSideways(ActiveSymbol, today, User)
    } else if (Vote === 'Unsure') {
      db.voteUnsure(ActiveSymbol, today, User)
      db.mockSell(ActiveSymbol, today, User, this.currentPrice)
      this.allSymbols = await this.removeSymbol(User, ActiveSymbol)
      this.updateClosedTrades(User)
      this.updateAccountHistory(User, today, this.acctHistNumPeriods, this.acctHistTimeFrame, this.accountBalance)
    } else if (Vote === 'Begin') {
      shuffle(this.allSymbols)
      this.updateSymbolsArray(User, ActiveSymbol)
      db.voteBegin(ActiveSymbol, now, User)
      this.updateAccountHistory(User, today, this.acctHistNumPeriods, this.acctHistTimeFrame, this.accountBalance)
      this.updateIsMarketOpen(today)
      this.updateRows(User)
      this.updateClosedTrades(User)
    }

    // change activeSymbol
    this.n++

    // update activeSymbol
    this.activeSymbol = this.allSymbols[this.n]

    // update chartData
    // use api only if data not updated within 20 minutes
    // dont use API if the market isn't open.
    try {
        let time1 = moment().format()
        let time2 = moment().subtract(20, 'minutes').from(time1)
        let dataIsCurrent = db.currentChartData(ActiveSymbol, time1, time2)

        if (dataIsCurrent != true){
          let cdata = await api.fetchChartData(this.activeSymbol)
          runInAction(() => {
                this.chartData = cdata
                this.currentPrice = cdata[cdata.length-1].close
                console.log("This chart data came from the API.")
                if(cdata){db.putChartDataIntoFB(this.activeSymbol, cdata, time1)}
          })
        } else {
          // use the current data for the chart
          let cdata = await db.getFBChartData(this.activeSymbol) // <<<< Needs to be a promise, I think
          console.log('cdata:',cdata)
          runInAction(() => {
                this.chartData = cdata
                this.currentPrice = cdata[cdata.length-1].close
                console.log("This chart data came from Firebase.")
          })
        }
    } catch (error) {
        runInAction(() => {
            console.log('Error in chartStore near //update chartData:', error)
        })
    }
}

  @observable chartData = [
    {open: 5, close: 10, high: 15, low: 0},
    {open: 10, close: 15, high: 20, low: 5},
    {open: 15, close: 20, high: 22, low: 10},
    {open: 20, close: 10, high: 25, low: 7},
    {open: 10, close: 8, high: 15, low: 5}
  ]


  constructor(rootStore) {
    this.rootStore = rootStore;
  }

}

export default ChartStore;
