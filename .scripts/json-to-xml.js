var fs = require('fs');
var obj = require('../us-house/data/us-house.json');
var js2xmlparser = require('js2xmlparser');

var xml = js2xmlparser.parse('us-house', { 'councilor': obj });

fs.writeFile('us-house/data/us-house.xml', xml);