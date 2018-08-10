import { action, observable, runInAction } from 'mobx'; // originally here
import { db } from '../firebase';
import moment from 'moment';
import * as api from '../utils/api';

class ChartStore {

  @observable allSymbols = ['NA', 'AMZN', 'WMT', 'AMD']

  @observable activeSymbol = 'NA'

  @observable n = 0

  @action
  async updateChart(ActiveSymbol, Vote, User) {

    // record vote
    var today = moment().format('MMDDYYYY');
    if (Vote === 'Up') {
      db.voteUp(ActiveSymbol, today, User)
    } else if (Vote ==='Down') {
      db.voteDown(ActiveSymbol, today, User)
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
    try {
        const cdata = await api.fetchChartData(this.activeSymbol)
        runInAction(() => {
            this.chartData = cdata
            this.currentPrice = cdata[cdata.length-1].close
            console.log('currentPrice of the NEW chart: ', this.currentPrice)
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

  @observable currentPrice = 10

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

}

export default ChartStore;
