'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

module.exports = class Movie extends Model {
    static get tableName() { return 'movie'; }

    static get joiSchema() {
        return Joi.object({
            id: Joi.number().integer().greater(0),
            title: Joi.string().min(1).required(),
            description: Joi.string().min(1).required(),
            releaseDate: Joi.date().required(),
            director: Joi.string().min(1).required(),
            createdAt: Joi.date(),
            updatedAt: Joi.date()
        });
    }

    $beforeInsert() {
        const now = new Date();
        this.createdAt = now;
        this.updatedAt = now;
    }

    $beforeUpdate() {
        this.updatedAt = new Date();
    }
};