var _ = require('lodash');
// annotate
module.exports = function(settings){
  // options.content, options.points
  return function(options) {
    var options = options || {},
        splitpoints = [], // sorted left and right options.points in order to segment options.content. 
        chunks = []; // the annotation chunks to be enriched.
    
    // sort options.points by context.left ASC, context.right ASC
    options.points = _.sortBy(options.points, function(d){
      return d.context.left + d.context.right
    });
    
    
    // array of left plus right splitpoint to chunk the string
    splitpoints = _.sortBy(_.uniq([0, options.content.length].concat(
      _.map(options.points, function(d){
        return d.context.left
      })).concat(
      _.map(options.points, function(d){
        return d.context.right
      }))
    ), function(d) {
      return d
    });
    
    // console.log(splitpoints)
    for(var i = 0; i < splitpoints.length - 1; i++) {
      
      // get the leftmost or rightmost for this splitpoint
      var ls = _.uniq(_.map(options.points.filter(function(d) {
        return d.context.left == splitpoints[i] || d.context.right == splitpoints[i + 1]
      }), '_id'));
      
      chunks.push({
        s: options.content.slice(splitpoints[i], splitpoints[i + 1]),
        l: splitpoints[i],
        r: splitpoints[i + 1],
        links: ls
      })
    };
    
    if(!options.isMatch) {
      // join chunks as markdown string like a pro
      var result =  _.reduce(chunks, function(reduced, c) {
        var res = [reduced.s || reduced];
        
        if(c.links.length)
          res.push('[', c.s, '](', c.links.join(','), ')');
        else
          res.push(c.s);
          
        return res.join('');
      });
      // reduce when there is just one chunk
      return typeof result == 'string'? result: result.s;
      
    } else {
      var mch = [],
        fch = chunks.filter(function (d) {
          return d.links.length
        });
      // concatenate adjacent fch (filtered chunks)
      for(var i = 0, l = fch.length; i < l; i++) {
        if(i == 0 && fch[i].l > 0)
          mch.push(' [...] ')
        if(fch[i].links.length && fch[i].links[0] != -1)
          mch.push('[', fch[i].s, '](', fch[i].links.join(','), ')');
        else
          mch.push(fch[i].s)
        if(i + 1 < l && fch[i].r != fch[i+1].l)
          mch.push(' [...] ')
        else if(i == l-1 && fch[i].r < options.content.length)
          mch.push(' [...] ')
      }
      
      return mch.join('')
      // .filter(function (d) {
      //   return d.links.length
      // })
    }
  }
};
