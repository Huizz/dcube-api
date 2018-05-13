
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTableIfNotExists('teachers', function(table) {
            table.increments('id').primary();
            table.string('email').notNullable();
        }).then(function() {
            return knex('teachers').insert([
                {email: 'teacherken@gmail.com'},
                {email: 'teacherjoe@gmail.com'},
                {email: 'teacherdavid@gmail.com'}
            ]);
        })
    ]);
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('teachers');
};
