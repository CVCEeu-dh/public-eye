var _             = require('lodash'),
    should        = require('should'),
    settings      = require('../settings'),
    localsettings = require('./settings.local'),
    publicEye     = require('../index')(_.defaultsDeep({}, localsettings, settings));

describe('helpers: access helpers', function() {
  it('should check helpers availability', function(done) {
    should.equal(typeof publicEye.annotate, 'function');
    should.equal(typeof publicEye.cluster, 'function');
    done();
  });
});

describe('helpers: annotate', function() {
  it('should annotate a text given OVERLAPPING splitpoints', function(done) {
    var annotations = publicEye.annotate({
      content: 'First documented in the 13th century, Berlin was the capital of the Kingdom of Prussia (1701–1918), the German Empire',
      points: [
        {
          id: 'wikidata/Q5119',
          context: {
            left: 68,
            right: 86
          }
        },
        {
          id: 'wikidata/Q38872',
          context: {
            left: 79,
            right: 86
          }
        }
      ]
    });
    should.equal(annotations, 'First documented in the 13th century, Berlin was the capital of the [Kingdom of ](wikidata/Q5119)[Prussia](wikidata/Q5119,wikidata/Q38872) (1701–1918), the German Empire')
    done();
  });
})