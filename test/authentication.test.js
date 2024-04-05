const zapier = require("zapier-platform-core");

// Use this to make test calls into your app:
const App = require("../index");
const appTester = zapier.createAppTester(App);
// read the `.env` file into the environment, if available
zapier.tools.env.inject();

describe("custom auth", () => {
  it("passes authentication and returns json", async () => {
    const bundle = {
      inputData: {},
      authData: {
        apiKey: process.env.API_KEY,
      },
    };

    const authTestResult = await appTester(App.authentication.test, bundle);
    expect(authTestResult)?.toBeDefined();
  });
});
