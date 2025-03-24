'use strict';

/**
 * molecule controller
 */

module.exports = {
  async create(ctx) {
    try {
      const { id } = ctx.request.body;

      if (!id) {
        return ctx.badRequest('ID is required');
      }

      const entry = await strapi.db.query('api::molecules.molecule').create({
        data: {
          moleculeId: id
        }
      });

      return { data: entry };
      
    } catch (err) {
      return ctx.badRequest(err.message);
    }
  },

  async findAll(ctx) {
    try {
      const molecules = await strapi.db.query('api::molecules.molecule').findMany({
        populate: true
      });

      return { data: molecules };
    } catch (err) {
      return ctx.badRequest(err.message);
    }
  },

  async findOne(ctx) {
    try {
      const { moleculeId } = ctx.params;

      const molecule = await strapi.db.query('api::molecules.molecule').findOne({
        where: {
          moleculeId: moleculeId
        },
        populate: true
      });

      if (!molecule) {
        return ctx.notFound('Molecule not found');
      }

      return { data: molecule };
    } catch (err) {
      return ctx.badRequest(err.message);
    }
  }
};
