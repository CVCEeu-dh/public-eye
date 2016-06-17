var request = require('request'),
    _       = require('lodash');

var spotlight = function(settings){

  return function(options, next) {
    var params   = _.defaults(options, _.get(settings,'services.spotlight', {})),
        required = ['endpoints', 'text'],
        missing  = _.difference(required, _.keys(params));

    if(missing.length)
      return next('args missing', missing);

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
    }

    if(!params.endpoints[params.language]){
      return next('endpoint not found for the language: '+params.language);
    }
    console.log('connecting to:', params.endpoints[params.language] + '/annotate')
    request
      .post({
        headers: {
          'Accept':  'application/json'
        },
        url: params.endpoints[params.language] + '/annotate',
        json: true,
        form: params
      }, function (err, res, body) {
        if(err)
          return next(err);
        next(null, body);
      });
  }
};

module.exports = spotlight;