'use strict';

const Joi = require('joi');

module.exports = {
    method: 'post',
    path: '/user/favorite',
    options: {
        tags: ['api'],
        auth: { scope: ['user', 'admin'] },
        validate: {
            payload: Joi.object({ movieId: Joi.number().integer().required() })
        }
    },
    handler: async (request, h) => {
        const { favoriteService } = request.services();
        const userId = request.auth.credentials.id;
        return favoriteService.addFavorite(userId, request.payload.movieId);
    }
};