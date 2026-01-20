'use strict';

const Joi = require('joi');

module.exports = {
    method: 'patch',
    path: '/movie/{id}',
    options: {
        tags: ['api'],
        auth: { scope: ['admin'] },
        validate: {
            params: Joi.object({
                id: Joi.number().integer().required()
            }),
            payload: Joi.object({
                title: Joi.string(),
                description: Joi.string(),
                releaseDate: Joi.date(),
                director: Joi.string()
            }).min(1)
        }
    },
    handler: async (request, h) => {
        const { movieService, favoriteService, mailService } = request.services();
        const updated = await movieService.update(request.params.id, request.payload);

        // Notifier les users ayant ce film en favoris
        const users = await favoriteService.getUsersWithFavoriteMovie(request.params.id);
        if (users.length > 0) {
            await mailService.sendMovieUpdateNotification(users, updated);
        }

        return updated;
    }
};