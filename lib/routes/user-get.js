'use strict';

const Joi = require('joi');

module.exports = {
    method: 'get',
    path: '/user/{id}',
    options: {
        tags: ['api'],
        validate: {
            params: Joi.object({ id: Joi.number().integer().required() })
        }
    },
    handler: async (request, h) => {
        const { userService } = request.services();
        return userService.findById(request.params.id);
    }
};