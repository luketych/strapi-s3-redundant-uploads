'use strict';

/**
 * atom controller
 */

module.exports = {
  async create(ctx) {
    console.log('=== POST /api/atom endpoint hit ===');
    try {
      const { id } = ctx.request.body;
      
      if (!id) {
        return ctx.badRequest('ID is required');
      }

      const entry = await strapi.entityService.create('api::atom.atom', {
        data: {
          atomId: id
        }
      });

      return { data: entry };
      
    } catch (err) {
      return ctx.badRequest(err.message);
    }
  },

  async findAll(ctx) {
    try {
      const atoms = await strapi.entityService.findMany('api::atom.atom', {
        populate: '*'
      });

      return { data: atoms };
    } catch (err) {
      return ctx.badRequest(err.message);
    }
  },

  async findOne(ctx) {
    try {
      const { atomId } = ctx.params;

      const atoms = await strapi.entityService.findMany('api::atom.atom', {
        filters: {
          atomId: atomId
        },
        populate: '*'
      });

      if (!atoms || atoms.length === 0) {
        return ctx.notFound('Atom not found');
      }

      return { data: atoms[0] };
    } catch (err) {
      return ctx.badRequest(err.message);
    }
  }
};
