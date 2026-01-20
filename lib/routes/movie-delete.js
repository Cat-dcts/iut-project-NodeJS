'use strict';

const Joi = require('joi');

module.exports = {
    method: 'delete',
    path: '/movie/{id}',
    options: {
        tags: ['api'],
        auth: { scope: ['admin'] },
        validate: {
            params: Joi.object({
                id: Joi.number().integer().required()
            })
        }
    },
    handler: async (request, h) => {
        const { movieService } = request.services();
        return movieService.delete(request.params.id);
    }
};