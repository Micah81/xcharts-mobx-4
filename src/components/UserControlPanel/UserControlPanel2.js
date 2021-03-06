import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';
import { VictoryCandlestick } from 'victory';

// stats
class UserControlPanel2 extends React.Component {
  render () {
    if(this.props.sessionStore.authUser) {
      return (
        <div>
          <h3>Account</h3>
          <p>${
            (this.props.chartStore.accountBalance).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
          }</p>
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
)(UserControlPanel2);
