'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');

module.exports = class MovieService extends Service {

    async create(payload) {
        const { Movie } = this.server.models();
        const movie = await Movie.query().insertAndFetch(payload);

        // Récupérer tous les users et envoyer notification
        const { userService, mailService } = this.server.services();
        try {
            const users = await userService.list();
            await mailService.sendNewMovieNotification(users, movie);
        } catch (err) {
            // Log l'erreur mais ne bloque pas la création du film
            console.error('Erreur lors de l\'envoi des notifications:', err);
        }

        return movie;
    }

    async list() {
        const { Movie } = this.server.models();
        return Movie.query();
    }

    async findById(id) {
        const { Movie } = this.server.models();
        const movie = await Movie.query().findById(id);
        if (!movie) {throw Boom.notFound();}
        return movie;
    }

    async update(id, payload) {
        const { Movie } = this.server.models();
        const updated = await Movie.query().patchAndFetchById(id, payload);
        if (!updated) {throw Boom.notFound();}

        // Récupérer les users ayant ce film en favoris et envoyer notification
        const { favoriteService, mailService } = this.server.services();
        try {
            const users = await favoriteService.getUsersWithFavoriteMovie(id);
            if (users.length > 0) {
                await mailService.sendMovieUpdateNotification(users, updated);
            }
        } catch (err) {
            // Log l'erreur mais ne bloque pas la modification du film
            console.error('Erreur lors de l\'envoi des notifications:', err);
        }

        return updated;
    }

    async delete(id) {
        const { Movie } = this.server.models();
        const deleted = await Movie.query().deleteById(id);
        if (!deleted) {throw Boom.notFound();}
        return '';
    }
};