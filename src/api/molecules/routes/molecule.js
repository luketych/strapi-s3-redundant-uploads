module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/molecule',
      handler: 'molecule.create',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/molecules',
      handler: 'molecule.findAll',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/molecules/:moleculeId',
      handler: 'molecule.findOne',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
