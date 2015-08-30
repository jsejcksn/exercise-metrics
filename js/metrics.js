// Exercise Metrics

// Variables ----------

var metrics = '';
var date = ['x'];
var distance = ['Distance (km)'];
var pace = ['Pace (m/s)'];


// Functions ----------

function update() {
  for (var i = 0; i < metrics.length; i++) {
    if (metrics[i].activity == 'Run') {
      date.push(metrics[i].date);
      distance.push((metrics[i].distance) / 1000);
      pace.push(metrics[i].pace);
    }
  }
  console.log(date.length + ' running, ' + metrics.length + ' total');
}


// EventListeners ----------




// Execute ----------

console.log('Exercise Metrics');

// This should become an option for file upload or copy/paste input
// From https://developers.google.com/web/updates/2015/03/introduction-to-fetch?hl=en
fetch('metrics/exercise-metrics.json')
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }

      // Examine the text in the response
      response.json().then(function(data) {
        console.log(data);
        metrics = data;
      });
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });

setTimeout(update,500);

var chart = c3.generate({
  bindto: '#chart',
  data: {
    x: 'x',
//  xFormat: '%Y%m%d', // 'xFormat' can be used as custom format of 'x'
    columns: [
//    ['x', '2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05', '2013-01-06'],
//    ['x', '20130101', '20130102', '20130103', '20130104', '20130105', '20130106'],
//    ['data1', 30, 200, 100, 400, 150, 250],
//    ['data2', 130, 340, 200, 500, 250, 350],
    ]
  },
  axis: {
    x: {
      type: 'timeseries',
      tick: {
        format: '%Y-%m-%d'
      }
    }
  }
});

setTimeout(function () {
  chart.load({
    columns: [
      date,
      pace,
      distance
    ]
  });
}, 750);
