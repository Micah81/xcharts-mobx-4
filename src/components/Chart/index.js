import React from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';
import { VictoryCandlestick } from 'victory';

const CandlestickChart = ({ chartStore }) => (
  <div>
  <h1>Chart</h1>
  {console.log(chartStore.chartData)}
  <VictoryCandlestick
    data={
      chartStore.chartData
    }
    />
  </div>
);

export default compose(
  inject('chartStore'),
  observer
)(CandlestickChart)
