var ner = require('ner'),
    _   = require('lodash');

module.exports = function(settings){
  return function(options, next) {
    var params   = _.defaults(options, _.get(settings,'services.stanfordNER', {})),
        required = ['port', 'host', 'text'],
        missing  = _.difference(required, _.keys(params));

    if(missing.length)
      return next('args missing', missing);

    if(params.text.trim().length == 0){
      next('empty params.text');
      return;
    }

    ner.get({
        port: params.port || 9191,
        host: params.host || 'localhost'
    }, params.text, next);
  }
}