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
          <h3>xCharts Account</h3>
          <p>{
            //a db.function that returns the account balance
          }$10,000</p>
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
