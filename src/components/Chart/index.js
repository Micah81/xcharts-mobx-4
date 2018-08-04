import React from 'react';
import { observer } from 'mobx-react';
import store from './store.js';
import { VictoryCandlestick } from 'victory';

const CandlestickChart = () => (
  <div>
    <VictoryCandlestick
      data={store.chartData}
    />
  </div>
);

export default observer(CandlestickChart);
