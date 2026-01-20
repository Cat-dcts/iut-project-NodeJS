'use strict';

const { Service } = require('@hapipal/schmervice');
const { Parser } = require('json2csv');

module.exports = class ExportService extends Service {

    async generateMoviesCsv() {
        const { Movie } = this.server.models();
        const movies = await Movie.query();

        if (movies.length === 0) {
            return Buffer.from('title,description,releaseDate,director\n');
        }

        const parser = new Parser({
            fields: ['title', 'description', 'releaseDate', 'director']
        });

        const csv = parser.parse(movies);
        return Buffer.from(csv);
    }

    async sendCsvToUser(userId) {
        const { User } = this.server.models();
        const { mailService } = this.server.services();

        const user = await User.query().findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const csv = await this.generateMoviesCsv();
        await mailService.sendCsvExport(user, csv);
    }
};