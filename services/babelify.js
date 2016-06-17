var request = require('request'),
    _       = require('lodash');

var babelify = function(settings){
  return function(options, next) {
    var params   = _.defaults(options, _.get(settings,'services.babelify', {})),
        required = ['endpoint', 'text'],
        missing  = _.difference(required, _.keys(params));

    if(missing.length){
      console.log('args missing: ', missing)
      return next('args missing', missing);
    }

    // language autodetect (iso2, e.g. 'en' instead of 'english' or 'eng')
    if(!params.language) {
      var LD = require('languagedetect'),
          ld = new LD('iso2');

      params.language = _(ld.detect(options.text, 1))
        .flatten()
        .compact()
        .first();
      
      if(!params.language)
        return next('language not found');
      
      console.log(params.language)
      params.lang = params.language;
    }

    
    request
      .post({
        headers: {
          'Accept':  'application/json'
        },
        url: params.endpoint + '/disambiguate',
        json: true,
        form: params
      }, function (err, res, body) {
        if(err)
          return next(err);
        next(null, body);
      });
  }
};

module.exports = babelify;