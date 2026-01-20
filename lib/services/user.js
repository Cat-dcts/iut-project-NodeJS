'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');
const Encrypt = require('@catdcts/iut-encrypt'); // adapte au nom réel
const Jwt = require('@hapi/jwt');

module.exports = class UserService extends Service {

    async create(payload) {
        const { User } = this.server.models();
        const toInsert = { ...payload };
        toInsert.password = Encrypt.sha1(payload.password);
        toInsert.scope = payload.scope || ['user'];

        const user = await User.query().insertAndFetch(toInsert);

        // Appeler mailService ici
        const { mailService } = this.server.services();
        await mailService.sendWelcomeEmail(user);

        delete user.password;
        return user;
    }

    async list() {
        const { User } = this.server.models();
        const users = await User.query();
        return users.map((u) => {
            const { password, ...rest } = u;
            return rest;
        });
    }

    async findById(id) {
        const { User } = this.server.models();
        const user = await User.query().findById(id);
        if (!user) {
            throw Boom.notFound();
        }

        const { password, ...rest } = user;
        return rest;
    }

    async update(id, payload) {
        const { User } = this.server.models();
        const toUpdate = { ...payload };
        if (payload.password) {
            toUpdate.password = Encrypt.sha1(payload.password);
        }

        const updated = await User.query().patchAndFetchById(id, toUpdate);
        if (!updated) {
            throw Boom.notFound();
        }

        const { password, ...rest } = updated;
        return rest;
    }

    async delete(id) {
        const { User } = this.server.models();
        const deleted = await User.query().deleteById(id);
        if (!deleted) {
            throw Boom.notFound();
        }

        return '';
    }

    async login(email, password) {
        const { User } = this.server.models();
        const user = await User.query().findOne({ email });
        if (!user) {
            throw Boom.unauthorized('Invalid email or password');
        }

        const ok = Encrypt.compareSha1(password, user.password);
        if (!ok) {
            throw Boom.unauthorized('Invalid email or password');
        }

        const { password: _, ...safe } = user;  // Définir safe AVANT de l'utiliser

        const token = Jwt.token.generate(
            {
                aud: 'urn:audience:iut',
                iss: 'urn:issuer:iut',
                id: safe.id,
                firstName: safe.firstName,
                lastName: safe.lastName,
                email: safe.email,
                scope: safe.scope
            },
            { key: 'random_string', algorithm: 'HS512' },
            { ttlSec: 14400 }
        );

        return { token, user: safe };
    }
};