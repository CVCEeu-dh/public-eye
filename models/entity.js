var path     = require('path'),
    settings = require('../settings'),
    _        = require('lodash'),
    helpers  = require('../helpers/common')(settings);
/*
  custom representation of an entity.
  instantioate with Entity()
  Noramlize the entity to fit our annotation model according to the rules specified in settings.services[service].mapping
*/
module.exports = function(properties, service){
  var self = this,
      generic = {
        name: '',
        type: [],
        dbpedia: null,
        wiki: null,// the final part
        wikidata: null,
        slug: false,
        context: // context
        {
          left: -1,
          right: -1
        }
      };

  // normalize according to service, if provided
  if(!service)
    self.props = _.defaultDeep(properties, context);
  else{
    function loopProperties(obj, depth){
      var _obj = {},
          depth = depth||0;
      for(var i in obj){
        // console.log(i, _.isPlainObject(obj[i]), depth)
        if(_.isPlainObject(obj[i]))
          _obj[i] = loopProperties(obj[i], depth+1);
        else{
          // console.log(' get::::', obj[i])
          _obj[i] = _.get(properties, obj[i]);
        }
      }
      return _obj;
    }
    
    self.props = _.defaults(loopProperties(settings.services[service].mapping), generic);
  }

  // add the slug field
  if(self.props.slug === false){
    self.props.slug = helpers.slugify(self.props.name);
  }

  // add an uniqueid (e.g. if wikidata use wikidata, else dbpedia last part)
  self.props._id = _([
    self.props.dbpedia? 'wiki-' + path.basename(self.props.dbpedia): null,
    self.props.wiki? 'wiki-' + path.basename(self.props.wiki): null,
    self.props.wikidata? 'wikidata-' +  self.props.wikidata: null,
    self.props.slug
  ])
    .compact()
    .first();

  // apply mapping if service is specified

  return self.props;
};