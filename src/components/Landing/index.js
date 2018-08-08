import React from 'react';
import Counter from '../Counter';
import CandlestickChart from '../Chart';
import ChartButtons from '../ChartButtons';

const LandingPage = () =>
  <div>
    <h1>Landing</h1>
    <p>The Landing Page is open to everyone, even though the user isnt signed in.</p>
    <Counter/>
    <CandlestickChart/>
    <ChartButtons/>
  </div>

export default LandingPage;
