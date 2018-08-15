import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';
import { VictoryCandlestick } from 'victory';
/*
To do:
  Implement table in design

  Access the data (db)

  Update the data (store)
*/

class UserControlPanel3 extends React.Component {
  render () {
    let profitLoss
    if(this.props.sessionStore.authUser) {
      return (
        <div>
          <h3>Open Trades</h3>
          <ul>
            {
              (this.props.chartStore.openTrades).map((symbol) =>
                <li>{symbol}</li>
              )
            }
            {
              <li>{this.props.chartStore.dateOpened}</li>
            }
            {
              <li>${(this.props.chartStore.priceOpened).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</li>
            }
            {
              <li>${(this.props.chartStore.currentPrice).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</li>
            }
            {
              <li>
              ${
                profitLoss = ((this.props.chartStore.currentPrice) - (this.props.chartStore.priceOpened)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
              }
              </li>
            }
          </ul>
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
)(UserControlPanel3);
