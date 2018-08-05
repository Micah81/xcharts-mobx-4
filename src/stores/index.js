import { configure } from 'mobx';

import SessionStore from './sessionStore';
import UserStore from './userStore';
import CounterStore from './counterStore';
import ChartStore from './chartStore';

configure({ enforceActions: true });

class RootStore {
  constructor() {
    this.sessionStore = new SessionStore(this);
    this.userStore = new UserStore(this);
    this.counterStore = new CounterStore(this);
    this.chartStore = new ChartStore(this);
  }
}

const rootStore = new RootStore();

export default rootStore;
