# Public-Eye
![Build Status](https://travis-ci.org/CVCEeu-dh/public-eye.svg?branch=master)

A lot of named entity disambiguation services, like [dpedia spotlight](https://dbpedia-spotlight.github.io/demo/), are now available on the web. They all expose a solid REST api and they all disambiguate on top of DBpedia resources. They have different output format, though, this is where [Public-Eye](https://github.com/CVCEeu-dh/public-eye) comes in handy. 
Public-Eye is a tiny open source library aiming at **harmonize** the different annotation results, and gives you access to language detection automatically thanks to the awesome [languagedetect](https://www.npmjs.com/package/languagedetect) library.

```javascript
// minimalistic example with spotlight

var publicEye     = require('public-eye')();
var text = 'First documented in the 13th century, Berlin was the capital of the Kingdom of Prussia (1701–1918), the German Empire (1871–1918), the Weimar Republic (1919–33) and the Third Reich (1933–45). Berlin in the 1920s was the third largest municipality in the world. After World War II, the city became divided into East Berlin -- the capital of East Germany -- and West Berlin, a West German exclave surrounded by the Berlin Wall from 1961–89. Following German reunification in 1990, the city regained its status as the capital of Germany, hosting 147 foreign embassies.';

publicEye.spotlight({
  text: text
}, (err, ressponse) => {
  // ... response.Resources gives you a list of
  // {
  //    ...
  //    Resources: [
  //	  { 
  //        "@URI": "http://dbpedia.org/resource/German_reunification",
  //        "@support": "1989",
  //        "@types": "",
  //        "@surfaceForm": "German reunification",
  //        "@offset": "449",
  //        "@similarityScore": "0.9999997861474641",
  //        "@percentageOfSecondRank": "1.5374345655254399E-7"
  //      }
  //    ]
  //  }
});
```


This tiny lirbrary gives you easy access to a number of **named entity disambiguation services**: [dpedia spotlight](https://dbpedia-spotlight.github.io/demo/), [Babelfy](http://babelfy.org/) or [Textrazor](https://www.textrazor.com/). We have just added a basic service for local *stanfordNER* via the [ner](https://www.npmjs.com/package/ner) node library.
The public-eye "mapping service" translates each proprietary format to a common one; this means text annotation from multiple services.

## Installation
	npm install public-eye --save

## simple examples and configuration hints
More example are provided in the `/test ` folder.
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

Usage type for [geonames search](http://www.geonames.org/export/geonames-search.html):

```javascript

  var publicEye   = require('public-eye')({
    services: {
      geonames: {
        username: 'your-username'
      }
    }
  });

  publicEye.geonames({
    text: 'Osh' // a city in Kyrgyzstan
  }, function(err, body){
      // console.log(body.geonames)
      // => [ 
      //      { adminCode1: '08',
      //        lng: '72.7985',
      //        geonameId: 1527534,
      //        toponymName: 'Osh',
      //        countryId: '1527747',
      //        fcl: 'P',
      //        population: 200000,
      //        countryCode: 'KG',
      //        name: 'Osh',
      //        fclName: 'city, village,...',
      //        countryName: 'Kyrgyzstan',
      //        fcodeName: 'seat of a first-order administrative division',
      //        adminName1: 'Osh',
      //        lat: '40.52828',
      //        fcode: 'PPLA' 
      //       },
      //       ...
      //     ]
  });

```

More services to come, stay tuned!
