'use strict';

module.exports = {
    async up(knex) {
        await knex.schema.createTable('user', (table) => {
            table.increments('id').primary();
            table.string('firstName').notNullable();
            table.string('lastName').notNullable();
            table.string('username').notNullable().unique();
            table.string('email').notNullable().unique();
            table.string('password').notNullable();
            table.json('scope').notNullable();  // SANS defaultTo()
            table.dateTime('createdAt').notNullable().defaultTo(knex.fn.now());
            table.dateTime('updatedAt').notNullable().defaultTo(knex.fn.now());
        });
    },
    async down(knex) {
        await knex.schema.dropTableIfExists('user');
    }
};