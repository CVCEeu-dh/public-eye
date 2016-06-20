
NodeJS package for entity disambiguation and text annotation.

## About
A lot of named entity disambiguation services are available on the web. They all expose a solid REST api and they all disambiguate on top of DBpedia resources. *PublicEye* is a tiny library aiming at harmonize the different annotation results, and it is able to automatically detect the language of the given text thanks to the languagedetect library.

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

More services to come, stay tuned!