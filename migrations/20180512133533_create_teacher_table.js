
exports.up = function(knex, Promise) {
  return knex.schema.createTable('teachers', function(table) {
      table.increments('id').primary();
      table.string('email').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('teachers');
};
