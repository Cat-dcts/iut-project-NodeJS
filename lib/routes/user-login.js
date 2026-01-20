'use strict';

const Joi = require('joi');

module.exports = {
    method: 'post',
    path: '/user/login',
    options: {
        auth: false,
        tags: ['api'],
        validate: {
            payload: Joi.object({
                email: Joi.string().email().required(),
                password: Joi.string().min(8).required()
            })
        }
    },
    handler: async (request, h) => {
        const { userService } = request.services();
        const safeUser = await userService.login(request.payload.email, request.payload.password);
        return { login: 'successful', user: safeUser };
    }
};