'use strict';

const { Service } = require('@hapipal/schmervice');
const Nodemailer = require('nodemailer');

module.exports = class MailService extends Service {
    _transporter() {
        return Nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT),
            secure: false,
            auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
        });
    }

    async sendWelcomeEmail(user) {
        const t = this._transporter();
        await t.sendMail({
            from: '"IUT Movies" <noreply@example.com>',
            to: user.email,
            subject: 'Bienvenue',
            text: `Bienvenue ${user.firstName} !`
        });
    }

    async sendNewMovieNotification(users, movie) {
        const t = this._transporter();
        for (const u of users) {
            await t.sendMail({
                from: '"IUT Movies" <noreply@example.com>',
                to: u.email,
                subject: 'Nouveau film ajouté',
                text: `Nouveau film: ${movie.title}`
            });
        }
    }

    async sendMovieUpdateNotification(users, movie) {
        const t = this._transporter();
        for (const u of users) {
            await t.sendMail({
                from: '"IUT Movies" <noreply@example.com>',
                to: u.email,
                subject: 'Film mis à jour',
                text: `Le film ${movie.title} a été mis à jour`
            });
        }
    }

    async sendCsvExport(user, csvBuffer) {
        const t = this._transporter();
        await t.sendMail({
            from: '"IUT Movies" <noreply@example.com>',
            to: user.email,
            subject: 'Export CSV',
            text: 'Voici votre export CSV',
            attachments: [{ filename: 'movies.csv', content: csvBuffer }]
        });
    }
};