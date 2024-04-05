const getCollection = require("./triggers/collection");

const test = (z, bundle) => {
  return z
    .request({
      url: "https://api.getpostman.com/me",
      headers: {
        "X-Api-Key": bundle.authData.apiKey,
      },
    })
    .then((response) => {
      if (response.status === 200) {
        const data = z.JSON.parse(response.content);
        const username = data.user.username;
        return {
          username: username,
        };
      }
      // If the response is not 200, throw an error
      throw new z.errors.Error("Invalid API Key", response.status);
    });
};

const addApiKeyToHeader = (request, z, bundle) => {
  if (bundle.authData.apiKey) {
    request.headers["X-Api-Key"] = bundle.authData.apiKey;
  }
  return request;
};

const authentication = {
  type: "custom",
  fields: [
    {
      key: "apiKey",
      label: "API key",
      required: true,
      helpText:
        "Find the API Key in your [app settings page](https://postman.co/settings/me/api-keys)",
    },
  ],
  test: test,
  connectionLabel: "{{username}} @ {{teamName}}",
};

module.exports = {
  // This is just shorthand to reference the installed dependencies you have.
  // Zapier will need to know these before we can upload.
  version: require("./package.json").version,
  platformVersion: require("zapier-platform-core").version,

  //authenticating with Postman
  authentication: authentication,

  beforeRequest: [addApiKeyToHeader],

  // If you want your trigger to show up, you better include it here!
  triggers: {
    [getCollection.key]: getCollection,
  },
};
