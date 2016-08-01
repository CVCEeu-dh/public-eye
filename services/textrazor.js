var request = require('request'),
    ISOcode = require('../ISOcodes'),
    _       = require('lodash');

var textrazor = function(settings){
  return function(options, next) {
    var params   = _.defaults(options, _.get(settings,'services.textrazor', {})),
        required = ['apiKey', 'endpoint', 'text', 'extractors'],
        missing  = _.difference(required, _.keys(params));

    if(missing.length)
      return next('args missing', missing);

    if(options.language){
      // get the current translation
      params.languageOverride = _.get(_.find(ISOcode, {'ISO-639-1': options.language}),'ISO-639-2', options.language);
    }

    // console.log(params)
    // the request itself
    request
      .post({
        url: params.endpoint,
        json: true,
        form: params
      }, function (err, res, body) {
        if(err)
          return next(err);

        if(body.error)
          return next(body.error, body);
        
        if(!body.response)
          return next(body.error);
        
        // console.log('body', _.keys(body.response));
        next(null, body);
      })
  }
};

module.exports = textrazor;