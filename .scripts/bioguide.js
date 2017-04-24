var fs = require('fs');
var csv = require('fast-csv');
var values = require('object.values');
var http = require('http');
var jsdom = require("node-jsdom").jsdom;

if (!Object.values) {
  values.shim();
}

var core = 'source/us-house.csv';

// This file is ignored as we just need the file
var converted = 'us-house/data/us-house-bioguide.csv';
var currentRow = 0;

if (fs.existsSync(core)) {
  fs.truncate(converted, 0, function() {
    var stream = fs.createReadStream(core);

    csv.fromStream(stream, { headers : true }).validate(function(data){
      return true;
    })
      .on('data-invalid', function(){
        console.error('× Aborted Converting CSV File');
        process.exit(1);
      })
      .on('data', function(data){

        if (currentRow === 0) {
          var header = 'bioguide,bio' + '\n';
          fs.appendFile(converted, header);
        }

        // Keep track of bioguide's we might have already fetched
        var skip = [];

        if (data.bioguide !== '' && skip.indexOf(data.bioguide) === -1) {

          var options = {
            host: 'bioguide.congress.gov',
            port: 80,
            path: '/scripts/biodisplay.pl?index=' + data.bioguide,
            method: 'GET'
          };

          var req = http.request(options, function(res) {
            res.on('data', function (chunk) {
              var document = jsdom(chunk);
              var window = document.parentWindow;

              var bio = [].map.call( window.document.querySelectorAll('p'), function(v) {
                return v.textContent || v.innerText || "";
              });

              var name = [].map.call( window.document.querySelectorAll('p font'), function(v) {
                return v.textContent || v.innerText || "";
              });

              if (bio[0] && name[0]) {
                var biography = bio[0].replace(name[0], data.first_name + ' ' + data.last_name + ', ').replace(/(\r\n|\n|\r)/gm, '');
                var row = '"' + data.bioguide + '","' + biography + '"' + '\n';
                fs.appendFile(converted, row);
              }
            });
          });

          req.on('error', function(e) {
            console.log('problem with request: ' + e.message);
          });

          req.end();

        }

        console.log('✓ Processed ' + data.first_name + ' ' + data.last_name);

        currentRow++;
      })
      .on('end', function(){
        console.log('\n☆ CSV Process Completed ' + '\n');
      });
  });
} else {
  console.log(path + ' not found');
}