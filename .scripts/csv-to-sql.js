var fs = require('fs');
var data = require('../us-house/data/us-house.json');
var values = require('object.values');

if (!Object.values) {
  values.shim();
}

fs.truncate('us-house/data/us-house.sql', 0, function() {
  for (var i = 0; i < data.length; i++) {
    var query = 'INSERT INTO `us-house` (`' + Object.keys(data[i]).join('`, `') + '`) VALUES ("' + Object.values(data[i]).join('", "') + '");\n';
    fs.appendFile('us-house/data/us-house.sql', query.replace(/""/g, 'null'));
  }
});