import React from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';

const Counter = ({ counterStore }) => (
  <div>
    <button onClick={() => counterStore.increment()}>+1</button>
    <span>{ counterStore.counter }</span>
    <button onClick={() => counterStore.decrement()}>-1</button>
  </div>
);

export default compose(
  inject('counterStore'),
  observer
)(Counter)
