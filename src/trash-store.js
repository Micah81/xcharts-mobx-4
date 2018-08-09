///---------------------------------------------

@action updateChart(ActiveSymbol, Vote, User){
  // record vote
  var today = moment().format('MMDDYYYY');
  if (Vote === 'Up') {
    db.voteUp(ActiveSymbol, today, User)
  } else if (Vote ==='Down') {
    db.voteDown(ActiveSymbol, today, User)
  } else if (Vote === 'Sideways') {
    db.voteSideways(ActiveSymbol, today, User)
  } else if (Vote === 'Unsure') {
    db.voteUnsure(ActiveSymbol, today, User)
  }

    // change activeSymbol
    this.n++
    console.log('n: ',this.n)

    // update activeSymbol
    this.activeSymbol = this.allSymbols[this.n]

    // get chartData for new activeSymbol
    api.fetchChartData(this.activeSymbol).then(
      console.log('1a',
        api.fetchChartData(this.activeSymbol)
      )
    )

    console.log('Active Symbol: ', ActiveSymbol)
    console.log(this.allSymbols[this.n])
    console.log('chartData: ', this.chartData)
}
