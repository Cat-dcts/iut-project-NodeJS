'use strict';

const HauteCouture = require('@hapipal/haute-couture');
const Package = require('../package.json');

exports.plugin = {
    pkg: Package,
    register: async (server, options) => {

        // HauteCouture se charge de charger les plugins, modèles, services et routes
        await HauteCouture.compose(server, options);
    }
};