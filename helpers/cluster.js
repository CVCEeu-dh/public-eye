var _ = require('lodash');
/*
  @params services Array of available services
*/

module.exports = function(settings){
  return function(options) {
    if(!options.entities)
      throw 'helpers/cluster: no options.entities param found';

    // we group by _id, cfr. models/entity module on how this is done.
    // otherwise you can send a specific function by using the options.groupBy param
    var groups = _(options.entities)
      .groupBy(options.groupBy || '_id')
      .map(function(aliases){
        var clu = {
          name: _(aliases)
                .map('name')
                .uniq(),
          type: _(aliases)
                .map('type')
                .flatten()
                .compact()
                .uniq(),
          dbpedia: null,
          wiki: null,// the final part
          wikidata: null,
        };

        clu.context = _(aliases)
          .map('context')
          .flatten()
          .value()
        
        return clu;
      })
      .value();




    // console.log(groups)
    return [];
  }
};