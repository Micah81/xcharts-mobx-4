import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';
import { VictoryCandlestick } from 'victory';

class CandlestickChart extends Component {
  render() {
    return (
      <div>
        <VictoryCandlestick
          data={this.props.chartStore.chartData.slice()}
        />
      </div>
    )
  }
}

export default compose(
  inject('chartStore'),
  observer
)(CandlestickChart);
