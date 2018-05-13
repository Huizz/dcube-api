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
                        'studenttan@example.com'
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


