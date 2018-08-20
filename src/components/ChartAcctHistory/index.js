import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';
import { VictoryChart, VictoryArea, VictoryGroup, VictoryStack, VictoryPortal, VictoryScatter } from 'victory';

class ChartAcctHistory extends React.Component {
  render () {
    if(this.props.chartStore.accountHistory) {
      return (
        <div>
          <VictoryChart scale={{ x: "time" }}>
            <VictoryStack colorScale="warm">
              <VictoryGroup
                data={this.props.chartStore.accountHistory.slice()}
              >
                <VictoryArea/>
               <VictoryPortal>
                  <VictoryScatter
                    style={{ data: { fill: "black" } }}
                  />
                </VictoryPortal>
              </VictoryGroup>
            </VictoryStack>
          </VictoryChart>
        </div>
      );
    } else {
      return (
        <div>
          <p>There was an error getting the accountHistory:</p>
          <p>{this.props.chartStore.chartData}</p>
        </div>
      );
    }
  }
}


export default compose(
  inject('chartStore'),
  observer
)(ChartAcctHistory);
