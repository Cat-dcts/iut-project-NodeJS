'use strict';

module.exports = {
    async up(knex) {
        await knex.schema.createTable('user_favorite', (table) => {
            table.increments('id').primary();
            table.integer('userId').unsigned().notNullable()
                .references('id').inTable('user').onDelete('CASCADE');
            table.integer('movieId').unsigned().notNullable()
                .references('id').inTable('movie').onDelete('CASCADE');
            table.dateTime('createdAt').notNullable().defaultTo(knex.fn.now());
            table.unique(['userId', 'movieId']);
        });
    },
    async down(knex) {
        await knex.schema.dropTableIfExists('user_favorite');
    }
};