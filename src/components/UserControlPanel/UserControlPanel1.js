import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';
import { VictoryCandlestick } from 'victory';

// stats
class UserControlPanel1 extends React.Component {
  render () {
    if(this.props.sessionStore.authUser) {
      return (
        <div>
          <h3>Watchlists</h3>
          <p><u><strong>Stocks</strong></u> ({(this.props.chartStore.allSymbols).length})</p>
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
)(UserControlPanel1);
