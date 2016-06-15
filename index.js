/*
  Export modules
*/
var _        = require('lodash');
    

module.exports = function(settings) {
  var services = require('require-all')({
    dirname: __dirname + '/services',
    resolve     : function (fn) {
      return fn(settings);
    }
  });

  return _.assign({

  }, services);
};