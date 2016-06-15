/*
  Default settings.
  Ovverride them if needed while requiring the module.

*/
module.exports = {
  services: {
    // textrazor service
    textrazor: {
      apiKey: '', // override api key in localsettings
      endpoint: 'https://api.textrazor.com',
      extractors: 'entities'
    },
    // spotlight service. Each language run in a separate port in the same server
    // cfr spotlight service to see how language implementation works.
    // port number are given according to http://spotlight.sztaki.hu/downloads/demo/start_all.sh
    spotlight: {
      endpoints: {
        en: 'http://localhost:2222/rest',
        de: 'http://localhost:2226/rest'
      }
    }
  }
};