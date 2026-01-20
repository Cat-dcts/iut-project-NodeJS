'use strict';

const Joi = require('joi');

module.exports = {
    method: 'delete',
    path: '/user/{id}',
    options: {
        tags: ['api'],
        validate: {
            params: Joi.object({ id: Joi.number().integer().required() })
        }
    },
    handler: async (request, h) => {
        const { userService } = request.services();
        return userService.delete(request.params.id);
    }
};