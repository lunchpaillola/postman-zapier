
// triggers on a new collection with a certain tag
const perform = async (z, bundle) => {
  const response = await z.request({
    url: 'https://api.getpostman.com/collections',
    method: "GET",
 
  });
  // this should return an array of objects
  return response.data.collections;
};

module.exports = {
  // see here for a full list of available properties:
  // https://github.com/zapier/zapier-platform/blob/main/packages/schema/docs/build/schema.md#triggerschema
  key: 'collection',
  noun: 'Collection',

  display: {
    label: 'New Collection',
    description: 'Triggers when a new collection is created.'
  },

  operation: {
    perform,

    // `inputFields` defines the fields a user could provide
    // Zapier will pass them in as `bundle.inputData` later. They're optional.
    inputFields: [],

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
      { key: 'id', label: 'ID', helpText: 'The unique identifier for the collection.' },
      { key: 'name', label: 'Collection Name', helpText: 'The name of the collection.' },
      { key: 'owner', label: 'Owner', helpText: 'The owner of the collection.' },
      { key: 'createdAt', label: 'Created At', type: 'datetime', helpText: 'The date and time when the collection was created.' },
      { key: 'updatedAt', label: 'Updated At', type: 'datetime', helpText: 'The date and time when the collection was last updated.' },
      { key: 'uid', label: 'UID', helpText: 'The unique identifier for the collection in Postman.', primary: true },
      { key: 'isPublic', label: 'Is Public', type: 'boolean', helpText: 'Indicates whether the collection is public or private.' }
    ]
    
  }
};
