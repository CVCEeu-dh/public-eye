var _          = require('lodash'),
    should     = require('should'),
    settings   = require('../settings'),
    publicEye  = require('../index')(settings);

describe('index: access services', function() {
  it('should check default services availability', function(done) {
    should.equal(typeof publicEye.textrazor, 'function');
    should.equal(typeof publicEye.spotlight.annotate, 'function');
    should.equal(typeof publicEye.babelify.disambiguate, 'function');
    done();
  });

  // it('should check textrazor service if you add the textrazor api', function(done) {
  //   publicEye.textrazor({
  //     text: 'First documented in the 13th century, Berlin was the capital of the Kingdom of Prussia (1701–1918), the German Empire (1871–1918), the Weimar Republic (1919–33) and the Third Reich (1933–45). Berlin in the 1920s was the third largest municipality in the world. After World War II, the city became divided into East Berlin -- the capital of East Germany -- and West Berlin, a West German exclave surrounded by the Berlin Wall from 1961–89. Following German reunification in 1990, the city regained its status as the capital of Germany, hosting 147 foreign embassies.',
  //     apiKey: '', // override api key to test properly
  //   }, function(err, response){
  //     should.not.exist(err);
  //     should.exist(response.length);
  //     done();
  //   });
  // });

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
    publicEye.babelify.disambiguate({
      text: 'First documented in the 13th century, Berlin was the capital of the Kingdom of Prussia (1701–1918), the German Empire (1871–1918), the Weimar Republic (1919–33) and the Third Reich (1933–45). Berlin in the 1920s was the third largest municipality in the world. After World War II, the city became divided into East Berlin -- the capital of East Germany -- and West Berlin, a West German exclave surrounded by the Berlin Wall from 1961–89. Following German reunification in 1990, the city regained its status as the capital of Germany, hosting 147 foreign embassies.',
      key: ''
    }, function(err, response){
      should.not.exist(err);
      console.log(response)
      should.exist(response.length);
      done();
    });
  });
});