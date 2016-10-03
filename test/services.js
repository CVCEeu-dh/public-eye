var _             = require('lodash'),
    should        = require('should'),
    settings      = require('../settings'),
    localsettings = require('./settings.local'),
    publicEye     = require('../index')(_.defaultsDeep({}, localsettings, settings));

var text = 'First documented in the 13th century, Berlin was the capital of the Kingdom of Prussia (1701–1918), the German Empire (1871–1918), the Weimar Republic (1919–33) and the Third Reich (1933–45). Berlin in the 1920s was the third largest municipality in the world. After World War II, the city became divided into East Berlin -- the capital of East Germany -- and West Berlin, a West German exclave surrounded by the Berlin Wall from 1961–89. Following German reunification in 1990, the city regained its status as the capital of Germany, hosting 147 foreign embassies.';
    

describe('services:access', function() {
  it('should check default services availability', function(done) {
    should.equal(typeof publicEye.textrazor, 'function');
    should.equal(typeof publicEye.spotlight, 'function');
    should.equal(typeof publicEye.babelfy, 'function');
    done();
  });


  // it('should check spotlight service', function(done) {
  //   publicEye.spotlight.annotate({
  //     text: 'First documented in the 13th century, Berlin was the capital of the Kingdom of Prussia (1701–1918), the German Empire (1871–1918), the Weimar Republic (1919–33) and the Third Reich (1933–45). Berlin in the 1920s was the third largest municipality in the world. After World War II, the city became divided into East Berlin -- the capital of East Germany -- and West Berlin, a West German exclave surrounded by the Berlin Wall from 1961–89. Following German reunification in 1990, the city regained its status as the capital of Germany, hosting 147 foreign embassies.'
  //   }, function(err, response){
  //     should.not.exist(err);
  //     console.log(response)
  //     should.exist(response.length);
  //     done();
  //   });
  // });

  
});


describe('services:stanfordNER', function(){
  it('should check stanford NER availability via web service', function(done){
    publicEye.stanfordNER({
      text: text
    }, function(err, body){
      should.not.exist(err);
      should.exist(body.raw)
      // check settings.js, section stanfordNER.mapping
      should.exist(body._parsed.length)
      should.exist(body._parsed[0].index)
      should.exist(body._parsed[0][1])
      should.exist(body._parsed[0][2])
      done();
    });
  });

  it('should map the stanfordNER object correctly', function(done){
    // this is the result of a call agains ner-server.sh (copy https://raw.githubusercontent.com/niksrc/ner/master/ner-server.sh)
    // java -mx1000m -cp "$scriptdir/stanford-ner.jar:$scriptdir/lib/*" edu.stanford.nlp.ie.NERServer  -loadClassifier $scriptdir/classifiers/english.muc.7class.distsim.crf.ser.gz -port 9191 -outputFormat inlineXML
    //
    // Example:
    //
    // [ 
    //   '<DATE>13th century</DATE>',
    //   'DATE',
    //   '13th century',
    //   index: 24,
    //   input: 'First documented in the <DATE>13th century</DATE>, <LOCATION>Berlin</LOCATION> was the capital of the Kingdom of <LOCATION>Prussia</LOCATION> (1701–<DATE>1918</DATE>), the German Empire (1871–<DATE>1918</DATE>), the <LOCATION>Weimar</LOCATION> Republic (<DATE>1919</DATE>–33) and the Third <PERSON>Reich</PERSON> (<DATE>1933</DATE>–45). <LOCATION>Berlin</LOCATION> in the <DATE>1920s</DATE> was the third largest municipality in the world. After World War II, the city became divided into <LOCATION>East Berlin</LOCATION> -- the capital of <LOCATION>East Germany</LOCATION> -- and <LOCATION>West Berlin</LOCATION>, a West German exclave surrounded by the <LOCATION>Berlin</LOCATION> Wall from <DATE>1961</DATE>–89. Following German reunification in <DATE>1990</DATE>, the city regained its status as the capital of <LOCATION>Germany</LOCATION>, hosting 147 foreign embassies.' 
    // ]
    
    

    var t_ent = {
      0: '<DATE>13th century</DATE>',
      1: 'DATE', // i.e; the type
      2: '13th century',
      index: 24
    };

    var ent = new require('../models/entity')(settings)(t_ent, 'stanfordNER');
    should.equal(ent.context.left, t_ent.index);
    should.equal(ent.context.right, t_ent.index + t_ent[2].length);
    should.equal(ent.type.join(''),  [t_ent[1]].join('').toLowerCase());
    done();
  })
})

describe('services:textrazor', function(){
  it('should check textrazor service if you add the textrazor api', function(done) {
    if(!publicEye.settings.services.textrazor.apiKey){
      console.warn("  ... skipping, you didn't set textrazor credentials in `test/settings.local.js`")
      done();
      return;
    }
    this.timeout(10000);
    publicEye.textrazor({
      text: text,
    }, function(err, body){
      // console.log(err, response)
      should.not.exist(err);
      should.exist(body.response.entities.length);
      done();
    });
  });

  it('should map the textrazor object correctly', function(done){
    var t_ent = {
      id: 34,
      type: [ 'Place', 'PopulatedPlace', 'Country' ],
      matchingTokens: [ 90, 91 ],
      entityId: 'German reunification',
      freebaseTypes: [ '/film/film_subject', '/book/book_subject', '/time/event' ],
      confidenceScore: 25.2308,
      wikiLink: 'http://en.wikipedia.org/wiki/German_reunification',
      matchedText: 'German reunification',
      freebaseId: '/m/0gl3y',
      relevanceScore: 0.655139,
      entityEnglishId: 'German reunification',
      startingPos: 449,
      endingPos: 469,
      wikidataId: 'Q56039'
    };
    var ent = new require('../models/entity')(settings)(t_ent, 'textrazor');
    // console.log(ent);
    should.equal(ent.context.left, t_ent.startingPos);
    should.equal(ent.context.right, t_ent.endingPos);
    should.equal(ent.context.relevance, t_ent.relevanceScore);
    should.equal(ent.context.confidence, t_ent.confidenceScore);
    should.equal(ent.type.join(''),  t_ent.type.join(''));
    should.equal(ent.slug, 'german-reunification');
    should.equal(ent._id, 'wiki-German_reunification'); // last part of the wiki link
    done();
  })
});

describe('services:babelfy', function(){
  it('should check babelfy service', function(done) {
    if(!publicEye.settings.services.textrazor.apiKey){
      console.warn("  ... skipping, you didn't set textrazor credentials in `test/settings.local.js`")
      done();
      return;
    }
    this.timeout(10000);
    publicEye.babelfy({
      text: text
    }, function(err, body){
      should.not.exist(err);
      should.exist(body.length); // a list of entities
      done();
    });
  });
  it('should map the babelfy object correctly (should provide context)', function(done){
    var b_ent = {
      "tokenFragment":{
        "start":4, 
        "end":4
      },
      "charFragment":{"start":19, "end":30},
      "babelSynsetID":"bn:00010388n",
      "DBpediaURL":"http://dbpedia.org/resource/Multilingualism",
      "BabelNetURL":"http://babelnet.org/rdf/s00010388n",
      "score":0.9,
      "coherenceScore":0.5,
      "globalScore":0.06428571428571428,
      "source":"BABELFY"
    };
    var ent = new require('../models/entity')(settings)(b_ent, 'babelfy', 'BabelNet is both a multilingual encyclopedic dictionary and a semantic network');
    // console.log(ent);
    should.equal(ent.context.left, b_ent.charFragment.start);
    should.equal(ent.context.right, b_ent.charFragment.end + 1);
    should.equal(ent.context.relevance, b_ent.globalScore);
    should.equal(ent.context.confidence, b_ent.coherenceScore);
    should.equal(ent.slug, 'multilingual');
    should.equal(ent._id, 'wiki-Multilingualism'); // last part of the wiki link
    done();
  })
})

describe('services:series', function(){
  // it('should check our wonderful series service', function(done) {

  //   publicEye.series({
  //     services:[
  //       'textrazor',
  //       'babelfy'
  //     ],
  //     language: 'en',
  //     text: text
  //   }, function(err, response){
  //     should.not.exist(err);
  //     should.exist(response.language);
  //     should.equal(response.content);
  //     done();
  //   });
  // });

  it('should detect the language automatically if it is not given', function(done) {
    this.timeout(5000);
    publicEye.series({
      services:[
        'textrazor',
        'babelfy',
        'stanfordNER'
      ],
      text: text
    }, function(err, response){
      should.not.exist(err);
      should.equal(response.language, 'en');
      done();
    });
  });
});