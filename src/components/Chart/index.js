import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';
import { VictoryCandlestick } from 'victory';

class CandlestickChart extends Component {
  render() {
    return (
      <div>
        <h1>Chart</h1>
        <VictoryCandlestick
          data={this.chartStore}
        />
      </div>
    )
  }
}

export default compose(
  inject('chartStore'),
  observer
)(CandlestickChart);
