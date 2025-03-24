'use strict';

/**
 * molecule controller
 */

module.exports = {
  async create(ctx) {
    console.log('=== POST /api/molecule endpoint hit ===');
    try {
      const { unique_key } = ctx.request.body;
      
      if (!unique_key) {
        return ctx.badRequest('unique_key is required');
      }

      // Check if an molecule with this ID already exists
      const existingMolecule = await strapi.db.query('api::molecules.molecule').findOne({
        where: { unique_key: unique_key }
      });

      if (existingMolecule) {
        return ctx.conflict('A molecule with this ID already exists');
      }

      const entry = await strapi.db.query('api::molecules.molecule').create({
        data: {
          unique_key: unique_key
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
      const { unique_key } = ctx.params;

      const molecule = await strapi.db.query('api::molecules.molecule').findOne({
        where: {
          unique_key: unique_key
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
