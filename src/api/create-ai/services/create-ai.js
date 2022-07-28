'use strict';

/**
 * create-ai service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::create-ai.create-ai');
