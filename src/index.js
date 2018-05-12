'use strict';
const bodyParser = require('body-parser');
const express = require('express');
const knex = require('knex')(require('../knexfile'));

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
    res.send('API server is running');
});

// 1. As a teacher, I want to register one or more students to a specified teacher.
app.post('/api/register', async function(req, res) {
    const teacherToAdd = req.body.teacher;
    // check if the teacher already exists
    const teacher = await knex('teachers').select('id').where('email', teacherToAdd);
    let teacherId;
    if (!teacher.length) {
        // insert teacher to the teacher table
        teacherId = await knex('teachers').insert({email: teacherToAdd});
    } else {
        teacherId = teacher[0].id;
    }

    // loop through each student
    const registeredStudentPromise = req.body.students.map(student => getRegisterStudentPromise(student));
    await Promise.all(registeredStudentPromise); // wait for the getRegisterStudentPromise function to run for all students
    async function getRegisterStudentPromise(student) {
        const result = await knex('students').select('id').where('email', student);
        let studentId;
        if (!result.length) {
            // else insert students to the student table
            studentId = await knex('students').insert({email: student});
        } else {
            studentId = result[0].id;
        }

        // get relationships for this student-teacher pair
        const relationships = await knex('student_teacher_relationship').where({student_id: studentId, teacher_id: teacherId});
        // map their relationship to the relationship table, if it does not already exist
        if (!relationships.length) {
            await knex('student_teacher_relationship').insert({teacher_id: teacherId, student_id: studentId});
        }
    }

    res.status(204).send();
});

// 2. As a teacher, I want to retrieve a list of students common to a given list of teachers
// (i.e. retrieve students who are registered to ALL of the given teachers).
app.get('/api/commonstudents', async function (req, res) {
    // get the teacher email
    let teacherEmails = req.query.teacher;
    let teacherCount;
    if (!Array.isArray(teacherEmails)) {
        teacherEmails = [teacherEmails];
        teacherCount = 1;
    } else {
        teacherCount = teacherEmails.length;
    }

    // get the student id that matches all teachers
    let queryStudentResults = await knex.select(knex.raw('count(*) as student_count, str.student_id')).groupBy('str.student_id').from('teachers').leftJoin({str: 'student_teacher_relationship'}, 'teachers.id', 'str.teacher_id').whereIn('teachers.email', teacherEmails);
    let studentIds = [];
    queryStudentResults.forEach(function(result) {
        if (result.student_count === teacherCount) {
            studentIds.push(result.student_id);
        }
    });

    // get the student emails
    // let queryEmailResults = await knex('students').select(knex.raw('group_concat(email) as email')).whereIn('id', studentIds);
    let queryEmailResults = await knex('students').pluck('email').whereIn('id', studentIds);

    res.send({students: queryEmailResults});
});
// 3. As a teacher, I want to suspend a specified student.

// 4. As a teacher, I want to retrieve a list of students who can receive a given notification.

app.listen(3000, function() {
    console.log('App listening on port 3000!');
});
