import React from 'react';
import CandlestickChart from '../Chart';
import ChartAcctHistory from '../ChartAcctHistory';
import ChartButtons from '../ChartButtons';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import UserControlPanel1 from '../UserControlPanel/UserControlPanel1';
import UserControlPanel2 from '../UserControlPanel/UserControlPanel2';
import UserControlPanel3 from '../UserControlPanel/UserControlPanel3';
import UserControlPanel4 from '../UserControlPanel/UserControlPanel4';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 1,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

function LandingPage(props) {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <Grid container spacing={24}>

        <Grid item xs={6} sm={6}>
          <Paper className={classes.paper}><ChartAcctHistory/></Paper>
        </Grid>
        <Grid item xs={6} sm={6}>
          <Paper className={classes.paper}><CandlestickChart/></Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper className={classes.paper}><ChartButtons/></Paper>
        </Grid>


        <Grid item xs={6} sm={9}>
          <Paper className={classes.paper}><UserControlPanel4/></Paper>
        </Grid>

        <Grid item xs={6} sm={9}>
          <Paper className={classes.paper}><UserControlPanel3/></Paper>
        </Grid>



          <Grid item xs={6} sm={3}>
            <Paper className={classes.paper}><UserControlPanel1/></Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper className={classes.paper}><UserControlPanel2/></Paper>
          </Grid>


      </Grid>
    </div>
  );
}

export default withStyles(styles)(LandingPage);
