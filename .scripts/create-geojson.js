var fs = require('fs');
var path = require('path');
var slug = require('slug');

var pjson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

var geojson, data;
var geojson_file = path.join(__dirname, '../source/us-house.geojson');
var data_file = path.join(__dirname, '../us-house/data/us-house.json');

var collection = {
  "type": "FeatureCollection",
  "provider": {
    "name": "Civil Services",
    "email": "hello@civil.services",
    "twitter": "https://twitter.com/CivilServiceUSA",
    "homepage": "https://civil.services",
    "repository": "https://github.com/CivilServiceUSA/us-house-ny-new-york"
  },
  "features": []
};

/**
 * Get JSON Properties for Given District
 * @param district
 * @returns {*}
 */
function getProperties(district) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].district === district) {
      return data[i];
    }
  }
}

/**
 * Create Single District Map
 * @param data - GeoJSON Data for District
 */
function createDistrictMap(data) {
  var district = {
    "type": "Feature",
    "provider": {
      "name": "Civil Services",
      "email": "hello@civil.services",
      "twitter": "https://twitter.com/CivilServiceUSA",
      "homepage": "https://civil.services",
      "repository": "https://github.com/CivilServiceUSA/us-house-ny-new-york"
    },
    "properties": data.properties,
    "geometry": data.geometry
  };

  var filename = 'us-house/geojson/us-house-' + slug(pjson.cityData.state_code, { lower: true, replacement: '-' }) + '-' + slug(pjson.cityData.city_name, { lower: true, replacement: '-' }) + '-' + slug(data.district, { lower: true, replacement: '-' }) + '.geojson';
  fs.writeFile(filename, JSON.stringify(district, null, 2));

  console.log('✓ Created ./' + filename);
}

/**
 * Create All Districts Map
 */
function createDistrictsMap() {
  var filename = 'us-house/geojson/us-house-' + slug(pjson.cityData.state_code, { lower: true, replacement: '-' }) + '-' + slug(pjson.cityData.city_name, { lower: true, replacement: '-' }) + '.geojson';
  fs.writeFile(filename, JSON.stringify(collection, null, 2));

  console.log('✓ Created ./' + filename);
}


if (!fs.existsSync(geojson_file)) {
  console.error('× Missing GeoJSON Source: ' + geojson_file.replace(path.join(__dirname, '../'), './'));
} else if (!fs.existsSync(data_file)) {
  console.error('× Missing JSON Data: ' + data_file.replace(path.join(__dirname, '../'), './'));
} else {

  geojson = JSON.parse(fs.readFileSync(geojson_file, 'utf8'));
  data = JSON.parse(fs.readFileSync(data_file, 'utf8'));

  for (var i = 0; i < geojson.features.length; i++) {
    geojson.features[i].properties = getProperties(geojson.features[i].district);

    collection.features.push(geojson.features[i]);

    createDistrictMap(geojson.features[i]);
  }

  createDistrictsMap();

  console.log('\n☆ GeoJSON Creation Completed ' + '\n');
}

