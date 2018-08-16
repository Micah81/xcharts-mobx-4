let otrades = undefined
/*
  Here, it gets the whole function, and needs to
  instead get the data returned by the function.
*/
otrades = await db.getOpenTrades(User)
runInAction(() => {
  console.log('otrades:',otrades)
  /*
    When it updates here, this data doesnt work
    with the table. The data was good, but it becomes
    a function.
  */
  this.rows = otrades
  console.log('this.rows',this.rows)
})




@action
async updateOpenTrades(User, rows){
  try {

    // replacement code :
    //PROBLEM: THIS DB DOES NOT REFER TO THE FILE CONTAINING THIS FUNCTION
    // DB IS REFERRING TO FIREBASE
    db.getOpenTrades(User).then((data) => {
      this.rows = data
    })

    //-------------------------------------------
    // Replace the code below with different form
    //-------------------------------------------
    //-------------------------------------------
  } catch (error) {
      runInAction(() => {
          console.log('Error in chartStore in updateOpenTrades', error)
      })
  }
}
