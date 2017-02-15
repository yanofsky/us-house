var gm = require('gm');
var glob = require('glob');
var Promise = require('bluebird')

var image64 = 'us-house/images/headshots/64x64/';
var image128 = 'us-house/images/headshots/128x128/';
var image256 = 'us-house/images/headshots/256x256/';
var image512 = 'us-house/images/headshots/512x512/';
var image1024 = 'us-house/images/headshots/1024x1024/';

glob('source/headshots/*.jpg', { ignore: 'source/headshots/template.jpg' }, function (er, files) {
  if (files.length === 0) {
    console.log('× No headshot images to convert');
  } else {
    Promise.each(files, function(file){
      return resizeImage(file, file.replace(/^.*[\\\/]/, ''))
    });
  }
});

/**
 * Resize Headshot Images
 * @param fullSizeImage
 * @param fileName
 */
function resizeImage (fullSizeImage, fileName) {
  // Check that Base Image Exists and is Correct Size
  gm(fullSizeImage).size(function (err, size) {
    if (err) {
      console.error(err);
    } else if (size.width !== 1024 || size.height !== 1024) {
      console.error(fullSizeImage + ' is not 1024 x 1024 pixels in size.');
    } else {

      var queue = [];

      // Make 64x64 Image
      queue.push(function() {
        return new Promise(function(resolve, reject) {
          gm(fullSizeImage).resize(64, 64).noProfile().write(image64 + fileName, function (err) {
            if (!err) {
              console.log('✓ Created ./' + image64 + fileName);
              resolve();
            } else {
              console.error('× ' + err + ': ' + image64 + fileName);
              reject();
            }
          });
        });
      });

      // Make 128x128 Image
      queue.push(function() {
        return new Promise(function(resolve, reject) {
          gm(fullSizeImage).resize(128, 128).noProfile().write(image128 + fileName, function (err) {
            if (!err) {
              console.log('✓ Created ./' + image128 + fileName);
              resolve();
            } else {
              console.error('× ' + err + ': ' + image128 + fileName);
              reject();
            }
          });
        });
      });

      // Make 256x256 Image
      queue.push(function() {
        return new Promise(function(resolve, reject) {
          gm(fullSizeImage).resize(256, 256).noProfile().write(image256 + fileName, function (err) {
            if (!err) {
              console.log('✓ Created ./' + image256 + fileName);
              resolve();
            } else {
              console.error('× ' + err + ': ' + image256 + fileName);
              reject();
            }
          });
        });
      });

      // Make 512x512 Image
      queue.push(function() {
        return new Promise(function(resolve, reject) {
          gm(fullSizeImage).resize(512, 512).noProfile().write(image512 + fileName, function (err) {
            if (!err) {
              console.log('✓ Created ./' + image512 + fileName);
              resolve();
            } else {
              console.error('× ' + err + ': ' + image512 + fileName);
              reject();
            }
          });
        });
      });

      // Make 1024x1024 Image
      queue.push(function() {
        return new Promise(function(resolve, reject) {
          gm(fullSizeImage).resize(1024, 1024).noProfile().write(image1024 + fileName, function (err) {
            if (!err) {
              console.log('✓ Created ./' + image1024 + fileName);
              resolve();
            } else {
              console.error('× ' + err + ': ' + image1024 + fileName);
              reject();
            }
          });
        });
      });

      Promise.each(queue, function(queue_item) {
        return queue_item();
      });
    }
  });
}