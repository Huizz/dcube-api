'use strict';
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 1. As a teacher, I want to register one or more students to a specified teacher.

// 2. As a teacher, I want to retrieve a list of students common to a given list of teachers
// (i.e. retrieve students who are registered to ALL of the given teachers).

// 3. As a teacher, I want to suspend a specified student.

// 4. As a teacher, I want to retrieve a list of students who can receive a given notification.
