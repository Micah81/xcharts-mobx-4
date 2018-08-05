import {action, observable} from 'mobx';

class CounterStore {
  @observable counter = 0;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action increment() { this.counter++; }

  @action decrement() { this.counter--; }
}

export default CounterStore;
