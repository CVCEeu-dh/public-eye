var _ = require('lodash');
/*
  @params services Array of available services
*/

module.exports = function(settings){
  return function(options) {
    if(!options.entities)
      throw 'helpers/cluster: no options.entities param found';

    _(options.entities)
      .groupBy(function(entity){

      })
    return [];
  }
};