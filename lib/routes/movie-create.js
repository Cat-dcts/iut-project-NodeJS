'use strict';

const Joi = require('joi');

module.exports = {
    method: 'post',
    path: '/movie',
    options: {
        tags: ['api'],
        auth: { scope: ['admin'] },
        validate: {
            payload: Joi.object({
                title: Joi.string().required(),
                description: Joi.string().required(),
                releaseDate: Joi.date().required(),
                director: Joi.string().required()
            })
        }
    },
    handler: async (request, h) => {
        const { movieService } = request.services();
        return movieService.create(request.payload);
    }
};