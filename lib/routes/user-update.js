'use strict';

const Joi = require('joi');

module.exports = {
    method: 'patch',
    path: '/user/{id}',
    options: {
        tags: ['api'],
        validate: {
            params: Joi.object({ id: Joi.number().integer().required() }),
            payload: Joi.object({
                firstName: Joi.string().min(3),
                lastName: Joi.string().min(3),
                username: Joi.string().min(3),
                email: Joi.string().email(),
                password: Joi.string().min(8)
            }).min(1)
        }
    },
    handler: async (request, h) => {
        const { userService } = request.services();
        return userService.update(request.params.id, request.payload);
    }
};