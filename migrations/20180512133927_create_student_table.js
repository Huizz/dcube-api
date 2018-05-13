
exports.up = function(knex, Promise) {
    return knex.schema.createTableIfNotExists('students', function(table) {
        table.increments('id').primary();
        table.string('email').notNullable();
        table.boolean('suspend').defaultTo(false);
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('students');
};
