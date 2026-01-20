'use strict';

const Joi = require('joi');

module.exports = {
    method: 'delete',
    path: '/user/favorite/{movieId}',
    options: {
        tags: ['api'],
        auth: { scope: ['user', 'admin'] },
        validate: {
            params: Joi.object({
                movieId: Joi.number().integer().required()
            })
        }
    },
    handler: async (request, h) => {
        const { favoriteService } = request.services();
        const userId = request.auth.credentials.id;
        return favoriteService.removeFavorite(userId, request.params.movieId);
    }
};