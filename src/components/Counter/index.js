import React from 'react';
import { observer } from 'mobx-react';
import store from './store.js';

const Counter = () => (
  <div>
    <button onClick={() => store.increment()}>+1</button>
    <span>{store.counter}</span>
    <button onClick={() => store.decrement()}>-1</button>
  </div>
);

export default observer(Counter);
