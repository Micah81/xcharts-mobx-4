import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';
import { VictoryCandlestick } from 'victory';



////-------------------------------------------------------
class CandlestickChart extends React.Component {
  render () {
    if(this.props.chartStore.chartData) {
      return (
        <div>
        <VictoryCandlestick
          data={this.props.chartStore.chartData.slice()}
        />
        </div>
      );
    } else {
      return (
        <div>
          <p>There was an error!</p>
        </div>
      );
    }
  }
}



export default compose(
  inject('chartStore'),
  observer
)(CandlestickChart);
