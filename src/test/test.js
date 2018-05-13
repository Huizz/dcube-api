const chai = require('chai');
const expect = require('chai').expect;
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const app = require('../index.js');

describe('Endpoint /api/register', function() {
    this.timeout(1000);
    // POST - register students
    it('should add students to db', function() {
        return chai.request(app)
            .post('/api/register')
            .send({
                teacher: 'teacherjoe@gmail.com',
                students:
                    [
                        'studenttan@example.com',
                        'studenthon@example.com'
                    ]
            })
            .then(function(res) {
                expect(res).to.have.status(204);
            });
    });

    // POST - teacher does not exist in system
    it('should return teacher error', function() {
        return chai.request(app)
            .post('/api/register')
            .send({
                teacher: 'teacherong@gmail.com',
                students:
                    [
                        'studenttan@example.com'
                    ]
            })
            .then(function(res) {
                expect(res).to.have.status(400);
                expect(res.body).to.have.keys(['error', 'message']);
                expect(res.body.error).to.equal('teacher');
            });
    });

    // POST - wrong type
    it('should return content type error', function() {
        return chai.request(app)
            .post('/api/register')
            .type('form')
            .send({
                teacher: 'teacherjoe@gmail.com',
                students:
                    [
                        'studenttan@example.com'
                    ]
            })
            .then(function(res) {
                expect(res).to.have.status(400);
                expect(res.body).to.have.keys(['error', 'message']);
                expect(res.body.error).to.equal('content type');
            });
    });
});

describe('Endpoint /api/commonstudents', function() {
    this.timeout(1000);
    // GET - get common students
    it('should add students to db', function() {
        return chai.request(app)
            .get('/api/commonstudents')
            .query({
                teacher: [
                    'teacherjoe@gmail.com',
                    'teacherken@gmail.com'
                ]
            })
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.students).to.be.an('array');
            });
    });

    // GET - no teacher parameter passed
    it('should return query error', function() {
        return chai.request(app)
            .get('/api/commonstudents')
            .then(function(res) {
                expect(res).to.have.status(400);
                expect(res.body).to.have.keys(['error', 'message']);
                expect(res.body.error).to.be.equal('query');
            });
    });
});

describe('Endpoint /api/suspend', function() {
    this.timeout(1000);
    // POST - get common students
    it('should suspend the student', function() {
        return chai.request(app)
            .post('/api/suspend')
            .send({
                student: 'studenttan@example.com'
            })
            .then(function(res) {
                expect(res).to.have.status(204);
            });
    });

    // POST - no such student
    it('should return student error', function() {
        return chai.request(app)
            .post('/api/suspend')
            .send({
                student: 'studentlee@example.com'
            })
            .then(function(res) {
                expect(res).to.have.status(400);
                expect(res.body).to.have.keys(['error', 'message']);
                expect(res.body.error).to.be.equal('student');
            });
    });

    // POST - wrong type
    it('should return content type error', function() {
        return chai.request(app)
            .post('/api/suspend')
            .type('form')
            .send({
                student: 'studenttan@example.com'
            })
            .then(function(res) {
                expect(res).to.have.status(400);
                expect(res.body).to.have.keys(['error', 'message']);
                expect(res.body.error).to.equal('content type');
            });
    });

    // POST - wrong type
    it('should return request error', function() {
        return chai.request(app)
            .post('/api/suspend')
            .send({})
            .then(function(res) {
                expect(res).to.have.status(400);
                expect(res.body).to.have.keys(['error', 'message']);
                expect(res.body.error).to.equal('request');
            });
    });
});

describe('Endpoint /api/retrievefornotifications', function() {
    this.timeout(1000);
    // POST - return matching students including the mentioned student(s)
    it('should return matching students including mentioned student(s)', function() {
        return chai.request(app)
            .post('/api/retrievefornotifications')
            .send({
                teacher: 'teacherken@gmail.com',
                notification: 'Hello students! @studenthon@example.com'
            })
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.key('recipients');
                expect(res.body.recipients).to.be.an('array');
                expect(res.body.recipients).to.include('studenthon@example.com');
            });
    });

    // POST - return matching students
    it('should return matching students', function() {
        return chai.request(app)
            .post('/api/retrievefornotifications')
            .send({
                teacher: 'teacherken@gmail.com',
                notification: 'Hello students!'
            })
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.key('recipients');
                expect(res.body.recipients).to.be.an('array');
            });
    });

    // POST - wrong type
    it('should return content type error', function() {
        return chai.request(app)
            .post('/api/retrievefornotifications')
            .type('form')
            .send({
                teacher: 'teacherken@gmail.com',
                notification: 'Hello students!'
            })
            .then(function(res) {
                expect(res).to.have.status(400);
                expect(res.body).to.have.keys(['error', 'message']);
                expect(res.body.error).to.equal('content type');
            });
    });

    // POST - Missing teacher
    it('should return request error for missing teacher', function() {
        return chai.request(app)
            .post('/api/retrievefornotifications')
            .send({
                notification: 'Hello students!'
            })
            .then(function(res) {
                expect(res).to.have.status(400);
                expect(res.body).to.have.keys(['error', 'message']);
                expect(res.body.error).to.equal('request');
            });
    });

    // POST - Missing notification
    it('should return request error for missing notification', function() {
        return chai.request(app)
            .post('/api/retrievefornotifications')
            .send({
                teacher: 'teacherken@gmail.com'
            })
            .then(function(res) {
                expect(res).to.have.status(400);
                expect(res.body).to.have.keys(['error', 'message']);
                expect(res.body.error).to.equal('request');
            });
    });

    // POST - return matching students
    it('should return student error', function() {
        return chai.request(app)
            .post('/api/retrievefornotifications')
            .send({
                teacher: 'teacherken@gmail.com',
                notification: 'Hello students! @studentjoy@example.com'
            })
            .then(function(res) {
                expect(res).to.have.status(400);
                expect(res.body).to.have.keys(['error', 'message']);
                expect(res.body.error).to.equal('student');
            });
    });
});
