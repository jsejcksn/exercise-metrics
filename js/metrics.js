// Exercise Metrics

(function() {
  'use strict';

  console.log('Exercise Metrics');

  var metrics = '',
    date = ['x'],
    distance = ['Distance (km)'],
    limit = parseInt(document.getElementById('limit-entries').value),
    pace = ['Pace (m/s)'],
    sampleTSV = 'date\tactivity\tduration\tdistance\tpace\n2015-05-01\tRun\t1440\t4700\t3.264\n2015-05-07\tRun\t1425\t4700\t3.298\n2015-05-12\tRun\t1593\t5000\t3.139\n2015-05-18\tRun\t1417\t4700\t3.317\n2015-05-22\tRun\t1661\t5207\t3.135\n2015-05-27\tRun\t1440\t4700\t3.264\n2015-05-31\tRun\t1385\t4700\t3.394\n2015-06-04\tRun\t1407\t4718\t3.353\n2015-06-07\tRun\t1389\t4718\t3.397\n2015-06-28\tRun\t1012\t3316\t3.277\n2015-07-09\tRun\t998\t3316\t3.323\n2015-07-12\tRun\t1500\t3015\t2.01\n2015-07-14\tRun\t1244\t4083\t3.282',
    sampleJSON = tsvToJson(sampleTSV),
    tsv = document.getElementById('data-input');

  function fillTSV() {
    tsv.value = localStorage.exerciseDataTSV;
  }

  function storeTSV() {
    console.log('Storing TSV data');
    localStorage.setItem('exerciseDataTSV', tsv.value);
  }

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

  function update(data) {
    console.log('Updating chart');
    metrics = tsvToJson(data);
    for (var i = 0; i < metrics.length; i++) {
      if (metrics[i].activity === 'Run') {
        date.push(metrics[i].date);
        distance.push((metrics[i].distance) / 1000);
        pace.push(metrics[i].pace);
      }
    }
    // Truncate arrays to contain only the 10 most recent records
    limit = parseInt(document.getElementById('limit-entries').value);
    var date2 = date.slice(-limit),
      distance2 = distance.slice(-limit),
      pace2 = pace.slice(-limit);
    date = date.slice(0, 1);
    date = date.concat(date2);
    distance = distance.slice(0, 1);
    distance = distance.concat(distance2);
    pace = pace.slice(0, 1);
    pace = pace.concat(pace2);

    console.log((date.length - 1) + ' running, ' + metrics.length + ' total');

    chart.load({
      columns: [
        date,
        pace,
        distance
      ]
    });
  }

  var chart = c3.generate({
    bindto: '#chart',
    data: {
      x: 'x',
      columns: []
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

  tsv.value = sampleTSV;
  tsv.addEventListener('keyup', storeTSV);

  if (localStorage.getItem('exerciseDataTSV') !== (null || '' || ' ')) { // Key exists and is not empty or a single space
    fillTSV();
  }

  btn.addEventListener('click', function() {
    update(tsv.value);
  });

  setTimeout(function() {
    update(tsv.value);
  }, 500);

}());
