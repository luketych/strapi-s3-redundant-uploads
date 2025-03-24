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

      // Check if an atom with this ID already exists
      const existingAtom = await strapi.db.query('api::atom.atom').findOne({
        where: { atomId: id }
      });

      if (existingAtom) {
        return ctx.conflict('An atom with this ID already exists');
      }

      const entry = await strapi.db.query('api::atom.atom').create({
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
      const atoms = await strapi.db.query('api::atom.atom').findMany({
        populate: true
      });

      return { data: atoms };
    } catch (err) {
      return ctx.badRequest(err.message);
    }
  },

  async findOne(ctx) {
    try {
      const { atomId } = ctx.params;

      const atom = await strapi.db.query('api::atom.atom').findOne({
        where: {
          atomId: atomId
        },
        populate: true
      });

      if (!atom) {
        return ctx.notFound('Atom not found');
      }

      return { data: atom };
    } catch (err) {
      return ctx.badRequest(err.message);
    }
  }
};
