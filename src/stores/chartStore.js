import { observable, action } from 'mobx';

class ChartStore {
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

  @action chgChartData = () => {
    this.chartData = ChartStore.chartData;
  }
}

export default ChartStore;
