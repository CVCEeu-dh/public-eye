var request = require('request'),
    _       = require('lodash');

var spotlight = function(settings){

  return {
    annotate: function(options, next) {
      var params   = _.defaults(options, _.get(settings,'services.spotlight', {})),
          required = ['endpoint', 'text'],
          missing  = _.difference(required, _.keys(params));

      if(missing.length)
        return next('args missing', missing);

      request
        .post({
          headers: {
            'Accept':  'application/json'
          },
          url: params.endpoint + '/annotate',
          json: true,
          form: params
        }, function (err, res, body) {
          if(err)
            return next(err);

          console.log(err, body)
          // console.log('body', _.keys(body.response));
          // next(null, body.response.entities || []);
        });
    }
  }
};

module.exports = spotlight;