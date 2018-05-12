
exports.up = function(knex, Promise) {
    return knex.schema.createTable('student_teacher_relationship', function(table) {
        table.integer('teacher_id').notNullable();
        table.integer('student_id').notNullable();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('student_teacher_relationship');
};
