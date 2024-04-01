const zapier = require("zapier-platform-core");

// Use this to make test calls into your app:
const App = require("../../index");
const appTester = zapier.createAppTester(App);
// read the `.env` file into the environment, if available
zapier.tools.env.inject();

describe("triggers.collection", () => {
  it("should run", async () => {
    const bundle = {
      inputData: {
        polling_frequency: "day",
      },
      authData: {
        apiKey: process.env.API_KEY,
      },
    };

    const results = await appTester(
      App.triggers["collection"].operation.perform,
      bundle
    );
    expect(results).toBeDefined();
  });
});
