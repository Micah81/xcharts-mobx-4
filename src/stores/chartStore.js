import { action, observable, runInAction } from 'mobx';
import { db } from '../firebase';
import moment from 'moment';
import * as api from '../utils/api';
import * as ts from '../utils/robinhood/topStocks';
import * as creds from '../utils/robinhood/credentials';

class ChartStore {

  @observable allSymbols = ['NA', 'AMZN', 'WMT', 'AMD', 'SQ']

  @observable activeSymbol = 'NA'

  @observable n = 0

  @observable currentPrice = 10

  @action
  async updateSymbolsArray(){
    try {
      const sdata = await ts.TopStocks(creds.credentials)
      runInAction(() => {
        sdata.map( (data) => (
          this.allSymbols.push(data.symbol)
        ) )
      })
    } catch (error) {
        runInAction(() => {
            console.log('Error in chartStore in updateSymbolsArray', error)
        })
    }
  }

  @action
  async updateChart(ActiveSymbol, Vote, User) {


    //when i push the button it needs to get the number of remaining symbols and if it's 0, dont try to get its data.


    // The first time this button is pushed, and only the first time,
    // run updateSymbolsArray()
    if (this.n === 0){
      this.updateSymbolsArray()
      console.log('Updated symbols array, which should happen just once.')
    }

    // record vote
    var today = moment().format('MMDDYYYY');
    if (Vote === 'Up') {
      db.voteUp(ActiveSymbol, today, User)
      db.mockBuy(ActiveSymbol, today, User, this.currentPrice)
    } else if (Vote ==='Down') {
      db.voteDown(ActiveSymbol, today, User)
      db.mockSell(ActiveSymbol, today, User, this.currentPrice)
    } else if (Vote === 'Sideways') {
      db.voteSideways(ActiveSymbol, today, User)
    } else if (Vote === 'Unsure') {
      db.voteUnsure(ActiveSymbol, today, User)
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
              console.log('currentPrice of the NEW chart: ', this.currentPrice)
            } else {
              alert('uh oh!')
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
