import { configure } from 'mobx';

import SessionStore from './sessionStore';
import UserStore from './userStore';
import CounterStore from './counterStore';

configure({ enforceActions: true });

class RootStore {
  constructor() {
    this.sessionStore = new SessionStore(this);
    this.userStore = new UserStore(this);
    this.counterStore = new CounterStore(this);
  }
}

const rootStore = new RootStore();

export default rootStore;
