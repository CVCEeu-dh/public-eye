
NodeJS package for easy access to entity disambiguation services and text annotation in markdown.

## About
A lot of named entity disambiguation services are available on the web like [Babelfy](http://babelfy.org/), [Textrazor](https://www.textrazor.com/). They all expose a solid REST api and they all disambiguate on top of DBpedia resources. [PublicEye](https://github.com/CVCEeu-dh/public-eye) is a tiny open source library aiming at harmonize the different annotation results, and it is able to automatically detect the language of the given text thanks to the awesome [languagedetect](https://www.npmjs.com/package/languagedetect) library.

Note: we have just added a basic service for local *stanfordNER* via the [ner](https://www.npmjs.com/package/ner) node library, check this out!



## Installation
	npm install public-eye --save

## simple usage
More example are provided in the /test folder.
The very first thing to do is to require the library and correctly set apikeys provided by the different services:

``` javascript
var publicEye   = require('public-eye')({
    services: {
      textrazor: {
        apiKey: 'your-api-key'
      },
      babelfy: {
        key: 'your-babelfy-api-key'
      }
    }
  });
```
 
Once the library is available to your script, the easiset way to uniform and harmonize different services on the same text is using the `series` method:

``` javascript
publicEye.series({
      services:[
        'textrazor',
        'babelfy'
      ],
      text: 'First documented in the 13th century, Berlin was the capital of the Kingdom of Prussia (1701–1918), the German Empire (1871–1918), the Weimar Republic (1919–33) and the Third Reich (1933–45)'
    }, function(err, response){
    	// ... response.entities 
    	
    })

```

The usage type for [textrazor](http://textrazor.com) entity disambiguation:

``` javascript
  
  var publicEye   = require('public-eye')({
    services: {
      textrazor: {
        apiKey: 'your-api-key'
      }
    }
  });
  
  // ..

  publicEye.textrazor({
    text: 'First documented in the 13th century, Berlin was the capital of the Kingdom of Prussia (1701–1918), the German Empire (1871–1918), the Weimar Republic (1919–33) and the Third Reich (1933–45). Berlin in the 1920s was the third largest municipality in the world. After World War II, the city became divided into East Berlin -- the capital of East Germany -- and West Berlin, a West German exclave surrounded by the Berlin Wall from 1961–89. Following German reunification in 1990, the city regained its status as the capital of Germany, hosting 147 foreign embassies.'
  }, function(err, response){
    // ...
    // your callback here, response.entities is the list of entities with startingPos and endingPos
  })

```

Usage type for [babelfy](http://babelfy.org):

``` javascript
  
  var publicEye   = require('public-eye')({
    services: {
      babelfy: {
        key: 'your-api-key'
      }
    }
  });
  
  // ..

  publicEye.babelfy({
    text: 'First documented in the 13th century, Berlin was the capital of the Kingdom of Prussia (1701–1918), the German Empire (1871–1918), the Weimar Republic (1919–33) and the Third Reich (1933–45). Berlin in the 1920s was the third largest municipality in the world. After World War II, the city became divided into East Berlin -- the capital of East Germany -- and West Berlin, a West German exclave surrounded by the Berlin Wall from 1961–89. Following German reunification in 1990, the city regained its status as the capital of Germany, hosting 147 foreign embassies.'
  }, function(err, response){
    // ...
    // your callback here, response is the list of entities with startingPos and endingPos
  })

```

Usage type for [StanfordNER](http://nlp.stanford.edu/software/CRF-NER.shtml), cfr. [ner node library](https://www.npmjs.com/package/ner) documentation:

```javascript
  var publicEye   = require('public-eye')({
    services: {
      stanfordNER: {
        port: 9191,
        host: 'localhost'
      }
    }
  });
  
  publicEye.stanfordNER({
    text: 'First documented in the 13th century, Berlin was the capital of the Kingdom of Prussia (1701–1918), the German Empire (1871–1918), the Weimar Republic (1919–33) and the Third Reich (1933–45). Berlin in the 1920s was the third largest municipality in the world. After World War II, the city became divided into East Berlin -- the capital of East Germany -- and West Berlin, a West German exclave surrounded by the Berlin Wall from 1961–89. Following German reunification in 1990, the city regained its status as the capital of Germany, hosting 147 foreign embassies.'
    }, function(err, body){
      console.log(res.entities);
      // => { LOCATION: 
      //      [ 'Berlin',
      //        'Prussia',
      //        'Weimar',
      //        'Berlin',
      //        'East Berlin',
      //        'East Germany',
      //        'West Berlin',
      //        'Berlin',
      //        'Germany' ],
      //      ORGANIZATION: [],
      //      DATE: 
      //      [ '13th century',
      //        '1918',
      //        '1918',
      //        '1919',
      //        '1933',
      //        '1920s',
      //        '1961',
      //        '1990' ],
      //      MONEY: [],
      //      PERSON: [ 'Reich' ],
      //      PERCENT: [],
      //      TIME: [] }

    });
```

More services to come, stay tuned!