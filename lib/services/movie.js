'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');

module.exports = class MovieService extends Service {

    async create(payload) {
        const { Movie } = this.server.models();
        return Movie.query().insertAndFetch(payload);
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
        return updated;
    }

    async delete(id) {
        const { Movie } = this.server.models();
        const deleted = await Movie.query().deleteById(id);
        if (!deleted) {throw Boom.notFound();}
        return '';
    }
};