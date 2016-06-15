var localsettings,
    _ = require('lodash');

// optional localsettings, e.g in order to override textrazor api
try{
  localsettings = require('./settings.local');
} catch(e){
  console.log('local module not found');
  if(e.code !== 'MODULE_NOT_FOUND')
    throw e;
}

var settings = _.defaultsDeep(localsettings || {}, {
  services: {
    // textrazor service
    textrazor: {
      apiKey: '', // override api key in localsettings
      endpoint: 'https://api.textrazor.com',
      extractors: 'entities'
    },
    // spotlight service. Each language run in a separate port in the same server
    // cfr spotlight service to see how language implementation works.
    spotlight: {
      endpoint: 'http://spotlight.dbpedia.org/rest',
      languages: {
        en: {
          port: 2222
        },
        fr: {
          port: 2223
        }
      }
    }
  }
});
console.log(settings)
module.exports = settings;
