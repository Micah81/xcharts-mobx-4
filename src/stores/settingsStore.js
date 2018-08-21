import React from 'react';
import { action, observable, runInAction } from 'mobx';
import { db } from '../firebase';
import moment from 'moment';
import * as api from '../utils/api';
import * as ts from '../utils/robinhood/topStocks';
import * as creds from '../utils/robinhood/credentials';
import * as imo from '../utils/isMarketOpen';

class SettingsStore {

  @observable acctHistDateRange = 90;
  @observable acctHistDateFrame = 'Days'
  @observable accountHistory = [
    { x: new Date(1986, 1, 1), y: 10000 },
    { x: new Date(1996, 1, 1), y: 6300 },
    { x: new Date(2006, 1, 1), y: 8200 },
    { x: new Date(2016, 1, 1), y: 15500 }
  ]
  @action updateAccountHistory(user, accountHistory){
    try {
      this.accountHistory= db.updateAcctHistory(user, accountHistory)
    } catch (error) {
        runInAction(() => {
            console.log('Error in chartStore in updateAccountHistory:', error)
        })
    }
  }

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

}

export default SettingsStore;
