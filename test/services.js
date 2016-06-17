var _             = require('lodash'),
    should        = require('should'),
    settings      = require('../settings'),
    localsettings = require('./settings.local'),
    publicEye     = require('../index')(_.defaultsDeep({}, localsettings, settings));

var text = 'First documented in the 13th century, Berlin was the capital of the Kingdom of Prussia (1701–1918), the German Empire (1871–1918), the Weimar Republic (1919–33) and the Third Reich (1933–45). Berlin in the 1920s was the third largest municipality in the world. After World War II, the city became divided into East Berlin -- the capital of East Germany -- and West Berlin, a West German exclave surrounded by the Berlin Wall from 1961–89. Following German reunification in 1990, the city regained its status as the capital of Germany, hosting 147 foreign embassies.';
    

describe('index: access services', function() {
  it('should check default services availability', function(done) {
    should.equal(typeof publicEye.textrazor, 'function');
    should.equal(typeof publicEye.spotlight, 'function');
    should.equal(typeof publicEye.babelify, 'function');
    done();
  });

  it('should check textrazor service if you add the textrazor api', function(done) {
    publicEye.textrazor({
      text: text,
    }, function(err, response){
      console.log(err, response)
      should.not.exist(err);
      should.exist(response.length);
      done();
    });
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

  it('should check babelify service', function(done) {
    publicEye.babelify({
      text: text
    }, function(err, response){
      should.not.exist(err);
      should.exist(response.length);
      done();
    });
  });
});

describe('services:series', function(done){
  // it('should check our wonderful series service', function(done) {

  //   publicEye.series({
  //     services:[
  //       'textrazor',
  //       'babelify'
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
    publicEye.series({
      services:[
        'textrazor',
        'babelify'
      ],
      text: text
    }, function(err, response){
      should.not.exist(err);
      should.equal(response.language, 'en');
      done();
    });
  });
});