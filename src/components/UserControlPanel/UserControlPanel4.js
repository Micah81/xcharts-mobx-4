import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';
import { VictoryCandlestick } from 'victory';
import TableOpenTrades from '../TableOpenTrades/';
import TableClosedTrades from '../TableClosedTrades/';

class UserControlPanel4 extends React.Component {
  render () {
    let profitLoss
    if(this.props.sessionStore.authUser) {
      return (
        <div>
          <h3>Closed Trades</h3>
          <TableClosedTrades/>
        </div>
      );
    } else {
      return (
        <div>
          <p>Youre logged out!</p>
        </div>
      );
    }
  }
}



export default compose(
  inject('chartStore', 'sessionStore'),
  observer
)(UserControlPanel4);
