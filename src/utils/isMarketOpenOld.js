module.exports = {
  isMarketOpen: function (today) {
    var calendario = require('calendario');
    calendario.use('US-MT');
    let status = calendario.isWorkday(new Date(today));
    return(status)
  }
}
