module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/atoms',
      handler: 'atom.create',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/atoms',
      handler: 'atom.findAll',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/atoms/:atomId',
      handler: 'atom.findOne',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
