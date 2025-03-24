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

      const entry = await strapi.entityService.create('api::molecules.molecule', {
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
      const molecules = await strapi.entityService.findMany('api::molecules.molecule', {
        populate: '*'
      });

      return { data: molecules };
    } catch (err) {
      return ctx.badRequest(err.message);
    }
  },

  async findOne(ctx) {
    try {
      const { moleculeId } = ctx.params;

      const molecules = await strapi.entityService.findMany('api::molecule.molecule', {
        filters: {
          moleculeId: moleculeId
        },
        populate: '*'
      });

      if (!molecules || molecules.length === 0) {
        return ctx.notFound('Molecule not found');
      }

      return { data: molecules[0] };
    } catch (err) {
      return ctx.badRequest(err.message);
    }
  }
};
