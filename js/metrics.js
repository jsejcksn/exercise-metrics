// Exercise Metrics

var exMetrics = (function() {

console.log('Exercise Metrics');

var metrics = '',
  date = ['x'],
  distance = ['Distance (km)'],
  pace = ['Pace (m/s)'];

function tsvToJson(input) {
  var info = input.replace(/['"]/g, ''),
    lines = info.split('\n'),
    firstLine = lines.shift().split('\t'),
    json = [];

  // Helper function to remove quotes and parse numeric values
  function removeQuotes(string) {
    string = string.replace(/(['"])/g, "\\$1");
    if (!isNaN(string)) {
      string = parseFloat(string);
    }
    return string;
  }

  $.each(lines, function(index, item) {
    var lineItem = item.split('\t'),
      jsonLineEntry = {};

    $.each(lineItem, function(index, item) {
      jsonLineEntry[firstLine[index]] = removeQuotes(item);
    });
    json.push(jsonLineEntry);

  });

  return json;
}

function update() {
  for (var i = 0; i < metrics.length; i++) {
    if (metrics[i].activity === 'Run') {
      date.push(metrics[i].date);
      distance.push((metrics[i].distance) / 1000);
      pace.push(metrics[i].pace);
    }
  }
  // Truncate arrays to contain only the 10 most recent records
  var date2 = date.slice(-10),
    distance2 = distance.slice(-10),
    pace2 = pace.slice(-10);
  date = date.slice(0, 1);
  date = date.concat(date2);
  distance = distance.slice(0, 1);
  distance = distance.concat(distance2);
  pace = pace.slice(0, 1);
  pace = pace.concat(pace2);
  console.log((date.length - 1) + ' running, ' + metrics.length + ' total');
}

// This should become an option for file upload or copy/paste input
// From https://developers.google.com/web/updates/2015/03/introduction-to-fetch?hl=en
function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

function json(response) {
  return response.json();
}

fetch('metrics/exercise-metrics.json')
  .then(status)
  .then(json)
  .then(function(data) {
    console.log('Request succeeded with JSON response', data);
    metrics = data;
  })
  .catch(function(error) {
    console.log('Request failed', error);
  });

setTimeout(update, 500);

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

setTimeout(function() {
  chart.load({
    columns: [
      date,
      pace,
      distance
    ]
  });
}, 750);

//  IDvar.addEventListener('click', someFunc);

})();
