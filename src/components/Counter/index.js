import React from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';
import Button from '@material-ui/core/Button';

const Counter = ({ counterStore }) => (
  <div>
    <Button onClick={() => counterStore.increment()}>+1</Button>
    <span>{ counterStore.counter }</span>
    <Button onClick={() => counterStore.decrement()}>-1</Button>
  </div>
);

export default compose(
  inject('counterStore'),
  observer
)(Counter)
