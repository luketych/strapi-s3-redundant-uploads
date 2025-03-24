module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/atoms',
      handler: 'atom.create',
      config: {
        policies: [],
        middlewares: [],
        auth: { enabled: true },
      },
    },
    {
      method: 'GET',
      path: '/atoms',
      handler: 'atom.findAll',
      config: {
        policies: [],
        middlewares: [],
        auth: { enabled: true },
      },
    },
    {
      method: 'GET',
      path: '/atoms/:atomId',
      handler: 'atom.findOne',
      config: {
        policies: [],
        middlewares: [],
        auth: { enabled: true },
      },
    },
  ],
};
