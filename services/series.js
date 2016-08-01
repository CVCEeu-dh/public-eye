var request = require('request'),
    _       = require('lodash'),
    async   = require('async');

/*
  Return the result of a series of services(options.services) on the same text (options.text)
  for the given language (options.language).
  If options.language param is not given, use languagedetect library to guess the top language.
  Return a very complex object.
*/
module.exports = function(settings){
  var Entity  = require('../models/entity')(settings);

  return function(options, next) {
    if(!options.language) {
      var LD = require('languagedetect'),
          ld = new LD('iso2');

      options.language = _(ld.detect(options.text, 1))
        .flatten()
        .compact()
        .first();
      
      if(!options.language)
        return next('language not found');
    }

    // require common utils: helpers for and cluster for harmonizing entities exxtracted from different services
    var helpers = require('../helpers/common')(settings),
        cluster = require('../helpers/cluster')(settings);

    // for each services in options.services:
    async.series(_.map(options.services, function(service){
      return function(callback){
        var fn = require('./'+service)(settings);

        fn({
          text: options.text,
          language: options.language
        }, function(err, res){
          if(err)
            return callback(err);
          // console.log(_.keys(res), res);
          // where the list of entities is? If it is not specified, the whole response will be used
          // otherwise, put a string for _.get() function in settings.services[your-service].entities ....
          var entities = settings.services[service].entities? _.get(res, settings.services[service].entities): res;

          // apply service specific properties mapping to each entity
          callback(null, _.map(entities, function(ent) {
            var entity = new Entity(ent, service, options.text);
            entity.context.language = options.language;
            entity.context.service = service;
            // console.log(entity);
            return entity;
          }));
        });
      }
    }), function(err, results){
      if(err)
        return next(err);
      

      // return {content: 'original content', language: options.language, annotated: 'annotated content', services: []}
      next(null, {
        text: options.text,
        language: options.language,
        entities: _.flatten(results)
      });
    });
  };
};