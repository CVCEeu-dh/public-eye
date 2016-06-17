module.exports = function(settings){
  return {
    slugify: function(text) {
    var from = 'àáäâèéëêìíïîòóöôùúüûñç',
        to   = 'aaaaeeeeiiiioooouuuunc',
        text = text.toLowerCase();
        
    for (var i=0, l=from.length ; i<l ; i++) {
      text = text.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }
    
    return text.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-{1,}/g,'-')
      .replace(/-$/,'')
      .replace(/^-/, '');
    }
  };
};