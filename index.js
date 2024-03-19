const getCollection = require("./triggers/collection");
const addApiKeyToHeader = (request, z, bundle) => {
  if (bundle.authData.apiKey) {
  request.headers['X-Api-Key'] = bundle.authData.apiKey;
  }
  return request
}

module.exports = {
  // This is just shorthand to reference the installed dependencies you have.
  // Zapier will need to know these before we can upload.
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  // If you want your trigger to show up, you better include it here!
  triggers: {
    [getCollection.key]: getCollection
  },

  // If you want your searches to show up, you better include it here!
  searches: {},

  // If you want your creates to show up, you better include it here!
  creates: {},

  resources: {},

  authentication: {
    type: 'custom',
    fields: [
      {
        key: 'apiKey',
        label: 'API Key',
        required: true,
        helpText: 'Find the API Key in your [app settings page](https://postman.co/settings/me/api-keys)',
      },
    ],
    test: (z, bundle) => {
      const request = {
        url: 'https://api.getpostman.com/me',
        headers: {
          'X-Api-Key': bundle.authData.apiKey 
        }
      };
      const promise = z.request(request);
      return promise.then(response => {
        if (response.status !== 200) {
          throw new Error('Invalid API Key');
        }
      });
    }
  }

};
