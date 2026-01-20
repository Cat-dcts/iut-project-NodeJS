'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');

module.exports = class FavoriteService extends Service {

    async addFavorite(userId, movieId) {
        const { UserFavorite } = this.server.models();
        const exists = await UserFavorite.query().findOne({ userId, movieId });
        if (exists) {throw Boom.conflict('Already in favorites');}
        return UserFavorite.query().insert({ userId, movieId });
    }

    async removeFavorite(userId, movieId) {
        const { UserFavorite } = this.server.models();
        const deleted = await UserFavorite.query().delete().where({ userId, movieId });
        if (!deleted) {throw Boom.notFound('Not in favorites');}
        return '';
    }

    async listUserFavorites(userId) {
        const { UserFavorite, Movie } = this.server.models();
        return UserFavorite.query()
            .where({ userId })
            .join('movie', 'movie.id', 'user_favorite.movieId')
            .select('movie.*');
    }

    async getUsersWithFavoriteMovie(movieId) {
        const { UserFavorite, User } = this.server.models();
        return User.query()
            .join('user_favorite', 'user.id', 'user_favorite.userId')
            .where('user_favorite.movieId', movieId);
    }
};