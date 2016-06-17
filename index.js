/*
  usage type:

  var publicEye   = require('public-eye')({
    services: {
      textrazor: {
        apiKey: 'your-api-key'
      }
    }
  });
  
  ..

  publicEye.textrazor({
    text: 'First documented in the 13th century, Berlin was the capital of the Kingdom of Prussia (1701–1918), the German Empire (1871–1918), the Weimar Republic (1919–33) and the Third Reich (1933–45). Berlin in the 1920s was the third largest municipality in the world. After World War II, the city became divided into East Berlin -- the capital of East Germany -- and West Berlin, a West German exclave surrounded by the Berlin Wall from 1961–89. Following German reunification in 1990, the city regained its status as the capital of Germany, hosting 147 foreign embassies.'
  }, function(err, response){
    // ...
    // your callback here, response is the list of entities with startingPos and endingPos
  })
  

*/
var settings = require(__dirname + '/settings'),
    _        = require('lodash'),
    requireall = require('require-all');
    

module.exports = function(localSettings) {
  var services, helpers;

  services = requireall({
    dirname: __dirname + '/services',
    resolve     : function (fn) {
      return fn(_.defaultsDeep(localSettings, settings));
    }
  });

  services = requireall({
    dirname: __dirname + '/helpers',
    resolve     : function (fn) {
      return fn(_.defaultsDeep(localSettings, settings));
    }
  });

  return _.assign({},
    helpers, 
    services
  );
};