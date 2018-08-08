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
        sessionStore.authUser.email
      )}>
      Up
    </Button>
    <Button variant="contained" color="primary"
    onClick={() => chartStore.updateChart(
        chartStore.activeSymbol,
        'Down',
        sessionStore.authUser.email
      )}>
      Down
    </Button>
    <Button variant="contained" color="primary"
    onClick={() => chartStore.updateChart(
        chartStore.activeSymbol,
        'Sideways',
        sessionStore.authUser.email
      )}>
      Sideways
    </Button>
    <Button variant="contained" color="primary"
    onClick={() => chartStore.updateChart(
        chartStore.activeSymbol,
        'Unsure',
        sessionStore.authUser.email
      )}>
      Unsure
    </Button>
  </div>
);

export default compose(
  inject('chartStore', 'sessionStore'),
  observer
)(ChartButtons)
