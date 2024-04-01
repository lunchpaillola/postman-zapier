const perform = async (z, bundle) => {
  const currentTime = new Date();
  const lastPoll = await z.cursor.get();
  const pollingFrequency = bundle.inputData.polling_frequency || "default";

  let shouldPoll = false;
  switch (pollingFrequency) {
    case "hour":
      shouldPoll = !lastPoll || currentTime - new Date(lastPoll) >= 3600000;
      break;
    case "day":
      const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      shouldPoll =
        !lastPoll || currentTime - new Date(lastPoll) >= TWENTY_FOUR_HOURS;
      break;
    case "week":
      const oneWeekAgo = new Date(
        currentTime.getTime() - 7 * 24 * 60 * 60 * 1000
      );
      shouldPoll = !lastPoll || new Date(lastPoll) < oneWeekAgo;
      break;
    default:
      shouldPoll = true;
      break;
  }

  if (shouldPoll) {
    try {
      const response = await z.request({
        url: "https://api.getpostman.com/collections",
        method: "GET",
      });
      // Update the cursor with the current time after a successful poll
      await z.cursor.set(currentTime.toISOString());
      return response.data.collections;
    } catch (error) {
      // Log and rethrow the error
      throw new Error("Failed to fetch collections.");
    }
  } else {
    // Re-set the cursor to the lastPoll time to keep it from expiring
    if (lastPoll) {
      await z.cursor.set(lastPoll);
    }
    return [];
  }
  
};

module.exports = {
  // see here for a full list of available properties:
  // https://github.com/zapier/zapier-platform/blob/main/packages/schema/docs/build/schema.md#triggerschema
  key: "collection",
  noun: "Collection",

  display: {
    label: "New Collection",
    description: "Triggers when a new collection is created.",
  },

  operation: {
    perform,
    canPaginate: true,

    // `inputFields` defines the fields a user could provide
    // Zapier will pass them in as `bundle.inputData` later. They're optional.
    inputFields: [
      {
        key: "polling_frequency",
        label: "Polling Frequency",
        type: "string",
        choices: {
          default: "Default (Zapier default interval)",
          hour: "Once an hour",
          day: "Once a day",
          week: "Once a week",
        },
        helpText: "Select how often you want the polling to occur.",
        required: true,
        altersDynamicFields: false,
      },
    ],

    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
    // returned records, and have obvious placeholder values that we can show to any user.
    sample: {
      id: "example_id",
      name: "Example Collection",
      owner: "example_owner",
      createdAt: "2020-01-01T00:00:00Z",
      updatedAt: "2020-01-02T00:00:00Z",
      uid: "example_uid",
      isPublic: true,
    },

    // If fields are custom to each user (like spreadsheet columns), `outputFields` can create human labels
    // For a more complete example of using dynamic fields see
    // https://github.com/zapier/zapier-platform/tree/main/packages/cli#customdynamic-fields
    // Alternatively, a static field definition can be provided, to specify labels for the fields

    outputFields: [
      {
        key: "id",
        label: "ID",
        helpText: "The unique identifier for the collection.",
      },
      {
        key: "name",
        label: "Collection Name",
        helpText: "The name of the collection.",
      },
      {
        key: "owner",
        label: "Owner",
        helpText: "The owner of the collection.",
      },
      {
        key: "createdAt",
        label: "Created At",
        type: "datetime",
        helpText: "The date and time when the collection was created.",
      },
      {
        key: "updatedAt",
        label: "Updated At",
        type: "datetime",
        helpText: "The date and time when the collection was last updated.",
      },
      {
        key: "uid",
        label: "UID",
        helpText: "The unique identifier for the collection in Postman.",
        primary: true,
      },
      {
        key: "isPublic",
        label: "Is Public",
        type: "boolean",
        helpText: "Indicates whether the collection is public or private.",
      },
    ],
  },
};
