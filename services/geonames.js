var request = require('request'),
    _       = require('lodash');

var geonames = function(settings){
  return function(options, next) {
    var params   = _.defaults(options, _.get(settings,'services.geonames', {})),
        required = ['endpoint', 'text', 'username'],
        missing  = _.difference(required, _.keys(params));

    if(missing.length){
      console.log('args missing: ', missing)
      return next('args missing', missing);
    }
    
    params.q = params.text;

    request
      .get({
        headers: {
          'Accept':  'application/json'
        },
        url: params.endpoint,
        json: true,
        qs: params
      }, function (err, res, body) {
        if(err)
          return next(err);
        next(null, body);
      });
  }
};

module.exports = geonames;