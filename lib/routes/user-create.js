'use strict';

const Joi = require('joi');

module.exports = {
    method: 'post',
    path: '/user',
    options: {
        auth: false,
        tags: ['api'],
        validate: {
            payload: Joi.object({
                firstName: Joi.string().min(3).required(),
                lastName: Joi.string().min(3).required(),
                username: Joi.string().min(3).required(),
                email: Joi.string().email().required(),
                password: Joi.string().min(8).required()
            })
        }
    },
    handler: async (request, h) => {
        const { userService } = request.services();
        return userService.create(request.payload);
    }
};