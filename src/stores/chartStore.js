import { action, observable, runInAction } from 'mobx'; // originally here
import { db } from '../firebase';
import moment from 'moment';
import * as api from '../utils/api';

class ChartStore {

  @observable allSymbols = ['SQ', 'AMZN', 'WMT', 'AMD']

  @observable activeSymbol = 'SQ'

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

    try {
        // get the stuff!
        const cdata = await api.fetchChartData(this.activeSymbol)

        //once you get it ...
        // after await, modifying state again, needs an actions:
        runInAction(() => {
            this.chartData = cdata
            console.log('Maybe it ran?')
        })
    } catch (error) {
        runInAction(() => {
            console.log('error in chartStore', error)
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
