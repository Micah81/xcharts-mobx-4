import React from 'react';
import { action, observable, runInAction } from 'mobx';
import { db } from '../firebase';
import moment from 'moment';
import * as api from '../utils/api';
import * as ts from '../utils/robinhood/topStocks';
import * as creds from '../utils/robinhood/credentials';
import * as imo from '../utils/isMarketOpen';

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

  @observable allSymbols = ['NA', 'AMZN', 'WMT', 'AMD', 'SQ']

  @observable activeSymbol = 'NA'

  @observable n = 0

  @action
  async updateSymbolsArray(){
    try {
      const sdata = await ts.TopStocks(creds.credentials)
      runInAction(() => {
        sdata.map( (data) => (
          this.allSymbols.push(data.symbol)
        ) )
        console.log('this.allSymbols1:',this.allSymbols)
        shuffle(this.allSymbols)
        console.log('this.allSymbols2:',this.allSymbols)
      })
    } catch (error) {
        runInAction(() => {
            console.log('Error in chartStore in updateSymbolsArray', error)
        })
    }
  }


  @action
  async updateChart(ActiveSymbol, Vote, User) {
    if (this.n === 0){
      this.updateSymbolsArray()
      console.log('Updated symbols array, which should happen just once.')
    }

    var today = moment().format('MMDDYYYY');
    var now = moment().format();

    // record vote
    if (Vote === 'Up') {

      this.updateRows(User) // open trades
      db.voteUp(ActiveSymbol, today, User)
      db.mockBuy(ActiveSymbol, today, User, this.currentPrice)
      this.updateAccountHistory(User, today, this.acctHistNumPeriods, this.acctHistTimeFrame, this.accountBalance)
    } else if (Vote ==='Down') {
      db.voteDown(ActiveSymbol, today, User)
      db.mockSell(ActiveSymbol, today, User, this.currentPrice)
      this.updateClosedTrades(User)
    } else if (Vote === 'Sideways') {
      db.voteSideways(ActiveSymbol, today, User)
    } else if (Vote === 'Unsure') {
      db.voteUnsure(ActiveSymbol, today, User)
      db.mockSell(ActiveSymbol, today, User, this.currentPrice)
      this.updateClosedTrades(User)
    } else if (Vote === 'Begin') {
      db.voteBegin(ActiveSymbol, now, User)
      this.updateAccountHistory(User, today, this.acctHistNumPeriods, this.acctHistTimeFrame, this.accountBalance)
      this.updateIsMarketOpen(today)
      this.updateRows(User) // open trades
      this.updateClosedTrades(User)
    }

    // change activeSymbol
    this.n++

    // update activeSymbol
    this.activeSymbol = this.allSymbols[this.n]

    // update chartData
    // is there data for this symbol that was updated within the last 10 minutes?
    // if so
    // use it

    // if not
    // use api only if data not updated within 10 minutes
    try {
        const cdata = await api.fetchChartData(this.activeSymbol)
        runInAction(() => {
            // put it into firebase with time stamp

            if ((this.chartData).length > 4){
              this.chartData = cdata
              this.currentPrice = cdata[cdata.length-1].close
              console.log('currentPrice (last price on current chart): ', this.currentPrice)
            } else {
              console.log('Unable to get chartData, moving to next symbol.')
              this.n++
              this.activeSymbol = this.allSymbols[this.n]
              this.chartData = api.fetchChartData(this.activeSymbol)
            }
        })
    } catch (error) {
        runInAction(() => {
            console.log('Error in chartStore near //update chartData', error)
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
