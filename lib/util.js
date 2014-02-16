module.exports = (function() {

  var Util = {}

  Util.formToDate = function(date, time) {
    var dateValues = date.split('/')
    var timeValues = time.split(':')
    var isAfternoon = timeValues[1].split(' ')[1] == 'PM'
    timeValues[1] = timeValues[1].split(' ')[0]
    var date = new Date(parseInt(dateValues[2], 10), parseInt(dateValues[0], 10) - 1, parseInt(dateValues[1], 10))
    date.setHours(parseInt(timeValues[0], 10) + (isAfternoon ? 12 : 0))
    date.setMinutes(parseInt(timeValues[1], 10))
    date.setSeconds(0)
    return date
  }

  return Util

})()
