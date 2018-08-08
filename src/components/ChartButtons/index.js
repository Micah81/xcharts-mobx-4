import React from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';
import Button from '@material-ui/core/Button';

const ChartButtons = ({ chartStore }) => (
  <div>
  {
    console.log(
      chartStore.activeSymbol
    )
  }
    <Button variant="contained" color="primary"
    onClick={() => chartStore.test(chartStore.activeSymbol)}>
      Up
    </Button>
  </div>
);

export default compose(
  inject('chartStore'),
  observer
)(ChartButtons)
