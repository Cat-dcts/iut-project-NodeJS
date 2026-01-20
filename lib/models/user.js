'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

module.exports = class User extends Model {
    static get tableName() { return 'user'; }

    static get joiSchema() {
        return Joi.object({
            id: Joi.number().integer().greater(0),
            firstName: Joi.string().min(3).required(),
            lastName: Joi.string().min(3).required(),
            username: Joi.string().min(3).required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(8).required(),
            scope: Joi.array().items(Joi.string()).default(['user']),
            createdAt: Joi.date(),
            updatedAt: Joi.date()
        });
    }

    static get jsonAttributes() {
        return ['scope'];
    }

    $beforeInsert() {
        const now = new Date();
        this.createdAt = now;
        this.updatedAt = now;
        if (!this.scope) {
            this.scope = ['user'];
        }
    }

    $beforeUpdate() {
        this.updatedAt = new Date();
    }
};