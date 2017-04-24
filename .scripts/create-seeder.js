var fs = require('fs');
var path = require('path');

var collection, data;
var seeder_file = path.join(__dirname, '../us-house/data/20170101000000-house-seeder.js');
var data_file = path.join(__dirname, '../us-house/data/us-house.json');

function createSeeder() {
  var seeder = "module.exports = {\n" +
  "  up: function (queryInterface) {\n" +
  "    return queryInterface.bulkInsert('house', " +
  JSON.stringify(collection, null, 4) +
  ", {\n" +
  "      updateOnDuplicate: [ 'state_name', 'state_name_slug', 'state_code', 'state_code_slug', 'district', 'at_large', 'vacant', 'bioguide', 'thomas', 'govtrack', 'opensecrets', 'votesmart', 'fec', 'maplight', 'wikidata', 'google_entity_id', 'title', 'party', 'name', 'name_slug', 'first_name', 'middle_name', 'last_name', 'name_suffix', 'goes_by', 'pronunciation', 'gender', 'ethnicity', 'religion', 'openly_lgbtq', 'date_of_birth', 'entered_office', 'term_end', 'biography', 'phone', 'fax', 'latitude', 'longitude', 'address_complete', 'address_number', 'address_prefix', 'address_street', 'address_sec_unit_type', 'address_sec_unit_num', 'address_city', 'address_state', 'address_zipcode', 'address_type', 'website', 'contact_page', 'facebook_url', 'twitter_handle', 'twitter_url', 'photo_url', 'shape', 'modified_date', 'shape' ]\n" +
  "    }).catch(function (err) {\n" +
  "      if (err && err.errors) {\n" +
  "        for (var i = 0; i < err.errors.length; i++) {\n" +
  "          console.error('× SEED ERROR', err.errors[ i ].type, err.errors[ i ].message, err.errors[ i ].path, err.errors[ i ].value);\n" +
  "        }\n" +
  "      } else if (err && err.message) {\n" +
  "        console.error('× SEED ERROR', err.message);\n" +
  "      }\n" +
  "    });\n" +
  "  },\n" +
  "    down: function (queryInterface) {\n" +
  "    return queryInterface.bulkDelete('house', null, {});\n" +
  "  }" +
  "};\n";

  seeder = seeder.replace(/"queryInterface/g, 'queryInterface');
  seeder = seeder.replace(/}'\)"/g, '}\')');
  seeder = seeder.replace(/"new Date\(\)"/g, 'new Date()');
  seeder = seeder.replace(/"([a-z_]+)":/g, '$1:');

  fs.writeFile(seeder_file, seeder);
}

if (!fs.existsSync(data_file)) {
  console.error('× Missing JSON Data: ' + data_file.replace(path.join(__dirname, '../'), './'));
} else {

  collection = [];
  data = JSON.parse(fs.readFileSync(data_file, 'utf8'));

  for (var i = 0; i < data.length; i++) {

    var geojsonFile = 'us-house/geojson/us-house-';

    if (data[i].district) {
      geojsonFile += data[i].state_code_slug + '-' + data[i].district + '.geojson';
    } else {
      geojsonFile += data[i].state_code_slug + '.geojson';
    }

    var contents = fs.readFileSync(path.join(__dirname, '../' + geojsonFile), 'utf8');
    var geojson = JSON.parse(contents);

    data[i].shape = 'queryInterface.sequelize.fn(\'ST_GeomFromGeoJSON\', \'' + JSON.stringify(geojson.geometry) + '\')';
    data[i].created_date = 'new Date()';
    data[i].modified_date = 'new Date()';
    collection.push(data[i]);
  }

  createSeeder();

  console.log('\n☆ Seeder Creation Completed ' + '\n');
}
