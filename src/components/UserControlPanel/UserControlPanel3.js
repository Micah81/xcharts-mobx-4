import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';
import { VictoryCandlestick } from 'victory';

// stats
class UserControlPanel3 extends React.Component {
  render () {
    if(this.props.sessionStore.authUser) {
      return (
        <div>
          <h3>Open Trades</h3>
          <ul>
            {
              (this.props.chartStore.openTrades).map((data) =>
                <li>{data}</li>
              )
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
