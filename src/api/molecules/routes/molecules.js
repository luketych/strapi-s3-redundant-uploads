module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/molecules',
      handler: 'molecules.create',
      config: {
        policies: [],
        middlewares: [],
        auth: { enabled: true },
      },
    },
    {
      method: 'GET',
      path: '/molecules',
      handler: 'molecules.findAll',
      config: {
        policies: [],
        middlewares: [],
        auth: { enabled: true },
      },
    },
    {
      method: 'GET',
      path: '/molecules/:unique_key',
      handler: 'molecules.findOne',
      config: {
        policies: [],
        middlewares: [],
        auth: { enabled: true },
      },
    },
  ],
};
