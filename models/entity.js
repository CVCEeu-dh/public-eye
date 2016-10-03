var path     = require('path'),
    settings = require('../settings'),
    _        = require('lodash'),
    helpers  = require('../helpers/common')(settings);
/*
  custom representation of an entity.
  instantioate with Entity()
  Noramlize the entity to fit our annotation model according to the rules specified in settings.services[service].mapping
*/
module.exports = function(settings){
  // loop through properties mapping (cfr. settings.services.mapping)
  function loopProperties(props, mapping, depth){
    var _props = {},
        depth = depth||0;
    for(var i in mapping){
      // console.log(i, _.isPlainObject(mapping[i]), depth)
      if(_.isPlainObject(mapping[i]))
        _props[i] = loopProperties(props, mapping[i], depth+1);
      else{
        // console.log(' get::::', mapping[i])
        _props[i] = _.get(props, mapping[i]);
      }
    }
    return _props;
  };

  return function(properties, service, text){
    var self = this;
    // console.log(properties)
    // normalize according to service, if provided
    if(!service)
      throw 'service param not found';// self.props = _.defaultDeep(properties, context);

    // use loopProperties in order to loop through properties mappings, service specific.
    self.props = _.defaults(loopProperties(properties, settings.services[service].mapping), {
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
    });
    
    // to be refactored
    if(service == 'stanfordNER'){
      console.log(properties);
      self.props.context.right = self.props.context.left + self.props.name.length;
      self.props.type = [self.props.type.toLowerCase()]
    }

    // correct rightmost cut (e.g. babelfy service)
    if(settings.services[service].rightOffset)
      self.props.context.right += settings.services[service].rightOffset;
    
    if(settings.services[service].leftOffset)
      self.props.context.right += settings.services[service].leftOffset;
    
    if(text && _.isEmpty(self.props.matchedText)){ // just cut text
      self.props.matchedText = text.substring(self.props.context.left, self.props.context.right)
      if(!self.props.name){
        self.props.name = self.props.matchedText;
      }
    };

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
};