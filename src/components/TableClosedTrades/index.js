import React from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
});

const TableClosedTrades = ({ chartStore, sessionStore }) => (
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <CustomTableCell>Symbol</CustomTableCell>
              <CustomTableCell>Date Opened</CustomTableCell>
              <CustomTableCell numeric>Price Opened</CustomTableCell>
              <CustomTableCell numeric>Date Closed</CustomTableCell>
              <CustomTableCell numeric>Price Closed</CustomTableCell>
              <CustomTableCell numeric>P/L</CustomTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(chartStore.closedTrades).map(closedTrades => {
              return (
                <TableRow key={closedTrades.id}>
                  <CustomTableCell component="th" scope="row">
                    {closedTrades.symbol}
                  </CustomTableCell>
                  <CustomTableCell>{closedTrades.dateOpened}</CustomTableCell>
                  <CustomTableCell>{closedTrades.priceOpened}</CustomTableCell>
                  <CustomTableCell>{closedTrades.dateClosed}</CustomTableCell>
                  <CustomTableCell>{closedTrades.priceClosed}</CustomTableCell>
                  <CustomTableCell>{closedTrades.pl}</CustomTableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>



)

export default compose(
  inject('chartStore', 'sessionStore'),
  observer
)(TableClosedTrades)
