import React from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';
import Button from '@material-ui/core/Button';

const ChartButtons = ({ chartStore, sessionStore }) => (
  <div>
    <Button variant="contained" color="primary"
    onClick={() => chartStore.updateChart(
        chartStore.activeSymbol,
        'Up',
        sessionStore.authUser.uid
      )}>
      Up
    </Button>
    <Button variant="contained" color="primary"
    onClick={() => chartStore.updateChart(
        chartStore.activeSymbol,
        'Down',
        sessionStore.authUser.uid
      )}>
      Down
    </Button>
    <Button variant="contained" color="primary"
    onClick={() => chartStore.updateChart(
        chartStore.activeSymbol,
        'Sideways',
        sessionStore.authUser.uid
      )}>
      Sideways
    </Button>
    <Button variant="contained" color="primary"
    onClick={() => chartStore.updateChart(
        chartStore.activeSymbol,
        'Unsure',
        sessionStore.authUser.uid
      )}>
      Unsure
    </Button>
  </div>
);

export default compose(
  inject('chartStore', 'sessionStore'),
  observer
)(ChartButtons)
