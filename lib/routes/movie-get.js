'use strict';

const Joi = require('joi');

module.exports = {
    method: 'get',
    path: '/movie/{id}',
    options: {
        tags: ['api'],
        auth: { scope: ['user', 'admin'] },
        validate: {
            params: Joi.object({
                id: Joi.number().integer().required()
            })
        }
    },
    handler: async (request, h) => {
        const { movieService } = request.services();
        return movieService.findById(request.params.id);
    }
};