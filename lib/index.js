'use strict';

const HauteCouture = require('@hapipal/haute-couture');
const Package = require('../package.json');

exports.plugin = {
    pkg: Package,
    register: async (server, options) => {

        // HauteCouture se charge de charger les plugins, modèles, services et routes
        await HauteCouture.compose(server, options);
        // Servir les fichiers statiques
        server.route({
            method: 'GET',
            path: '/',
            options: {
                auth: false  // Désactiver auth pour cette route
            },
            handler: (request, h) => {
                return h.file(`${__dirname}/../public/index.html`);
            }
        });
    }
};