/*
  For test purposes. Fill in the missing field to enable the tests for the various services.
  Copy and paste the file as settings.local.js under the /test folder
  Uncomment the services you don't use in order to run proper tests
*/
module.exports ={
  services:{
    textrazor: {
      apiKey: 'your-api-key', // override api key in localsettings
    },
    babelfy:{
      key: 'your-api-key'
    },
    stanfordNER: {
      port: 9191,
      host: 'localhost'
    },
    geonames: {
      username: 'demo', // override with yours
      type: 'json'
    }
  },
};