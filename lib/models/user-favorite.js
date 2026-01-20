'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

module.exports = class UserFavorite extends Model {
    static get tableName() { return 'user_favorite'; }

    static get joiSchema() {
        return Joi.object({
            id: Joi.number().integer().greater(0),
            userId: Joi.number().integer().required(),
            movieId: Joi.number().integer().required(),
            createdAt: Joi.date()
        });
    }

    $beforeInsert() {
        this.createdAt = new Date();
    }
};