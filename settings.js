/*
  Default settings.
  Ovverride them if needed while requiring the module.

*/


module.exports = {
  services: {
    // textrazor service
    textrazor: {
      apiKey: '', // override api key in localsettings
      endpoint: 'https://api.textrazor.com',
      extractors: 'entities',
      dailylimit: 500,
      // mapping this service REST structure to ours, cfr. https://www.textrazor.com/docs/rest#Entity
      entities: 'response.entities',
      mapping: {
        type: 'type',
        name: 'entityId',
        matchedText: 'matchedText',
        wikidata: 'wikidataId',
        wiki: 'wikiLink',
        context: {
          left: 'startingPos',
          right: 'endingPos',
          relevance: 'relevanceScore', // 0.0 to 1.0
          confidence: 'confidenceScore' // 0.5 to 10.0 (should be transformed to 0.0 - 1.0 @todo)
        }
      }
    },
    // spotlight service. Each language run in a separate port in the same server
    // cfr spotlight service to see how language implementation works.
    // Demo of spotlight annotation is availbale at: https://dbpedia-spotlight.github.io/demo/
    // port number are given according to http://spotlight.sztaki.hu/downloads/demo/start_all.sh
    spotlight: {
      confidence:0.5,
      support:0,
      spotter:'Default',
      disambiguator:'Default',
      policy:'whitelist',
      endpoints: {
        en: 'http://www.dbpedia-spotlight.com/en/annotate',
        // in this case, the english demo is given. uncomment the following to get local stuff
        // en: 'http://localhost:2222/rest',
        // de: 'http://localhost:2226/rest'
      },
      entities: 'Resources',
      mapping: {
        name: '@surfaceForm',
        type: '@types',
        wiki: '@URI',
        context:{
          left: '@offset'
        }
      }
    },

    babelfy: {
      endpoint: 'https://babelfy.io/v1/disambiguate', // ?text={text}&lang={lang}&key={key},
      key: '',
      match: 'EXACT_MATCHING',
      extAIDA: true,
      dailylimit: 1000,
      rightOffset: 1,
      mapping: {
        dbpedia: 'DBpediaURL',
        name: 'rr',
        context: {
          left: 'charFragment.start',
          right: 'charFragment.end',
          relevance: 'globalScore',
          confidence: 'coherenceScore'
        }
      }
    },

    // local stanfordNER using the node ner library. Override this configs in your local project if needed
    stanfordNER: {
      port: 9191,
      host: 'localhost',

      entities: '_parsed',
      mapping: {
        type: '1',
        name: '2',
        context: {
          left: 'index'
        }
      }
    },

    // OTHER SERVICES
    geonames: {
      endpoint: 'http://api.geonames.org/search', // substitute here if needed. It can be override
      username: 'demo', // override in your local settings
      type: 'json',
      entities: 'geonames',
      maxRows: 5
    }
  }
};