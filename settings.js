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
    // port number are given according to http://spotlight.sztaki.hu/downloads/demo/start_all.sh
    spotlight: {
      endpoints: {
        en: 'http://localhost:2222/rest',
        de: 'http://localhost:2226/rest'
      },
      // @todo mapping for spotlight service
      mapping: {}
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
    }
  }
};